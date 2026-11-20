import { describe, it, expect, vi } from 'vitest';
import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
  ArgumentsHost,
} from '@nestjs/common';
import type { Response } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';
import { RequestContext } from '../context/request-context';
import { ReadinessException } from '../exceptions/readiness.exception';

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  const createHostMock = () => {
    const statusMock = vi.fn().mockReturnThis();
    const jsonMock = vi.fn();
    const responseMock = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;

    const hostMock = {
      switchToHttp: () => ({
        getResponse: () => responseMock,
      }),
    } as unknown as ArgumentsHost;

    return { hostMock, statusMock, jsonMock };
  };

  it('should format standard HttpException with code, message and correlationId', () => {
    const { hostMock, statusMock, jsonMock } = createHostMock();

    RequestContext.run({ correlationId: 'test-corr-id-123' }, () => {
      filter.catch(new NotFoundException('The requested resource was not found'), hostMock);
    });

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found',
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: 'test-corr-id-123',
      },
    });
  });

  it('should format validation errors (BadRequestException with array) into clean details', () => {
    const { hostMock, statusMock, jsonMock } = createHostMock();
    const validationException = new BadRequestException({
      statusCode: 400,
      message: ['email must be an email', 'password is too short'],
      error: 'Bad Request',
    });

    RequestContext.run({ correlationId: 'test-val-id-456' }, () => {
      filter.catch(validationException, hostMock);
    });

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: [
          { field: 'email', message: 'email must be an email' },
          { field: 'password', message: 'password is too short' },
        ],
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: 'test-val-id-456',
      },
    });
  });

  it('should preserve trusted ReadinessException without mutating shape', () => {
    const { hostMock, statusMock, jsonMock } = createHostMock();
    const readinessFailure = {
      status: 'error' as const,
      timestamp: '2026-11-20T21:00:00.000Z',
      checks: {
        database: 'down' as const,
      },
    };

    filter.catch(new ReadinessException(readinessFailure), hostMock);

    expect(statusMock).toHaveBeenCalledWith(503);
    expect(jsonMock).toHaveBeenCalledWith(readinessFailure);
  });

  it('should format unrelated ServiceUnavailableException containing sensitive fields into standardized ApiErrorResponse', () => {
    const { hostMock, statusMock, jsonMock } = createHostMock();
    const unrelatedException = new ServiceUnavailableException({
      message: 'Payment gateway timeout',
      secretToken: 'sk_live_secret_key_12345',
      checks: { paymentGateway: 'down' },
      internalHost: 'internal-cluster.local',
    });

    RequestContext.run({ correlationId: 'test-unrelated-503' }, () => {
      filter.catch(unrelatedException, hostMock);
    });

    expect(statusMock).toHaveBeenCalledWith(503);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Payment gateway timeout',
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: 'test-unrelated-503',
      },
    });

    const firstCall = jsonMock.mock.calls[0];
    expect(firstCall).toBeDefined();
    const responsePayload = firstCall?.[0] as Record<string, unknown>;
    const bodyStr = JSON.stringify(responsePayload);
    expect(bodyStr).not.toContain('sk_live_secret_key_12345');
    expect(bodyStr).not.toContain('internal-cluster.local');
    expect(responsePayload?.checks).toBeUndefined();
    expect(responsePayload?.secretToken).toBeUndefined();
  });

  it('should redact secrets in error messages', () => {
    const { hostMock, statusMock, jsonMock } = createHostMock();
    const ex = new BadRequestException('Invalid authorization token: Bearer mySecretToken123');

    RequestContext.run({ correlationId: 'test-redact-corr' }, () => {
      filter.catch(ex, hostMock);
    });

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid authorization token: Bearer [REDACTED]',
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: 'test-redact-corr',
      },
    });
  });

  it('should intercept unhandled errors and return sanitized 500 without leaking stack traces', () => {
    const { hostMock, statusMock, jsonMock } = createHostMock();
    const internalCrash = new Error(
      'Database password is "mySecret123" at line 42 /internal/db.ts',
    );

    RequestContext.run({ correlationId: 'test-crash-id-789' }, () => {
      filter.catch(internalCrash, hostMock);
    });

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal server error occurred.',
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: 'test-crash-id-789',
      },
    });
  });
});
