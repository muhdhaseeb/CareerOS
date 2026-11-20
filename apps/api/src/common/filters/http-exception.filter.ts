import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import type { ApiErrorDetail, ApiErrorResponse } from '@careeros/contracts';
import { RequestContext } from '../context/request-context';
import { StructuredLogger } from '../logger/structured.logger';
import { ReadinessException } from '../exceptions/readiness.exception';
import { SecretRedactor } from '../logger/secret-redactor';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger?: StructuredLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const correlationId = RequestContext.getCorrelationId();
    const timestamp = new Date().toISOString();

    // 1. Preserve documented readiness failure contracts (HTTP 503) strictly for trusted ReadinessException
    if (exception instanceof ReadinessException) {
      response.status(HttpStatus.SERVICE_UNAVAILABLE).json(exception.readinessPayload);
      return;
    }

    // 2. Standardized HTTP exceptions (all other 4xx and 5xx exceptions)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resResponse = exception.getResponse();

      let code = this.getErrorCode(exception, status);
      let message = exception.message;
      let details: ApiErrorDetail[] | undefined = undefined;

      if (typeof resResponse === 'object' && resResponse !== null) {
        const resObj = resResponse as Record<string, unknown>;

        if (status === HttpStatus.BAD_REQUEST && Array.isArray(resObj.message)) {
          code = 'VALIDATION_ERROR';
          message = 'Validation failed';
          details = (resObj.message as string[]).map((msg) => {
            const parts = msg.split(' ');
            return {
              field: parts[0],
              message: SecretRedactor.redactString(msg),
            };
          });
        } else if (typeof resObj.message === 'string') {
          message = resObj.message;
        }
      }

      const payload: ApiErrorResponse = {
        success: false,
        error: {
          code,
          message: SecretRedactor.redactString(message),
          ...(details ? { details } : {}),
        },
        meta: {
          timestamp,
          correlationId,
        },
      };

      response.status(status).json(payload);
      return;
    }

    // Unhandled exception (HTTP 500)
    const err = exception instanceof Error ? exception : new Error(String(exception));
    if (this.logger) {
      this.logger.error(`Unhandled exception: ${err.message}`, err.stack, 'HttpExceptionFilter');
    }

    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal server error occurred.',
      },
      meta: {
        timestamp,
        correlationId,
      },
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(payload);
  }

  private getErrorCode(exception: HttpException, status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'SERVICE_UNAVAILABLE';
      default:
        return 'HTTP_ERROR';
    }
  }
}
