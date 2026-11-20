import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthModule } from '../src/health/health.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { StructuredLogger } from '../src/common/logger/structured.logger';
import { configureApp } from '../src/setup-app';

describe('Health & Readiness Endpoints (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const mockPrisma = {
      $transaction: vi.fn(),
      onModuleInit: vi.fn(),
      onModuleDestroy: vi.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
      providers: [StructuredLogger],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/health/live', () => {
    it('should return 200 with liveness status', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/health/live').expect(200);

      expect(res.body).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
      });
      expect(res.headers['x-correlation-id']).toBeDefined();
    });
  });

  describe('GET /api/v1/health/ready', () => {
    it('should return 200 when database probe succeeds', async () => {
      vi.mocked(prismaService.$transaction).mockResolvedValueOnce([1] as never);

      const res = await request(app.getHttpServer()).get('/api/v1/health/ready').expect(200);

      expect(res.body).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
        checks: {
          database: 'up',
        },
      });
      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should return 503 Service Unavailable when database probe fails or times out', async () => {
      // Simulate database failure or statement timeout error
      vi.mocked(prismaService.$transaction).mockRejectedValueOnce(
        new Error('canceling statement due to statement timeout'),
      );

      // Wait 1.1s so previous probe cache (1000ms TTL) expires
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const res = await request(app.getHttpServer()).get('/api/v1/health/ready').expect(503);

      expect(res.body).toEqual({
        status: 'error',
        timestamp: expect.any(String),
        checks: {
          database: 'down',
        },
      });

      // Ensure zero stack trace, SQL statement, or error messages are leaked to HTTP clients
      expect(JSON.stringify(res.body)).not.toContain('statement_timeout');
      expect(JSON.stringify(res.body)).not.toContain('canceling statement');
      expect(res.body.stack).toBeUndefined();
    });

    it('should coalesce concurrent probes into a single in-flight transaction', async () => {
      // Wait for cache TTL expiration
      await new Promise((resolve) => setTimeout(resolve, 1100));

      let resolveTransaction!: (val: unknown) => void;
      const delayedPromise = new Promise((resolve) => {
        resolveTransaction = resolve;
      });

      vi.mocked(prismaService.$transaction).mockReturnValueOnce(delayedPromise as never);

      // Trigger two concurrent requests simultaneously
      const req1 = request(app.getHttpServer()).get('/api/v1/health/ready');
      const req2 = request(app.getHttpServer()).get('/api/v1/health/ready');

      // Resolve delayed transaction
      resolveTransaction([1]);

      const [res1, res2] = await Promise.all([req1, req2]);

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body.status).toBe('ok');
      expect(res2.body.status).toBe('ok');

      // Single-flight coalescing must ensure prisma.$transaction was called only once!
      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 with detailed health metrics', async () => {
      vi.mocked(prismaService.$transaction).mockResolvedValueOnce([1] as never);

      const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);

      expect(res.body).toEqual({
        status: 'ok',
        version: '0.1.0',
        timestamp: expect.any(String),
        uptimeSeconds: expect.any(Number),
        checks: {
          database: {
            status: 'up',
          },
          memory: {
            heapUsedMb: expect.any(Number),
            heapTotalMb: expect.any(Number),
            rssMb: expect.any(Number),
          },
        },
      });
    });
  });
});
