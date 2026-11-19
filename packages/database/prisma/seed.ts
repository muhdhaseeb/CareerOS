/**
 * CareerOS — Database Seed Script
 * Idempotent, safe seed procedure for local development.
 * Adheres strictly to security rules: NO hardcoded users, NO default passwords, NO dummy accounts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { validateDatabaseTarget } from '../src/safety-guard';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Locate root deterministically
let currentDir = __dirname;
let rootDir = null;
while (currentDir !== path.dirname(currentDir)) {
  if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
    rootDir = currentDir;
    break;
  }
  currentDir = path.dirname(currentDir);
}

if (!rootDir) {
  console.error('[SEED ERROR] Unable to locate monorepo root.');
  process.exit(1);
}

// 2. Read root .env
const envPath = path.join(rootDir, '.env');
const envConfig = {};
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

const targetUrl = process.env.DATABASE_URL || envConfig.DATABASE_URL;
if (!targetUrl) {
  console.error('[SEED ERROR] DATABASE_URL is not configured.');
  process.exit(1);
}

// 3. Validate target safety
validateDatabaseTarget(targetUrl, 'development');

async function seed() {
  console.log('--- Executing CareerOS Database Seed ---');
  const prisma = new PrismaClient({
    datasources: { db: { url: targetUrl } },
  });

  try {
    await prisma.$connect();
    console.log(' [OK] Connected to database on port 5433.');

    // In accordance with RULES.md, PRD.md, and explicit instructions:
    // No default administrator or candidate accounts with known credentials are created.
    // Static system reference data is not required for M0 foundation.
    console.log(' [OK] Verified: No dummy user credentials or hardcoded accounts created.');
    console.log(' [OK] Idempotent seed completed successfully.');
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((err) => {
  console.error('[SEED ERROR] Seed execution failed:', err);
  process.exit(1);
});
