import { createHash, randomBytes } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { hash, verify, argon2id } from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { SESSION_ABSOLUTE_TTL_MS, SESSION_IDLE_TTL_MS } from './auth.constants';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { LoginAbuseLimiter } from './login-abuse.limiter';

export type PublicUser = Pick<User, 'id' | 'email' | 'createdAt'>;

export interface SessionCredentials {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedSession {
  user: PublicUser;
  sessionId: string;
}

interface AccessTokenPayload {
  sub: string;
  sid: string;
}

const INVALID_CREDENTIALS = 'Invalid credentials';

/** Fixed argon2id hash used when no User exists, so verification timing stays similar. */
const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$SrWWahlY/PsKgR4XiD1A/w$+jEOAqQ6YkGS+T/0f54SKrSY4TlMYBeGFtimNvX9co4';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isEmailConflict(error: unknown): boolean {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== 'P2002' ||
    error.meta?.modelName !== 'User'
  ) {
    return false;
  }

  const adapterError: unknown = error.meta.driverAdapterError;

  if (!isRecord(adapterError) || !isRecord(adapterError.cause)) {
    return false;
  }

  const constraint: unknown = adapterError.cause.constraint;

  if (!isRecord(constraint)) {
    return false;
  }

  const fields: unknown = constraint.fields;

  return Array.isArray(fields) && fields.length === 1 && fields[0] === 'email';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly abuse: LoginAbuseLimiter,
  ) {}

  async register(input: RegisterDto): Promise<SessionCredentials> {
    const hashResult: unknown = await hash(input.password, { type: argon2id });

    if (typeof hashResult !== 'string') {
      throw new TypeError('Argon2 returned an unexpected hash');
    }

    const refreshToken = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const now = new Date();

    try {
      const { user, session } = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: input.email,
            passwordHash: hashResult,
          },
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        });
        const session = await this.createSession(tx, user.id, now, tokenHash);

        return { user, session };
      });

      return {
        user,
        accessToken: await this.signAccessToken(user.id, session.id),
        refreshToken,
      };
    } catch (error: unknown) {
      if (isEmailConflict(error)) {
        throw new ConflictException('Email is unavailable');
      }

      throw error;
    }
  }

  async login(input: LoginDto, ip: string): Promise<SessionCredentials> {
    this.abuse.assertAllowed(input.email, ip);

    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: {
        id: true,
        email: true,
        createdAt: true,
        passwordHash: true,
      },
    });

    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
    let passwordMatches = false;

    try {
      passwordMatches = await verify(passwordHash, input.password);
    } catch {
      passwordMatches = false;
    }

    if (!user || !passwordMatches) {
      this.abuse.recordFailure(input.email, ip);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    this.abuse.clearEmail(input.email);

    return this.issueSession({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  }

  async authenticateAccessToken(
    accessToken: string | undefined,
  ): Promise<AuthenticatedSession> {
    if (!accessToken) {
      throw new UnauthorizedException('Authentication is required');
    }

    let payload: AccessTokenPayload;

    try {
      payload = await this.jwt.verifyAsync<AccessTokenPayload>(accessToken);
    } catch {
      throw new UnauthorizedException('Authentication is required');
    }

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.sid !== 'string' ||
      payload.sub.length === 0 ||
      payload.sid.length === 0
    ) {
      throw new UnauthorizedException('Authentication is required');
    }

    const session = await this.prisma.session.findUnique({
      where: { id: payload.sid },
      select: {
        id: true,
        userId: true,
        revokedAt: true,
        idleExpiresAt: true,
        absoluteExpiresAt: true,
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
    const now = new Date();

    if (
      !session ||
      session.userId !== payload.sub ||
      session.revokedAt !== null ||
      session.absoluteExpiresAt <= now ||
      session.idleExpiresAt <= now
    ) {
      throw new UnauthorizedException('Authentication is required');
    }

    return {
      user: session.user,
      sessionId: session.id,
    };
  }

  private async issueSession(user: PublicUser): Promise<SessionCredentials> {
    const refreshToken = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const now = new Date();
    const session = await this.prisma.$transaction(async (tx) =>
      this.createSession(tx, user.id, now, tokenHash),
    );

    return {
      user,
      accessToken: await this.signAccessToken(user.id, session.id),
      refreshToken,
    };
  }

  private async createSession(
    tx: Prisma.TransactionClient,
    userId: string,
    now: Date,
    tokenHash: string,
  ): Promise<{ id: string }> {
    const idleExpiresAt = new Date(now.getTime() + SESSION_IDLE_TTL_MS);
    const absoluteExpiresAt = new Date(now.getTime() + SESSION_ABSOLUTE_TTL_MS);
    const session = await tx.session.create({
      data: {
        userId,
        lastUsedAt: now,
        idleExpiresAt,
        absoluteExpiresAt,
      },
      select: {
        id: true,
      },
    });

    await tx.refreshCredential.create({
      data: {
        sessionId: session.id,
        tokenHash,
        expiresAt: absoluteExpiresAt,
      },
    });

    return session;
  }

  private signAccessToken(userId: string, sessionId: string): Promise<string> {
    return this.jwt.signAsync({
      sub: userId,
      sid: sessionId,
    });
  }
}
