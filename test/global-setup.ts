import { execFileSync } from 'node:child_process';
import { TEST_DATABASE_URL } from './test-environment';

export default function globalSetup(): void {
  execFileSync('npm', ['exec', '--', 'prisma', 'migrate', 'deploy'], {
    env: {
      ...process.env,
      DATABASE_URL: TEST_DATABASE_URL,
    },
    stdio: 'inherit',
  });
}
