import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { MetricsSecretGuard } from '../common/guards/metrics-secret.guard';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, MetricsSecretGuard],
  exports: [MetricsService],
})
export class MetricsModule {}
