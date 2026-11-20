import { ServiceUnavailableException } from '@nestjs/common';
import type { ReadinessResponse } from '@careeros/contracts';

/**
 * CareerOS — Readiness Exception
 *
 * Trusted exception thrown exclusively during health readiness check failures.
 * This exception is explicitly identified by HttpExceptionFilter to safely return
 * the documented ReadinessResponse contract without exposing arbitrary fields
 * from generic 503 exceptions.
 */
export class ReadinessException extends ServiceUnavailableException {
  readonly isReadinessException = true;
  readonly readinessPayload: ReadinessResponse;

  constructor(payload: ReadinessResponse) {
    super(payload);

    // Strictly enforce the documented ReadinessResponse shape, dropping any extraneous fields
    this.readinessPayload = {
      status: 'error',
      timestamp:
        typeof payload?.timestamp === 'string' ? payload.timestamp : new Date().toISOString(),
      checks: {
        database: payload?.checks?.database === 'up' ? 'up' : 'down',
      },
    };
  }
}
