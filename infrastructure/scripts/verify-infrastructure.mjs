/**
 * CareerOS — Infrastructure Verification Script
 * Validates authenticated connectivity for PostgreSQL, Redis, and MinIO S3.
 * Strictly adheres to security rules: no secrets are printed to stdout/stderr.
 */

import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
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

if (!fs.existsSync(ENV_PATH)) {
  console.error('Error: .env file not found in root directory.');
  process.exit(1);
}

// Parse .env
const envConfig = {};
for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    envConfig[key] = val;
  }
}

const PG_USER = envConfig.POSTGRES_USER;
const PG_PASS = envConfig.POSTGRES_PASSWORD;
const PG_DB = envConfig.POSTGRES_DB;
const PG_PORT = parseInt(envConfig.POSTGRES_PORT || '5433', 10);
const REDIS_PASS = envConfig.REDIS_PASSWORD;
const REDIS_PORT = parseInt(envConfig.REDIS_PORT || '6379', 10);
const MINIO_USER = envConfig.MINIO_ROOT_USER;
const MINIO_PASS = envConfig.MINIO_ROOT_PASSWORD;
const MINIO_PORT = parseInt(envConfig.MINIO_PORT || '9000', 10);

console.log('--- Starting CareerOS Infrastructure Verification ---');

// 1. Verify Native PostgreSQL on Port 5432 (Must remain unaffected)
async function verifyNativePostgres() {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(3000);
    socket.on('connect', () => {
      socket.destroy();
      console.log(' [PASS] Native PostgreSQL on port 5432 is running and unaffected.');
      resolve(true);
    });
    socket.on('error', (err) => {
      console.warn(' [WARN] Native PostgreSQL port 5432 check returned:', err.message);
      resolve(false);
    });
    socket.on('timeout', () => {
      socket.destroy();
      console.warn(' [WARN] Native PostgreSQL port 5432 timed out.');
      resolve(false);
    });
    socket.connect(5432, '127.0.0.1');
  });
}

// 2. Verify Containerized PostgreSQL Authentication over TCP
async function verifyPostgresAuth() {
  console.log(` Testing PostgreSQL host TCP binding on 127.0.0.1:${PG_PORT} & authentication...`);
  try {
    // Probe host port 5433 first to confirm host binding
    const hostPortOpen = await new Promise((resolve) => {
      const s = new net.Socket();
      s.setTimeout(3000);
      s.on('connect', () => {
        s.destroy();
        resolve(true);
      });
      s.on('error', () => resolve(false));
      s.on('timeout', () => {
        s.destroy();
        resolve(false);
      });
      s.connect(PG_PORT, '127.0.0.1');
    });

    if (!hostPortOpen) {
      console.error(` [FAIL] Host port 127.0.0.1:${PG_PORT} is not accepting TCP connections.`);
      return false;
    }
    console.log(` [PASS] Host port 127.0.0.1:${PG_PORT} is bound and accepting TCP connections.`);

    // Attempt authenticated query from container over TCP
    const cmd = `docker compose exec -T postgres psql -h 127.0.0.1 -p 5432 -U "${PG_USER}" -d "${PG_DB}" -c "SELECT 1 AS tcp_authenticated;"`;
    const output = execSync(cmd, {
      env: { ...process.env, PGPASSWORD: PG_PASS },
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (output.includes('tcp_authenticated')) {
      console.log(' [PASS] PostgreSQL authenticated over TCP successfully.');
      return true;
    }
    throw new Error('Unexpected psql output');
  } catch (err) {
    console.error(' [FAIL] PostgreSQL authentication failed:', err.message);
    return false;
  }
}

// 3. Verify Redis Authentication over TCP
async function verifyRedisAuth() {
  console.log(` Testing Redis authentication over TCP on 127.0.0.1:${REDIS_PORT}...`);
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(3000);

    socket.on('connect', () => {
      // Send AUTH command followed by PING
      socket.write(`AUTH ${REDIS_PASS}\r\nPING\r\n`);
    });

    socket.on('data', (data) => {
      const resp = data.toString();
      if (resp.includes('+PONG')) {
        socket.destroy();
        console.log(' [PASS] Redis authenticated over TCP successfully (PONG received).');
        resolve(true);
      } else if (resp.includes('ERR') || resp.includes('WRONGPASS')) {
        socket.destroy();
        console.error(' [FAIL] Redis authentication rejected credentials.');
        resolve(false);
      }
    });

    socket.on('error', (err) => {
      console.error(' [FAIL] Redis TCP connection error:', err.message);
      resolve(false);
    });

    socket.on('timeout', () => {
      socket.destroy();
      console.error(' [FAIL] Redis connection timed out.');
      resolve(false);
    });

    socket.connect(REDIS_PORT, '127.0.0.1');
  });
}

// 4. Verify MinIO S3 Readiness & Authenticated Object Operations (AWS SigV4)
function hmac(key, string) {
  return crypto.createHmac('sha256', key).update(string, 'utf8').digest();
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = hmac('AWS4' + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  const kSigning = hmac(kService, 'aws4_request');
  return kSigning;
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

async function verifyMinioS3() {
  console.log(` Testing MinIO S3 HTTP readiness on 127.0.0.1:${MINIO_PORT}...`);
  try {
    // Check readiness endpoint
    const readyCheck = await new Promise((resolve) => {
      http
        .get(`http://127.0.0.1:${MINIO_PORT}/minio/health/ready`, (res) => {
          resolve(res.statusCode === 200);
        })
        .on('error', () => resolve(false));
    });

    if (!readyCheck) {
      console.error(' [FAIL] MinIO health/ready probe did not return 200.');
      return false;
    }
    console.log(' [PASS] MinIO health/ready endpoint is HTTP 200.');

    // Authenticated operations: Create bucket, Put object, Get object, Delete object, Delete bucket
    const bucket = 'careeros-test-verification';
    const testFile = 'verification.txt';
    const testContent = 'CareerOS authenticated S3 storage verified successfully.';

    // 1. Create Bucket
    await s3Request('PUT', `/${bucket}`);

    // 2. Put Object
    const putRes = await s3Request('PUT', `/${bucket}/${testFile}`, testContent);
    if (putRes.statusCode !== 200) {
      throw new Error(`S3 PutObject failed with status ${putRes.statusCode}`);
    }

    // 3. Get Object
    const getRes = await s3Request('GET', `/${bucket}/${testFile}`);
    if (getRes.statusCode !== 200 || getRes.body !== testContent) {
      throw new Error(`S3 GetObject failed or content mismatch. Status: ${getRes.statusCode}`);
    }

    // 4. Delete Object & Bucket
    await s3Request('DELETE', `/${bucket}/${testFile}`);
    await s3Request('DELETE', `/${bucket}`);

    console.log(
      ' [PASS] MinIO S3 authenticated operations (PutObject, GetObject) verified successfully.',
    );
    return true;
  } catch (err) {
    console.error(' [FAIL] MinIO S3 verification failed:', err.message);
    return false;
  }
}

async function run() {
  const nativeOk = await verifyNativePostgres();
  const pgOk = await verifyPostgresAuth();
  const redisOk = await verifyRedisAuth();
  const s3Ok = await verifyMinioS3();

  console.log('----------------------------------------------------');
  if (nativeOk && pgOk && redisOk && s3Ok) {
    console.log('ALL INFRASTRUCTURE VERIFICATION CHECKS PASSED.');
    process.exit(0);
  } else {
    console.error('ONE OR MORE VERIFICATION CHECKS FAILED.');
    process.exit(1);
  }
}

run();
