import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestContext } from '../context/request-context';

const CORRELATION_ID_REGEX = /^[a-zA-Z0-9_-]{8,64}$/;

export interface RequestWithCorrelation extends Request {
  correlationId?: string;
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: RequestWithCorrelation, res: Response, next: NextFunction): void {
    const rawHeader = req.headers['x-correlation-id'] || req.headers['x-request-id'];
    let correlationId: string;

    if (typeof rawHeader === 'string' && CORRELATION_ID_REGEX.test(rawHeader)) {
      correlationId = rawHeader;
    } else {
      correlationId = randomUUID();
    }

    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);

    RequestContext.run({ correlationId }, () => {
      next();
    });
  }
}
