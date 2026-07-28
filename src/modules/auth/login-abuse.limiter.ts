import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  LOGIN_FAILURE_WINDOW_MS,
  LOGIN_MAX_FAILURES,
} from './auth.constants';

export interface LoginAbuseOptions {
  maxFailures: number;
  windowMs: number;
  now?: () => number;
}

export const LOGIN_ABUSE_OPTIONS = Symbol('LOGIN_ABUSE_OPTIONS');

export const DEFAULT_LOGIN_ABUSE_OPTIONS: LoginAbuseOptions = {
  maxFailures: LOGIN_MAX_FAILURES,
  windowMs: LOGIN_FAILURE_WINDOW_MS,
};

@Injectable()
export class LoginAbuseLimiter {
  // ponytail: process-local Map — fine for one replica; upgrade to shared store before horizontal scaling
  private readonly attempts = new Map<string, number[]>();

  constructor(
    @Inject(LOGIN_ABUSE_OPTIONS) private readonly options: LoginAbuseOptions,
  ) {}

  assertAllowed(email: string, ip: string): void {
    if (this.isLimited(`email:${email}`) || this.isLimited(`ip:${ip}`)) {
      throw new HttpException(
        'Too many sign-in attempts',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  recordFailure(email: string, ip: string): void {
    this.record(`email:${email}`);
    this.record(`ip:${ip}`);
  }

  clearEmail(email: string): void {
    this.attempts.delete(`email:${email}`);
  }

  clear(): void {
    this.attempts.clear();
  }

  private isLimited(key: string): boolean {
    return this.prune(key).length >= this.options.maxFailures;
  }

  private record(key: string): void {
    const recent = this.prune(key);
    recent.push(this.now());
    this.attempts.set(key, recent);
  }

  private prune(key: string): number[] {
    const windowStart = this.now() - this.options.windowMs;
    const recent = (this.attempts.get(key) ?? []).filter(
      (timestamp) => timestamp > windowStart,
    );

    this.attempts.set(key, recent);
    return recent;
  }

  private now(): number {
    return this.options.now?.() ?? Date.now();
  }
}
