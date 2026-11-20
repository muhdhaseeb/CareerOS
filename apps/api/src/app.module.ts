import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { StructuredLogger } from './common/logger/structured.logger';

@Module({
  imports: [PrismaModule, HealthModule, MetricsModule],
  providers: [StructuredLogger],
  exports: [StructuredLogger],
})
export class AppModule {}
