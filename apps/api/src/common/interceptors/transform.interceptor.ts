import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Response } from 'express';
import type { ApiSuccessResponse } from '@careeros/contracts';
import { RequestContext } from '../context/request-context';
import { BYPASS_ENVELOPE_KEY } from '../decorators/bypass-envelope.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T> | T> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T> | T> {
    const isBypass = this.reflector.getAllAndOverride<boolean>(BYPASS_ENVELOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return next.handle().pipe(
      map((data: T) => {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse<Response>();

        if (!response) {
          return data;
        }

        // Preserve 204 No Content semantics (RFC 9110)
        if (response.statusCode === 204) {
          return data;
        }

        // Preserve redirects (3xx)
        if (response.statusCode >= 300 && response.statusCode < 400) {
          return data;
        }

        // Preserve explicit bypass endpoints (e.g. health checks, raw streams)
        if (isBypass) {
          return data;
        }

        return {
          success: true,
          data: data ?? (null as unknown as T),
          meta: {
            timestamp: new Date().toISOString(),
            correlationId: RequestContext.getCorrelationId(),
          },
        };
      }),
    );
  }
}
