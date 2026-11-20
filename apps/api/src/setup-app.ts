import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response, NextFunction } from 'express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { StructuredLogger } from './common/logger/structured.logger';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';

/**
 * Configures global API standards (versioning, validation, error filtering,
 * response transformation, request correlation, and structured logging) on a NestJS application.
 *
 * This function guarantees identical configuration across production bootstrap
 * and integration test suites.
 */
export function configureApp(app: INestApplication): INestApplication {
  app.setGlobalPrefix('api/v1');

  const logger = app.get(StructuredLogger);
  app.useLogger(logger);

  const correlationMiddleware = new CorrelationIdMiddleware();
  const requestLoggingMiddleware = new RequestLoggingMiddleware(logger);

  app.use((req: Request, res: Response, next: NextFunction) =>
    correlationMiddleware.use(req, res, next),
  );
  app.use((req: Request, res: Response, next: NextFunction) =>
    requestLoggingMiddleware.use(req, res, next),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  return app;
}
