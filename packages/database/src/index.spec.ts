import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { validateDatabaseTarget } from './safety-guard';
import { createTestPrismaClient } from './test-setup';
import type { PrismaClient } from '@prisma/client';

describe('Database Safety Guard', () => {
  it('strictly forbids native PostgreSQL port 5432 in local environments', () => {
    expect(() =>
      validateDatabaseTarget(
        'postgresql://user:pass@127.0.0.1:5432/careeros_dev_db',
        'development',
      ),
    ).toThrow(/Port "5432" is forbidden/);
  });

  it('strictly forbids non-loopback hosts in local development', () => {
    expect(() =>
      validateDatabaseTarget(
        'postgresql://user:pass@remote.server.com:5433/careeros_dev_db',
        'development',
      ),
    ).toThrow(/Host "remote.server.com" is forbidden/);
  });

  it('rejects development database name when expecting test environment', () => {
    expect(() =>
      validateDatabaseTarget('postgresql://user:pass@127.0.0.1:5433/careeros_dev_db', 'test'),
    ).toThrow(/Target database "careeros_dev_db" is forbidden for integration tests/);
  });

  it('accepts authorized local development target on port 5433', () => {
    expect(() =>
      validateDatabaseTarget(
        'postgresql://user:pass@127.0.0.1:5433/careeros_dev_db',
        'development',
      ),
    ).not.toThrow();
  });

  it('accepts authorized test database target on port 5433', () => {
    expect(() =>
      validateDatabaseTarget('postgresql://user:pass@127.0.0.1:5433/careeros_test_db', 'test'),
    ).not.toThrow();
  });
});

describe('Database Integration Tests (careeros_test_db)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = createTestPrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it('verifies connection, CRUD, cascade deletion, and audit set-null behavior', async () => {
    const runId = Math.random().toString(36).substring(2, 9);
    const testEmail = `test-${runId}@careeros.local`;

    // 1. Create User
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: 'test_argon2_hash_placeholder',
        role: 'CANDIDATE',
        status: 'ACTIVE',
        emailVerified: false,
      },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe(testEmail);

    // 2. Create Session (linked to user)
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: `session-token-${runId}`,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });
    expect(session.userId).toBe(user.id);

    // 3. Create VerificationToken (linked to user)
    const token = await prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash: `verify-token-${runId}`,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + 3600000),
      },
    });
    expect(token.userId).toBe(user.id);

    // 4. Create AuditEvent (linked to user)
    const auditEvent = await prisma.auditEvent.create({
      data: {
        userId: user.id,
        action: 'INTEGRATION_TEST_EVENT',
        metadata: { runId },
      },
    });
    expect(auditEvent.userId).toBe(user.id);

    // 5. Delete User
    await prisma.user.delete({
      where: { id: user.id },
    });

    // 6. Verify Cascade Deletion on Session and VerificationToken
    const sessionAfter = await prisma.session.findUnique({
      where: { id: session.id },
    });
    expect(sessionAfter).toBeNull();

    const tokenAfter = await prisma.verificationToken.findUnique({
      where: { id: token.id },
    });
    expect(tokenAfter).toBeNull();

    // 7. Verify SetNull Behavior on AuditEvent (record preserved with userId = null)
    const auditEventAfter = await prisma.auditEvent.findUnique({
      where: { id: auditEvent.id },
    });
    expect(auditEventAfter).not.toBeNull();
    expect(auditEventAfter?.userId).toBeNull();

    // Clean up test audit event
    await prisma.auditEvent.delete({
      where: { id: auditEvent.id },
    });
  });
});
