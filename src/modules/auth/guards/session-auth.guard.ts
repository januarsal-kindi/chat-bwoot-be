import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, type PublicUser } from '../auth.service';

export type AuthenticatedRequest = Request & {
  user: PublicUser;
  sessionId: string;
};

function readAccessToken(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');

    if (separator === -1) {
      continue;
    }

    if (part.slice(0, separator).trim() !== 'access_token') {
      continue;
    }

    return decodeURIComponent(part.slice(separator + 1).trim());
  }

  return undefined;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const session = await this.auth.authenticateAccessToken(
      readAccessToken(request.headers.cookie),
    );
    const authenticated = request as AuthenticatedRequest;

    authenticated.user = session.user;
    authenticated.sessionId = session.sessionId;

    return true;
  }
}
