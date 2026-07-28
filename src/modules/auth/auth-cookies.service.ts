import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  SESSION_ABSOLUTE_TTL_MS,
} from './auth.constants';

@Injectable()
export class AuthCookiesService {
  constructor(private readonly config: ConfigService) {}

  setSession(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie('access_token', accessToken, {
      ...this.baseOptions(),
      maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
      path: '/',
    });
    response.cookie('refresh_token', refreshToken, {
      ...this.baseOptions(),
      maxAge: SESSION_ABSOLUTE_TTL_MS,
      path: '/auth',
    });
  }

  private baseOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.getOrThrow<string>('NODE_ENV') === 'production',
    };
  }
}
