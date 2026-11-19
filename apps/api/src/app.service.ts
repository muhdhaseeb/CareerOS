import { Injectable } from '@nestjs/common';
import type { SystemHealth } from '@careeros/contracts';
import { getCurrentIsoTimestamp } from '@careeros/utils';

@Injectable()
export class AppService {
  private readonly startTime = Date.now();

  getHealth(): SystemHealth {
    return {
      status: 'ok',
      version: '0.1.0',
      timestamp: getCurrentIsoTimestamp(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }
}
