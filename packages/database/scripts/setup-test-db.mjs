/**
 * CareerOS — Isolated Test Database Provisioning Script
 * Provisions "careeros_test_db" and applies migrations strictly in isolation from development data.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

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
  console.error('[TEST DB SETUP ERROR] Unable to locate monorepo root.');
  process.exit(1);
}

// 2. Read root .env
const envPath = path.join(rootDir, '.env');
if (!fs.existsSync(envPath)) {
  console.error(`[TEST DB SETUP ERROR] Root .env not found at: ${envPath}`);
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

const testUrl = process.env.DATABASE_URL_TEST || envConfig.DATABASE_URL_TEST;
if (!testUrl) {
  console.error('[TEST DB SETUP ERROR] DATABASE_URL_TEST must be explicitly set in root .env.');
  process.exit(1);
}

// 3. Strict Safety Validation
const parsedTest = new URL(testUrl);
if (parsedTest.hostname !== '127.0.0.1' && parsedTest.hostname !== 'localhost') {
  console.error(
    `[TEST DB SETUP ERROR] Host "${parsedTest.hostname}" forbidden. Must be 127.0.0.1.`,
  );
  process.exit(1);
}
if (parsedTest.port !== '5433') {
  console.error(
    `[TEST DB SETUP ERROR] Port "${parsedTest.port}" forbidden. Must be 5433 to protect native PostgreSQL on 5432.`,
  );
  process.exit(1);
}
const testDbName = parsedTest.pathname.replace(/^\//, '');
if (testDbName !== 'careeros_test_db') {
  console.error(
    `[TEST DB SETUP ERROR] Target database "${testDbName}" is not "careeros_test_db". Refusing to proceed.`,
  );
  process.exit(1);
}

// Ensure Docker path is available in child processes if needed
const dockerPath = path.join(
  process.env.LOCALAPPDATA || 'C:\\Users\\mohdh\\AppData\\Local',
  'Programs\\DockerDesktop\\resources\\bin',
);
if (fs.existsSync(dockerPath) && !process.env.PATH.includes(dockerPath)) {
  process.env.PATH = `${dockerPath};${process.env.PATH}`;
}

const pgUser = envConfig.POSTGRES_USER || 'careeros_dev_user';
const pgPass = envConfig.POSTGRES_PASSWORD || '';
const pgDb = envConfig.POSTGRES_DB || 'careeros_dev_db';

console.log('--- Provisioning Isolated Test Database: careeros_test_db ---');

// 4. Create database if not exists via PostgreSQL container command
try {
  const checkCmd = `docker compose exec -T postgres psql -h 127.0.0.1 -p 5432 -U "${pgUser}" -d "${pgDb}" -tAc "SELECT 1 FROM pg_database WHERE datname = 'careeros_test_db';"`;
  const exists = execSync(checkCmd, {
    env: { ...process.env, PGPASSWORD: pgPass },
    encoding: 'utf8',
  }).trim();

  if (!exists.includes('1')) {
    console.log(' Creating "careeros_test_db"...');
    execSync(
      `docker compose exec -T postgres psql -h 127.0.0.1 -p 5432 -U "${pgUser}" -d "${pgDb}" -c "CREATE DATABASE careeros_test_db;"`,
      {
        env: { ...process.env, PGPASSWORD: pgPass },
        stdio: 'inherit',
      },
    );
    console.log(' [OK] "careeros_test_db" created successfully.');
  } else {
    console.log(' [OK] "careeros_test_db" already exists.');
  }
} catch (err) {
  console.error('[TEST DB SETUP ERROR] Failed to provision test database:', err.message);
  process.exit(1);
}

// 5. Apply migrations to careeros_test_db using Prisma
console.log(' Applying migrations to careeros_test_db...');
const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const migrateResult = spawnSync(pnpmCmd, ['exec', 'prisma', 'migrate', 'deploy'], {
  cwd: path.resolve(__dirname, '..'),
  env: {
    ...process.env,
    DATABASE_URL: testUrl,
  },
  stdio: 'inherit',
  shell: true,
});

if (migrateResult.status !== 0) {
  console.error('[TEST DB SETUP ERROR] Failed to apply migrations to careeros_test_db.');
  process.exit(1);
}

console.log(
  ' [PASS] careeros_test_db is provisioned, migrated, and ready for integration tests.\n',
);
