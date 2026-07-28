import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class SameOriginGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const allowedOrigins =
      this.config.getOrThrow<string[]>('FRONTEND_ORIGIN');
    const origin = request.get('origin');

    if (!origin || !allowedOrigins.includes(origin)) {
      throw new ForbiddenException('Origin is not allowed');
    }

    return true;
  }
}
