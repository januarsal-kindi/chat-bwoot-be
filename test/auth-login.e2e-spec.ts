import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';
import {
  LOGIN_ABUSE_OPTIONS,
  LoginAbuseLimiter,
} from './../src/modules/auth/login-abuse.limiter';
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

  return JSON.parse(
    Buffer.from(payload, 'base64url').toString('utf8'),
  ) as Record<string, unknown>;
}

describe('User sign-in (e2e)', () => {
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

  async function register(
    email = 'user@example.com',
    password = 'a secure passphrase',
  ) {
    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Origin', 'http://localhost:5173')
      .send({ email, password })
      .expect(201);
  }

  it('signs in with an independent Session and authorizes /auth/me', async () => {
    const registration = await register('  User@Example.com ');

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({
        email: '  USER@example.com ',
        password: 'a secure passphrase',
      })
      .expect(200);

    expect(login.body).toEqual(registration.body);
    expect(Object.keys(login.body as Record<string, unknown>).sort()).toEqual([
      'createdAt',
      'email',
      'id',
    ]);

    const cookies = cookieHeader(login.headers['set-cookie']);

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^access_token=.+; Max-Age=900; Path=\/;/),
        expect.stringMatching(
          /^refresh_token=.+; Max-Age=2592000; Path=\/auth;/,
        ),
      ]),
    );

    const registrationSid = decodeJwtPayload(
      accessTokenValue(registration.headers['set-cookie']),
    ).sid;
    const loginSid = decodeJwtPayload(
      accessTokenValue(login.headers['set-cookie']),
    ).sid;

    expect(loginSid).not.toBe(registrationSid);

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', accessCookie(login.headers['set-cookie']))
      .expect(200)
      .expect(registration.body);

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', accessCookie(registration.headers['set-cookie']))
      .expect(200)
      .expect(registration.body);
  });

  it('returns the same unauthorized response for unknown email and wrong password', async () => {
    await register();

    const unknownEmail = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({
        email: 'missing@example.com',
        password: 'a secure passphrase',
      })
      .expect(401);

    const wrongPassword = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({
        email: 'user@example.com',
        password: 'not the right passphrase',
      })
      .expect(401);

    expect(unknownEmail.body).toEqual(wrongPassword.body);
    expect(unknownEmail.body).toEqual(
      expect.objectContaining({
        statusCode: 401,
        message: 'Invalid credentials',
      }),
    );
  });

  it('accepts only the configured same origin', async () => {
    await register();
    const body = {
      email: 'user@example.com',
      password: 'a secure passphrase',
    };

    await request(app.getHttpServer()).post('/auth/login').send(body).expect(403);
    await request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'https://attacker.example')
      .send(body)
      .expect(403);
    await request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send(body)
      .expect(200);
  });

  it.each([
    ['an invalid email', { email: 'not-an-email', password: 'a'.repeat(12) }],
    [
      'a short password',
      { email: 'user@example.com', password: 'a'.repeat(11) },
    ],
    [
      'an unknown field',
      {
        email: 'user@example.com',
        password: 'a'.repeat(12),
        role: 'admin',
      },
    ],
  ])('rejects %s', async (_scenario, body) => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send(body)
      .expect(400);
  });
});

describe('User sign-in abuse controls (e2e)', () => {
  let app: INestApplication<App>;
  let now = 1_000_000;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LOGIN_ABUSE_OPTIONS)
      .useValue({
        maxFailures: 3,
        windowMs: 1_000,
        now: () => now,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    now = 1_000_000;
    app.get(LoginAbuseLimiter).clear();
    await app.get(PrismaService).user.deleteMany();
  });

  async function register(email: string) {
    await request(app.getHttpServer())
      .post('/auth/register')
      .set('Origin', 'http://localhost:5173')
      .send({
        email,
        password: 'a secure passphrase',
      })
      .expect(201);
  }

  function failLogin(email: string) {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({
        email,
        password: 'wrong password!!',
      });
  }

  it('limits repeated failures for the same email and recovers after the window', async () => {
    await register('user@example.com');

    await failLogin('user@example.com').expect(401);
    await failLogin('user@example.com').expect(401);
    await failLogin('user@example.com').expect(401);
    await failLogin('user@example.com').expect(429);

    now += 1_001;

    await request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({
        email: 'user@example.com',
        password: 'a secure passphrase',
      })
      .expect(200);
  });

  it('limits by source IP across different emails', async () => {
    await register('one@example.com');
    await register('two@example.com');
    await register('three@example.com');
    await register('four@example.com');

    await failLogin('one@example.com').expect(401);
    await failLogin('two@example.com').expect(401);
    await failLogin('three@example.com').expect(401);
    await failLogin('four@example.com').expect(429);

    now += 1_001;

    await request(app.getHttpServer())
      .post('/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({
        email: 'four@example.com',
        password: 'a secure passphrase',
      })
      .expect(200);
  });
});
