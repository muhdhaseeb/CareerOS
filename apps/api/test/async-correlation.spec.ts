import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RequestContext } from '../src/common/context/request-context';
import { StructuredLogger } from '../src/common/logger/structured.logger';
import { configureApp } from '../src/setup-app';

@Controller('async-test')
class AsyncTestController {
  @Get('delay')
  async getDelayed(): Promise<{ correlationIdInHandler: string }> {
    const startCorr = RequestContext.getCorrelationId();
    // Simulate asynchronous work (e.g., database query or external check)
    await new Promise((resolve) => setTimeout(resolve, 50));
    const endCorr = RequestContext.getCorrelationId();

    if (startCorr !== endCorr) {
      throw new Error(`Correlation ID drifted from ${startCorr} to ${endCorr}`);
    }

    return {
      correlationIdInHandler: endCorr,
    };
  }
}

describe('Asynchronous Request Correlation & Isolation (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AsyncTestController],
      providers: [StructuredLogger],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should preserve valid incoming X-Correlation-ID across async execution', async () => {
    const customCorrelationId = 'custom-trace-uuid-12345678';

    const res = await request(app.getHttpServer())
      .get('/api/v1/async-test/delay')
      .set('x-correlation-id', customCorrelationId)
      .expect(200);

    expect(res.headers['x-correlation-id']).toBe(customCorrelationId);
    expect(res.body.meta.correlationId).toBe(customCorrelationId);
    expect(res.body.data.correlationIdInHandler).toBe(customCorrelationId);
  });

  it('should sanitize and replace invalid incoming correlation identifiers with fresh UUIDv4', async () => {
    // Malicious or invalid header (special characters or injection attempt)
    const invalidHeader = '<script>alert(1)</script>';

    const res = await request(app.getHttpServer())
      .get('/api/v1/async-test/delay')
      .set('x-correlation-id', invalidHeader)
      .expect(200);

    const generatedId = res.headers['x-correlation-id'];
    expect(generatedId).toBeDefined();
    expect(generatedId).not.toBe(invalidHeader);
    expect(generatedId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(res.body.meta.correlationId).toBe(generatedId);
  });

  it('should maintain strict correlation ID isolation across concurrent requests without crosstalk', async () => {
    const concurrency = 10;
    const requests = Array.from({ length: concurrency }, (_, i) => {
      const corrId = `concurrent-req-test-${i}-abcdef123`;
      return request(app.getHttpServer())
        .get('/api/v1/async-test/delay')
        .set('x-correlation-id', corrId)
        .then((res) => ({
          sentCorrId: corrId,
          receivedHeaderCorrId: res.headers['x-correlation-id'],
          receivedBodyCorrId: res.body.meta.correlationId,
          handlerCorrId: res.body.data.correlationIdInHandler,
        }));
    });

    const results = await Promise.all(requests);

    for (const result of results) {
      expect(result.receivedHeaderCorrId).toBe(result.sentCorrId);
      expect(result.receivedBodyCorrId).toBe(result.sentCorrId);
      expect(result.handlerCorrId).toBe(result.sentCorrId);
    }
  });
});
