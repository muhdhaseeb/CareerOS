/**
 * CareerOS — Data Persistence Test
 * Verifies data persistence for PostgreSQL, Redis, and MinIO across container recreation without volume deletion.
 * Uses unique test resource names for each execution to ensure complete isolation.
 * Strictly adheres to security rules: no secrets are logged.
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

// Ensure Docker path is available in child processes
const dockerPath = path.join(
  process.env.LOCALAPPDATA || 'C:\\Users\\mohdh\\AppData\\Local',
  'Programs\\DockerDesktop\\resources\\bin',
);
if (fs.existsSync(dockerPath) && !process.env.PATH.includes(dockerPath)) {
  process.env.PATH = `${dockerPath};${process.env.PATH}`;
}

const ROOT_DIR = process.cwd();
const ENV_PATH = path.join(ROOT_DIR, '.env');
const envConfig = Object.fromEntries(
  fs
    .readFileSync(ENV_PATH, 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const PG_USER = envConfig.POSTGRES_USER;
const PG_PASS = envConfig.POSTGRES_PASSWORD;
const PG_DB = envConfig.POSTGRES_DB;
const MINIO_USER = envConfig.MINIO_ROOT_USER;
const MINIO_PASS = envConfig.MINIO_ROOT_PASSWORD;
const MINIO_PORT = parseInt(envConfig.MINIO_PORT || '9000', 10);

// Unique execution identifier (alphanumeric, valid for S3 bucket & SQL table names)
const runId = `${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
const pgTableName = `_persistence_${runId}`;
const redisKey = `_persistence:${runId}`;
const s3Bucket = `careeros-persist-${runId}`;
const s3ObjectKey = `test-${runId}.txt`;
const testPayload = `data_persisted_${runId}`;

// Helper for MinIO S3 AWS SigV4
function hmac(key, string) {
  return crypto.createHmac('sha256', key).update(string, 'utf8').digest();
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = hmac('AWS4' + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  return hmac(kService, 'aws4_request');
}

function s3Request(method, pathStr, body = '') {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);
    const region = 'us-east-1';
    const service = 's3';

    const payloadHash = crypto.createHash('sha256').update(body, 'utf8').digest('hex');
    const canonicalHeaders = `host:127.0.0.1:${MINIO_PORT}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
    const canonicalRequest = `${method}\n${pathStr}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex')}`;

    const signingKey = getSignatureKey(MINIO_PASS, dateStamp, region, service);
    const signature = crypto
      .createHmac('sha256', signingKey)
      .update(stringToSign, 'utf8')
      .digest('hex');
    const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${MINIO_USER}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: MINIO_PORT,
        path: pathStr,
        method: method,
        headers: {
          Host: `127.0.0.1:${MINIO_PORT}`,
          'x-amz-date': amzDate,
          'x-amz-content-sha256': payloadHash,
          Authorization: authorizationHeader,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let respData = '';
        res.on('data', (chunk) => (respData += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: respData }));
      },
    );

    req.on('error', (err) => reject(err));
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  console.log(`=== CareerOS Data Persistence Verification (Run ID: ${runId}) ===\n`);

  // Step 1: Write initial test records using unique names
  console.log('--- Step 1: Writing Unique Test Records to PostgreSQL, Redis, and MinIO ---');

  // PostgreSQL
  execSync(
    `docker compose exec -T postgres psql -h 127.0.0.1 -p 5432 -U "${PG_USER}" -d "${PG_DB}" -c "CREATE TABLE ${pgTableName} (id int primary key, payload text); INSERT INTO ${pgTableName} VALUES (1, '${testPayload}');"`,
    { env: { ...process.env, PGPASSWORD: PG_PASS }, stdio: 'inherit' },
  );
  console.log(` [OK] PostgreSQL test table "${pgTableName}" written.`);

  // Redis
  execSync(`docker compose exec -T redis redis-cli SET "${redisKey}" "${testPayload}"`, {
    stdio: 'inherit',
  });
  console.log(` [OK] Redis test key "${redisKey}" written.`);

  // MinIO
  await s3Request('PUT', `/${s3Bucket}`);
  const putRes = await s3Request('PUT', `/${s3Bucket}/${s3ObjectKey}`, testPayload);
  if (putRes.statusCode !== 200) {
    throw new Error(`MinIO PutObject failed with status: ${putRes.statusCode}`);
  }
  console.log(` [OK] MinIO S3 object "${s3Bucket}/${s3ObjectKey}" written.`);

  // Step 2: Stop and remove containers (preserving named volumes)
  console.log('\n--- Step 2: Stopping & Removing Containers (docker compose down) ---');
  execSync('docker compose down', { stdio: 'inherit' });
  console.log(' [OK] Containers stopped and removed (named volumes preserved).');

  // Step 3: Recreate & start containers
  console.log('\n--- Step 3: Recreating & Starting Containers (docker compose up -d) ---');
  execSync('docker compose up -d', { stdio: 'inherit' });

  // Step 4: Wait for containers to become ready
  console.log('\n--- Step 4: Waiting for Services to Reach Ready State ---');
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const psOutput = execSync('docker compose ps --format json', { encoding: 'utf8' });
      if (psOutput.includes('healthy')) {
        const readyCheck = await new Promise((resolve) => {
          http
            .get(`http://127.0.0.1:${MINIO_PORT}/minio/health/ready`, (res) => {
              resolve(res.statusCode === 200);
            })
            .on('error', () => resolve(false));
        });
        if (readyCheck) {
          ready = true;
          break;
        }
      }
    } catch {
      // Retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (!ready) {
    console.warn(' Warning: Health check wait timeout; proceeding to verify...');
  } else {
    console.log(' [OK] All services confirmed healthy and ready.');
  }

  // Step 5: Read back persisted records
  console.log('\n--- Step 5: Reading Back Persisted Records ---');

  const pgResult = execSync(
    `docker compose exec -T postgres psql -h 127.0.0.1 -p 5432 -U "${PG_USER}" -d "${PG_DB}" -t -c "SELECT payload FROM ${pgTableName} WHERE id = 1;"`,
    { env: { ...process.env, PGPASSWORD: PG_PASS }, encoding: 'utf8' },
  ).trim();

  const redisResult = execSync(`docker compose exec -T redis redis-cli GET "${redisKey}"`, {
    encoding: 'utf8',
  }).trim();

  const s3Result = await s3Request('GET', `/${s3Bucket}/${s3ObjectKey}`);

  console.log(` PostgreSQL Persisted Payload: "${pgResult}"`);
  console.log(` Redis Persisted Payload:      "${redisResult}"`);
  console.log(` MinIO S3 Persisted Payload:   "${s3Result.body.trim()}"`);

  // Step 6: Cleanup only resources created by this current run
  console.log('\n--- Step 6: Cleaning Up Current Run Test Resources ---');
  execSync(
    `docker compose exec -T postgres psql -h 127.0.0.1 -p 5432 -U "${PG_USER}" -d "${PG_DB}" -c "DROP TABLE IF EXISTS ${pgTableName};"`,
    { env: { ...process.env, PGPASSWORD: PG_PASS }, stdio: 'inherit' },
  );
  execSync(`docker compose exec -T redis redis-cli DEL "${redisKey}"`, { stdio: 'inherit' });
  await s3Request('DELETE', `/${s3Bucket}/${s3ObjectKey}`);
  await s3Request('DELETE', `/${s3Bucket}`);
  console.log(` [OK] Cleaned up: table ${pgTableName}, key ${redisKey}, bucket ${s3Bucket}.`);

  const pgPass = pgResult.includes(testPayload);
  const redisPass = redisResult.includes(testPayload);
  const s3Pass = s3Result.body.includes(testPayload);

  console.log('\n----------------------------------------------------');
  if (pgPass && redisPass && s3Pass) {
    console.log(' [PASS] Full Data Persistence Verified Across Container Recreation!');
    process.exit(0);
  } else {
    console.error(' [FAIL] Persistence Verification Failed:');
    if (!pgPass) console.error('  - PostgreSQL data was not persisted');
    if (!redisPass) console.error('  - Redis data was not persisted');
    if (!s3Pass) console.error('  - MinIO data was not persisted');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Unexpected error in persistence test:', err);
  process.exit(1);
});
