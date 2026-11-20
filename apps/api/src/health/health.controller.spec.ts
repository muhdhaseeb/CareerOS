import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import type {
  DetailedHealthResponse,
  LivenessResponse,
  ReadinessResponse,
} from '@careeros/contracts';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  const mockHealthService = {
    getLiveness: vi.fn(),
    getReadiness: vi.fn(),
    getDetailedHealth: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should return liveness status', () => {
    const liveness: LivenessResponse = {
      status: 'ok',
      timestamp: '2026-11-20T21:00:00.000Z',
    };
    mockHealthService.getLiveness.mockReturnValue(liveness);

    const result = controller.getLiveness();
    expect(result).toEqual(liveness);
    expect(service.getLiveness).toHaveBeenCalled();
  });

  it('should return readiness status', async () => {
    const readiness: ReadinessResponse = {
      status: 'ok',
      timestamp: '2026-11-20T21:00:00.000Z',
      checks: { database: 'up' },
    };
    mockHealthService.getReadiness.mockResolvedValue(readiness);

    const result = await controller.getReadiness();
    expect(result).toEqual(readiness);
    expect(service.getReadiness).toHaveBeenCalled();
  });

  it('should return detailed health status', async () => {
    const detailed: DetailedHealthResponse = {
      status: 'ok',
      version: '0.1.0',
      timestamp: '2026-11-20T21:00:00.000Z',
      uptimeSeconds: 120,
      checks: {
        database: { status: 'up' },
        memory: { heapUsedMb: 30, heapTotalMb: 50, rssMb: 80 },
      },
    };
    mockHealthService.getDetailedHealth.mockResolvedValue(detailed);

    const result = await controller.getHealth();
    expect(result).toEqual(detailed);
    expect(service.getDetailedHealth).toHaveBeenCalled();
  });
});
