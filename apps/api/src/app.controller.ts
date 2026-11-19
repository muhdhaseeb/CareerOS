import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { SystemHealth } from '@careeros/contracts';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): SystemHealth {
    return this.appService.getHealth();
  }
}
