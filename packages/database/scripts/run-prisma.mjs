/**
 * CareerOS — Guarded Prisma CLI Runner
 * Ensures explicit environment loading and validates target safety before executing Prisma CLI.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Resolve monorepo root deterministically
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
  console.error('[PRISMA RUNNER ERROR] Unable to locate monorepo root (pnpm-workspace.yaml).');
  process.exit(1);
}

// 2. Deterministically load root .env
const envPath = path.join(rootDir, '.env');
if (!fs.existsSync(envPath)) {
  console.error(`[PRISMA RUNNER ERROR] Root .env file not found at: ${envPath}`);
  process.exit(1);
}

const envConfig = {};
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    envConfig[key] = val;
  }
}

const targetUrl = process.env.DATABASE_URL || envConfig.DATABASE_URL;
if (!targetUrl) {
  console.error(
    '[PRISMA RUNNER ERROR] DATABASE_URL is not set in root .env or process environment.',
  );
  process.exit(1);
}

// 3. Validate Target Safety Guard
const environment = process.env.NODE_ENV || 'development';
try {
  const parsed = new URL(targetUrl);
  if (environment !== 'production') {
    if (parsed.hostname !== '127.0.0.1' && parsed.hostname !== 'localhost') {
      throw new Error(
        `Host "${parsed.hostname}" is forbidden for local development. Must be 127.0.0.1.`,
      );
    }
    if (parsed.port !== '5433') {
      throw new Error(
        `Port "${parsed.port}" is forbidden. Must be 5433 to protect native PostgreSQL on 5432.`,
      );
    }
    const dbName = parsed.pathname.replace(/^\//, '');
    const allowedDbs = ['careeros_dev_db', 'careeros_local_dev', 'careeros_test_db'];
    if (!allowedDbs.includes(dbName)) {
      throw new Error(`Database "${dbName}" is not an authorized local database name.`);
    }
  }
} catch (err) {
  console.error(`[PRISMA RUNNER SECURITY ERROR] ${err.message}`);
  process.exit(1);
}

// 4. Pass validated DATABASE_URL to child process environment
const childEnv = {
  ...process.env,
  DATABASE_URL: targetUrl,
};

// 5. Execute Prisma CLI with passed arguments
const prismaArgs = process.argv.slice(2);
const npxCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const result = spawnSync(npxCmd, ['exec', 'prisma', ...prismaArgs], {
  cwd: path.resolve(__dirname, '..'),
  env: childEnv,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 0);
