import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';
import type { Response } from 'express';
import { TransformInterceptor } from './transform.interceptor';
import { RequestContext } from '../context/request-context';

describe('TransformInterceptor', () => {
  let reflector: Reflector;
  let interceptor: TransformInterceptor<unknown>;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new TransformInterceptor(reflector);
  });

  const createExecutionContextMock = (statusCode = 200, headersSent = false) => {
    const responseMock = {
      statusCode,
      headersSent,
    } as unknown as Response;

    const contextMock = {
      getHandler: () => () => {},
      getClass: () => class {},
      switchToHttp: () => ({
        getResponse: () => responseMock,
      }),
    } as unknown as ExecutionContext;

    return { contextMock, responseMock };
  };

  it('should wrap standard successful response in ApiSuccessResponse envelope', async () => {
    const { contextMock } = createExecutionContextMock(200);
    const callHandler: CallHandler = {
      handle: () => of({ greeting: 'hello world' }),
    };

    let result: unknown;
    await RequestContext.run({ correlationId: 'test-envelope-id' }, async () => {
      result = await firstValueFrom(interceptor.intercept(contextMock, callHandler));
    });

    expect(result).toEqual({
      success: true,
      data: { greeting: 'hello world' },
      meta: {
        timestamp: expect.any(String),
        correlationId: 'test-envelope-id',
      },
    });
  });

  it('should preserve 204 No Content without wrapping into a body', async () => {
    const { contextMock } = createExecutionContextMock(204);
    const callHandler: CallHandler = {
      handle: () => of(undefined),
    };

    const result = await firstValueFrom(interceptor.intercept(contextMock, callHandler));
    expect(result).toBeUndefined();
  });

  it('should preserve redirects (3xx) without wrapping', async () => {
    const { contextMock } = createExecutionContextMock(302);
    const callHandler: CallHandler = {
      handle: () => of({ redirectUrl: '/login' }),
    };

    const result = await firstValueFrom(interceptor.intercept(contextMock, callHandler));
    expect(result).toEqual({ redirectUrl: '/login' });
  });

  it('should bypass wrapping when route handler has @BypassEnvelope metadata', async () => {
    const { contextMock } = createExecutionContextMock(200);
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const rawData = { status: 'ok', checks: { database: 'up' } };
    const callHandler: CallHandler = {
      handle: () => of(rawData),
    };

    const result = await firstValueFrom(interceptor.intercept(contextMock, callHandler));
    expect(result).toEqual(rawData);
  });
});
