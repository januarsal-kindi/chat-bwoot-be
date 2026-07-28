import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';
import { PrismaService } from './../src/prisma/prisma.service';

describe('User registration (e2e)', () => {
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

  it('registers a User and establishes a Session', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Origin', 'http://localhost:5173')
      .send({
        email: '  User@Example.com ',
        password: 'a secure passphrase',
      })
      .expect(201);
    const body: unknown = response.body;

    expect(body).toEqual(
      expect.objectContaining({
        email: 'user@example.com',
      }),
    );
    expect(Object.keys(body as Record<string, unknown>).sort()).toEqual([
      'createdAt',
      'email',
      'id',
    ]);
    expect(typeof (body as Record<string, unknown>).id).toBe('string');
    expect(typeof (body as Record<string, unknown>).createdAt).toBe('string');

    const cookies = response.headers['set-cookie'] as unknown as string[];

    expect(cookies).toHaveLength(2);
    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^access_token=.+; Max-Age=900; Path=\/; Expires=.+; HttpOnly; SameSite=Lax$/,
        ),
        expect.stringMatching(
          /^refresh_token=.+; Max-Age=2592000; Path=\/auth; Expires=.+; HttpOnly; SameSite=Lax$/,
        ),
      ]),
    );
  });

  it.each([12, 128])(
    'accepts a password containing %i characters',
    async (length) => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .set('Origin', 'http://localhost:5173')
        .send({
          email: 'user@example.com',
          password: 'a'.repeat(length),
        })
        .expect(201);
    },
  );

  it('rejects an equivalent normalized email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .set('Origin', 'http://localhost:5173')
      .send({
        email: 'user@example.com',
        password: 'a secure passphrase',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Origin', 'http://localhost:5173')
      .send({
        email: '  USER@example.com ',
        password: 'another secure passphrase',
      })
      .expect(409);
    const body: unknown = response.body;

    expect(body).toEqual(
      expect.objectContaining({
        message: 'Email is unavailable',
      }),
    );
  });

  it.each([
    ['an invalid email', { email: 'not-an-email', password: 'a'.repeat(12) }],
    [
      'a short password',
      { email: 'user@example.com', password: 'a'.repeat(11) },
    ],
    [
      'a long password',
      { email: 'user@example.com', password: 'a'.repeat(129) },
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
      .post('/auth/register')
      .set('Origin', 'http://localhost:5173')
      .send(body)
      .expect(400);
  });

  it('accepts only the configured same origin', async () => {
    const body = {
      email: 'user@example.com',
      password: 'a secure passphrase',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(body)
      .expect(403);
    await request(app.getHttpServer())
      .post('/auth/register')
      .set('Origin', 'https://attacker.example')
      .send(body)
      .expect(403);
    await request(app.getHttpServer())
      .post('/auth/register')
      .set('Origin', 'http://localhost:5173')
      .send(body)
      .expect(201);
  });

  it('sets Secure cookies in production', async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        getOrThrow: (key: string) => {
          const values: Record<string, string | string[]> = {
            DATABASE_URL: process.env.DATABASE_URL!,
            FRONTEND_ORIGIN: ['https://chatbot.example.com'],
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
            NODE_ENV: 'production',
          };

          return values[key];
        },
      })
      .compile();
    const productionApp =
      moduleFixture.createNestApplication<INestApplication<App>>();
    configureApp(productionApp);

    try {
      await productionApp.init();
      await productionApp.get(PrismaService).user.deleteMany();

      const response = await request(productionApp.getHttpServer())
        .post('/auth/register')
        .set('Origin', 'https://chatbot.example.com')
        .send({
          email: 'user@example.com',
          password: 'a secure passphrase',
        })
        .expect(201);
      const cookies = response.headers['set-cookie'] as unknown as string[];

      expect(cookies).toHaveLength(2);
      expect(cookies.every((cookie) => cookie.includes('; Secure;'))).toBe(
        true,
      );
    } finally {
      await productionApp.close();
    }
  });
});
