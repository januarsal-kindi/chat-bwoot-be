import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';
import { PrismaService } from './../src/prisma/prisma.service';

function cookieHeader(
  setCookie: string | string[] | undefined,
): string[] | undefined {
  if (setCookie === undefined) {
    return undefined;
  }

  return Array.isArray(setCookie) ? setCookie : [setCookie];
}

function accessCookie(setCookie: string | string[] | undefined): string {
  const cookie = cookieHeader(setCookie)?.find((value) =>
    value.startsWith('access_token='),
  );

  if (!cookie) {
    throw new Error('access_token cookie was not set');
  }

  return cookie.split(';')[0]!;
}

function accessTokenValue(setCookie: string | string[] | undefined): string {
  return accessCookie(setCookie).slice('access_token='.length);
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split('.')[1];

  if (!payload) {
    throw new Error('JWT payload is missing');
  }

  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<
    string,
    unknown
  >;
}

describe('Current User (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await app.get(PrismaService).user.deleteMany();
  });

  async function registerSession(email = 'user@example.com') {
    const registration = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Origin', 'http://localhost:5173')
      .send({
        email,
        password: 'a secure passphrase',
      })
      .expect(201);

    return {
      body: registration.body as { id: string; email: string; createdAt: string },
      cookie: accessCookie(registration.headers['set-cookie']),
      token: accessTokenValue(registration.headers['set-cookie']),
    };
  }

  it('returns the public User for a valid registration access cookie', async () => {
    const registration = await registerSession();
    const payload = decodeJwtPayload(registration.token);

    expect(Object.keys(payload).sort()).toEqual(['exp', 'iat', 'sid', 'sub']);
    expect(payload.sub).toBe(registration.body.id);
    expect(typeof payload.sid).toBe('string');
    expect(typeof payload.iat).toBe('number');
    expect(typeof payload.exp).toBe('number');

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', registration.cookie)
      .expect(200);
    const body: unknown = response.body;

    expect(body).toEqual(registration.body);
    expect(Object.keys(body as Record<string, unknown>).sort()).toEqual([
      'createdAt',
      'email',
      'id',
    ]);
  });

  it.each([
    ['a missing access cookie', undefined],
    ['a malformed access JWT', 'access_token=not-a-jwt'],
    [
      'an incorrectly signed access JWT',
      'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTQwMDAtODAwMC0wMDAwMDAwMDAwMDAiLCJzaWQiOiIwMDAwMDAwMC0wMDAwLTQwMDAtODAwMC0wMDAwMDAwMDAwMDEifQ.invalid-signature',
    ],
  ])('rejects %s', async (_scenario, cookie) => {
    const requestBuilder = request(app.getHttpServer()).get('/auth/me');

    if (cookie) {
      requestBuilder.set('Cookie', cookie);
    }

    await requestBuilder.expect(401);
  });

  it('rejects an expired access JWT', async () => {
    const registration = await registerSession();
    const payload = decodeJwtPayload(registration.token);
    const expiredToken = await app.get(JwtService).signAsync(
      {
        sub: payload.sub,
        sid: payload.sid,
      },
      { expiresIn: -1 },
    );

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', `access_token=${expiredToken}`)
      .expect(401);
  });

  it('rejects an unknown Session even with a valid JWT', async () => {
    const registration = await registerSession();
    const token = await app.get(JwtService).signAsync({
      sub: registration.body.id,
      sid: randomUUID(),
    });

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', `access_token=${token}`)
      .expect(401);
  });

  it('rejects a revoked Session even with a valid JWT', async () => {
    const registration = await registerSession();
    const payload = decodeJwtPayload(registration.token);

    await app.get(PrismaService).session.update({
      where: { id: payload.sid as string },
      data: { revokedAt: new Date() },
    });

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', registration.cookie)
      .expect(401);
  });

  it('rejects an absolutely expired Session even with a valid JWT', async () => {
    const registration = await registerSession();
    const payload = decodeJwtPayload(registration.token);

    await app.get(PrismaService).session.update({
      where: { id: payload.sid as string },
      data: { absoluteExpiresAt: new Date(0) },
    });

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', registration.cookie)
      .expect(401);
  });

  it('rejects an idle-expired Session even with a valid JWT', async () => {
    const registration = await registerSession();
    const payload = decodeJwtPayload(registration.token);

    await app.get(PrismaService).session.update({
      where: { id: payload.sid as string },
      data: { idleExpiresAt: new Date(0) },
    });

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', registration.cookie)
      .expect(401);
  });
});
