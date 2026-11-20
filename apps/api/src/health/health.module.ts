import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StructuredLogger } from '../common/logger/structured.logger';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
  providers: [HealthService, StructuredLogger],
  exports: [HealthService],
})
export class HealthModule {}
