import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, HttpCode, HttpStatus, Res, INestApplication } from '@nestjs/common';
import type { Response } from 'express';
import request from 'supertest';
import { BypassEnvelope } from '../src/common/decorators/bypass-envelope.decorator';
import { StructuredLogger } from '../src/common/logger/structured.logger';
import { configureApp } from '../src/setup-app';

@Controller('contract-test')
class ContractTestController {
  @Get('standard')
  getStandard(): { message: string } {
    return { message: 'hello standard' };
  }

  @Get('no-content')
  @HttpCode(HttpStatus.NO_CONTENT)
  getNoContent(): void {
    // 204 No Content
    return;
  }

  @Get('redirect')
  getRedirect(@Res() res: Response): void {
    res.redirect(302, '/api/v1/contract-test/standard');
  }

  @Get('custom-bypass')
  @BypassEnvelope()
  getBypassed(): { rawKey: string } {
    return { rawKey: 'raw-value' };
  }

  @Get('unhandled-error')
  getUnhandledError(): never {
    throw new Error(
      'Database connection string: postgres://admin:secretPass@internal-db:5432 failed',
    );
  }
}

describe('API Contract & Response Envelope Standards (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ContractTestController],
      providers: [StructuredLogger],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should wrap standard responses in ApiSuccessResponse envelope', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/contract-test/standard')
      .expect(200);

    expect(res.body).toEqual({
      success: true,
      data: {
        message: 'hello standard',
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: expect.any(String),
      },
    });
    expect(res.headers['x-correlation-id']).toBe(res.body.meta.correlationId);
  });

  it('should bypass envelope on 204 No Content and return empty body (RFC 9110)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/contract-test/no-content')
      .expect(204);

    expect(res.text).toBe('');
    expect(res.body).toEqual({});
    expect(res.headers['x-correlation-id']).toBeDefined();
  });

  it('should bypass envelope on 302 Redirect', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/contract-test/redirect')
      .expect(302);

    expect(res.headers.location).toBe('/api/v1/contract-test/standard');
  });

  it('should bypass envelope when route is decorated with @BypassEnvelope()', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/contract-test/custom-bypass')
      .expect(200);

    expect(res.body).toEqual({
      rawKey: 'raw-value',
    });
    expect(res.body.meta).toBeUndefined();
    expect(res.headers['x-correlation-id']).toBeDefined();
  });

  it('should format unhandled errors in ApiErrorResponse with zero stack trace or secret disclosure', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/contract-test/unhandled-error')
      .expect(500);

    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal server error occurred.',
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: expect.any(String),
      },
    });

    const bodyStr = JSON.stringify(res.body);
    // Strict verification: zero credentials or stack trace details leaked to client
    expect(bodyStr).not.toContain('secretPass');
    expect(bodyStr).not.toContain('postgres://');
    expect(bodyStr).not.toContain('internal-db');
    expect(res.body.stack).toBeUndefined();
    expect(res.body.error.details).toBeUndefined();
  });
});
