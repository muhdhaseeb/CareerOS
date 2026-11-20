import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MetricsModule } from '../src/metrics/metrics.module';
import { StructuredLogger } from '../src/common/logger/structured.logger';
import { configureApp } from '../src/setup-app';

describe('Metrics Security and Standards (Integration)', () => {
  let app: INestApplication;
  const originalEnv = { ...process.env };
  const VALID_METRICS_KEY = 'super-secret-metrics-token-12345';

  beforeAll(async () => {
    process.env.METRICS_SECRET_KEY = VALID_METRICS_KEY;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MetricsModule],
      providers: [StructuredLogger],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    process.env = originalEnv;
  });

  it('should reject request without x-metrics-key header (403 Forbidden)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/metrics').expect(403);

    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Missing metrics authorization key',
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: expect.any(String),
      },
    });
  });

  it('should reject request with invalid x-metrics-key header (403 Forbidden)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/metrics')
      .set('x-metrics-key', 'wrong-key-attempt')
      .expect(403);

    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Invalid metrics authorization key',
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: expect.any(String),
      },
    });
  });

  it('should accept request with valid x-metrics-key and return coarse scrubbed metrics', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/metrics')
      .set('x-metrics-key', VALID_METRICS_KEY)
      .expect(200);

    expect(res.body).toEqual({
      success: true,
      data: {
        uptimeSeconds: expect.any(Number),
        timestamp: expect.any(String),
        memory: {
          rssMb: expect.any(Number),
          heapTotalMb: expect.any(Number),
          heapUsedMb: expect.any(Number),
        },
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: expect.any(String),
      },
    });

    const bodyStr = JSON.stringify(res.body);

    // Verify absence of sensitive infrastructure or process details
    expect(bodyStr).not.toContain('pid');
    expect(bodyStr).not.toContain('env');
    expect(bodyStr).not.toContain('DATABASE_URL');
    expect(bodyStr).not.toContain('Users');
    expect(bodyStr).not.toContain('password');
    expect(bodyStr).not.toContain(VALID_METRICS_KEY);
  });

  it('should fail closed when METRICS_SECRET_KEY is unset (403 Forbidden)', async () => {
    const originalSecret = process.env.METRICS_SECRET_KEY;
    delete process.env.METRICS_SECRET_KEY;

    try {
      const res = await request(app.getHttpServer())
        .get('/api/v1/metrics')
        .set('x-metrics-key', 'any-attempt')
        .expect(403);

      expect(res.body).toEqual({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Metrics endpoint is not configured or accessible',
        },
        meta: {
          timestamp: expect.any(String),
          correlationId: expect.any(String),
        },
      });
    } finally {
      process.env.METRICS_SECRET_KEY = originalSecret;
    }
  });
});
