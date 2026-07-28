import { envValidationSchema } from './env.validation';

const validEnvironment = {
  NODE_ENV: 'production',
  PORT: 3000,
  DATABASE_URL: 'postgresql://user:password@localhost:5432/chatbot',
  JWT_ACCESS_SECRET: 'dGVzdC1vbmx5LWFjY2Vzcy1zZWNyZXQtMzItYnl0ZSE=',
  GEMINI_API_KEY: 'test-key',
  FRONTEND_ORIGIN: 'https://chatbot.example.com',
};

describe('environment validation', () => {
  it('accepts safe production authentication configuration', () => {
    expect(
      envValidationSchema.validate(validEnvironment).error,
    ).toBeUndefined();
  });

  it('parses comma-separated origins into a unique list', () => {
    const { error, value } = envValidationSchema.validate({
      ...validEnvironment,
      FRONTEND_ORIGIN:
        'https://chatbot.example.com, https://app.example.com, https://chatbot.example.com',
    });

    expect(error).toBeUndefined();
    expect(value.FRONTEND_ORIGIN).toEqual([
      'https://chatbot.example.com',
      'https://app.example.com',
    ]);
  });

  it.each([
    ['a deployment mode', { NODE_ENV: undefined }],
    ['a PostgreSQL URL', { DATABASE_URL: 'mysql://localhost/chatbot' }],
    ['a 32-byte encoded JWT secret', { JWT_ACCESS_SECRET: 'short-secret' }],
    ['an HTTPS production origin', { FRONTEND_ORIGIN: 'http://example.com' }],
    [
      'a canonical origin without a path',
      { FRONTEND_ORIGIN: 'https://example.com/path' },
    ],
    [
      'only valid origins in a list',
      {
        FRONTEND_ORIGIN: 'https://chatbot.example.com,https://evil.example/path',
      },
    ],
  ])('rejects configuration without %s', (_scenario, override) => {
    const environment = { ...validEnvironment, ...override };

    expect(envValidationSchema.validate(environment).error).toBeDefined();
  });
});
