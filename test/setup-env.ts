import { TEST_DATABASE_URL } from './test-environment';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = TEST_DATABASE_URL;
process.env.JWT_ACCESS_SECRET = 'dGVzdC1vbmx5LWFjY2Vzcy1zZWNyZXQtMzItYnl0ZSE=';
process.env.GEMINI_API_KEY = 'test-gemini-api-key';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
