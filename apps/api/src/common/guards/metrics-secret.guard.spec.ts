import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { MetricsSecretGuard } from './metrics-secret.guard';

describe('MetricsSecretGuard', () => {
  const guard = new MetricsSecretGuard();
  const originalEnv = process.env.METRICS_SECRET_KEY;

  beforeEach(() => {
    process.env.METRICS_SECRET_KEY = 'valid-test-secret-key-12345';
  });

  afterEach(() => {
    process.env.METRICS_SECRET_KEY = originalEnv;
  });

  const createMockContext = (headerValue?: string) => {
    const req = {
      headers: headerValue ? { 'x-metrics-key': headerValue } : {},
    } as unknown as Request;

    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow access when x-metrics-key matches METRICS_SECRET_KEY', () => {
    const ctx = createMockContext('valid-test-secret-key-12345');
    const result = guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('should reject when x-metrics-key does not match', () => {
    const ctx = createMockContext('invalid-secret-key');
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should reject when x-metrics-key is missing', () => {
    const ctx = createMockContext();
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should fail closed when METRICS_SECRET_KEY is not configured in environment', () => {
    delete process.env.METRICS_SECRET_KEY;
    const ctx = createMockContext('any-key');
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
