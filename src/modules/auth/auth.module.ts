import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_TTL_SECONDS } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthCookiesService } from './auth-cookies.service';
import { AuthService } from './auth.service';
import { SameOriginGuard } from './guards/same-origin.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import {
  DEFAULT_LOGIN_ABUSE_OPTIONS,
  LOGIN_ABUSE_OPTIONS,
  LoginAbuseLimiter,
} from './login-abuse.limiter';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: Buffer.from(
          config.getOrThrow<string>('JWT_ACCESS_SECRET'),
          'base64',
        ),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCookiesService,
    SameOriginGuard,
    SessionAuthGuard,
    { provide: LOGIN_ABUSE_OPTIONS, useValue: DEFAULT_LOGIN_ABUSE_OPTIONS },
    LoginAbuseLimiter,
  ],
  exports: [SessionAuthGuard, AuthService],
})
export class AuthModule {}
