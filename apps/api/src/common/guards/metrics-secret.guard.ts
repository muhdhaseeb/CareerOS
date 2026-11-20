import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';

@Injectable()
export class MetricsSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const providedKey = req.headers['x-metrics-key'];
    const configuredKey = process.env.METRICS_SECRET_KEY;

    // Fail closed if the secret is not configured in the environment
    if (!configuredKey || typeof configuredKey !== 'string' || configuredKey.trim() === '') {
      throw new ForbiddenException('Metrics endpoint is not configured or accessible');
    }

    if (!providedKey || typeof providedKey !== 'string') {
      throw new ForbiddenException('Missing metrics authorization key');
    }

    // Timing-safe comparison using fixed-length SHA-256 hashes
    const configuredHash = createHash('sha256').update(configuredKey).digest();
    const providedHash = createHash('sha256').update(providedKey).digest();

    const isValid = timingSafeEqual(configuredHash, providedHash);

    if (!isValid) {
      throw new ForbiddenException('Invalid metrics authorization key');
    }

    return true;
  }
}
