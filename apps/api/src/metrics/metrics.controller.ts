import { Controller, Get, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsSecretGuard } from '../common/guards/metrics-secret.guard';
import type { SystemMetricsResponse } from '@careeros/contracts';

@Controller('metrics')
@UseGuards(MetricsSecretGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  getMetrics(): SystemMetricsResponse {
    return this.metricsService.getMetrics();
  }
}
