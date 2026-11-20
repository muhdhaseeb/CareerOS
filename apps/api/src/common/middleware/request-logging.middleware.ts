import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { StructuredLogger } from '../logger/structured.logger';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: StructuredLogger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, originalUrl } = req;
    const sanitizedPath = (originalUrl || req.url || '/').split('?')[0];

    res.on('finish', () => {
      const durationMs = Date.now() - startTime;
      const { statusCode } = res;
      const userAgent = req.headers['user-agent']?.substring(0, 100);
      const uaSuffix = userAgent ? ` [${userAgent}]` : '';

      this.logger.log(
        `${method} ${sanitizedPath} ${statusCode} - ${durationMs}ms${uaSuffix}`,
        'HTTP',
      );
    });

    next();
  }
}
