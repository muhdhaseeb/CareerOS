import { Injectable } from '@nestjs/common';
import type { SystemMetricsResponse } from '@careeros/contracts';

@Injectable()
export class MetricsService {
  private readonly startTime = Date.now();

  getMetrics(): SystemMetricsResponse {
    const mem = process.memoryUsage();

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      memory: {
        heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
        rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      },
    };
  }
}
