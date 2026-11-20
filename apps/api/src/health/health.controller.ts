import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { BypassEnvelope } from '../common/decorators/bypass-envelope.decorator';
import type {
  DetailedHealthResponse,
  LivenessResponse,
  ReadinessResponse,
} from '@careeros/contracts';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @BypassEnvelope()
  getHealth(): Promise<DetailedHealthResponse> {
    return this.healthService.getDetailedHealth();
  }

  @Get('live')
  @BypassEnvelope()
  getLiveness(): LivenessResponse {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  @BypassEnvelope()
  getReadiness(): Promise<ReadinessResponse> {
    return this.healthService.getReadiness();
  }
}
