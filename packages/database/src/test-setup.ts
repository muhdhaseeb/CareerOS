/**
 * CareerOS — Integration Test Database Setup & Safety Harness
 * Enforces execution strictly against careeros_test_db.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { validateDatabaseTarget } from './safety-guard';

export function getTestDatabaseUrl(): string {
  // 1. Locate root deterministically
  let currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
  let rootDir = null;
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      rootDir = currentDir;
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  if (!rootDir) {
    throw new Error('[TEST HARNESS ERROR] Unable to locate monorepo root.');
  }

  // 2. Read root .env
  const envPath = path.join(rootDir, '.env');
  const envConfig: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        envConfig[key] = val;
      }
    }
  }

  const testUrl = process.env.DATABASE_URL_TEST || envConfig.DATABASE_URL_TEST;
  if (!testUrl) {
    throw new Error(
      '[TEST HARNESS ERROR] DATABASE_URL_TEST is not set. Refusing to run tests against ambient or development database.',
    );
  }

  // 3. Validate strict test target (host 127.0.0.1, port 5433, db careeros_test_db)
  validateDatabaseTarget(testUrl, 'test');

  return testUrl;
}

export function createTestPrismaClient(): PrismaClient {
  const testUrl = getTestDatabaseUrl();
  return new PrismaClient({
    datasources: { db: { url: testUrl } },
  });
}
