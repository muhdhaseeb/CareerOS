import { describe, it, expect, vi } from 'vitest';
import type { Response, NextFunction } from 'express';
import { CorrelationIdMiddleware, RequestWithCorrelation } from './correlation-id.middleware';
import { RequestContext } from '../context/request-context';

describe('CorrelationIdMiddleware', () => {
  const middleware = new CorrelationIdMiddleware();

  it('should preserve a valid incoming x-correlation-id header', () => {
    const validId = '123e4567-e89b-12d3-a456-426614174000';
    const req = {
      headers: { 'x-correlation-id': validId },
    } as unknown as RequestWithCorrelation;

    const setHeaderMock = vi.fn();
    const res = { setHeader: setHeaderMock } as unknown as Response;
    let contextCorrelationId = '';

    const next: NextFunction = () => {
      contextCorrelationId = RequestContext.getCorrelationId();
    };

    middleware.use(req, res, next);

    expect(req.correlationId).toBe(validId);
    expect(setHeaderMock).toHaveBeenCalledWith('X-Correlation-ID', validId);
    expect(contextCorrelationId).toBe(validId);
  });

  it('should generate a fresh UUID when incoming header is missing', () => {
    const req = {
      headers: {},
    } as unknown as RequestWithCorrelation;

    const setHeaderMock = vi.fn();
    const res = { setHeader: setHeaderMock } as unknown as Response;

    middleware.use(req, res, () => {});

    expect(req.correlationId).toBeDefined();
    expect(req.correlationId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(setHeaderMock).toHaveBeenCalledWith('X-Correlation-ID', req.correlationId);
  });

  it('should replace malformed, oversized or unsafe incoming headers with a clean UUID', () => {
    const malformedHeaders = [
      'short', // < 8 chars
      'a'.repeat(65), // > 64 chars
      'invalid\nheader',
      '<script>alert(1)</script>',
      '../../etc/passwd',
      'id with spaces',
    ];

    for (const badHeader of malformedHeaders) {
      const req = {
        headers: { 'x-correlation-id': badHeader },
      } as unknown as RequestWithCorrelation;

      const setHeaderMock = vi.fn();
      const res = { setHeader: setHeaderMock } as unknown as Response;

      middleware.use(req, res, () => {});

      expect(req.correlationId).not.toBe(badHeader);
      expect(req.correlationId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    }
  });
});
