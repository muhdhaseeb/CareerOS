import { Injectable } from '@nestjs/common';
import type {
  DetailedHealthResponse,
  LivenessResponse,
  ReadinessResponse,
} from '@careeros/contracts';
import { PrismaService } from '../prisma/prisma.service';
import { StructuredLogger } from '../common/logger/structured.logger';
import { ReadinessException } from '../common/exceptions/readiness.exception';

@Injectable()
export class HealthService {
  private inFlightProbe: Promise<ReadinessResponse> | null = null;
  private lastProbeResult: { response: ReadinessResponse; timestamp: number } | null = null;
  private readonly PROBE_CACHE_TTL_MS = 1000;
  private readonly startTime = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: StructuredLogger,
  ) {}

  getLiveness(): LivenessResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<ReadinessResponse> {
    const now = Date.now();

    // 1. Return recent probe result if within cache TTL
    if (this.lastProbeResult && now - this.lastProbeResult.timestamp < this.PROBE_CACHE_TTL_MS) {
      if (this.lastProbeResult.response.status === 'error') {
        throw new ReadinessException(this.lastProbeResult.response);
      }
      return this.lastProbeResult.response;
    }

    // 2. Coalesce concurrent in-flight probes (single-flight)
    if (this.inFlightProbe) {
      return this.inFlightProbe;
    }

    // 3. Initiate single-flight probe with database-enforced statement timeout
    this.inFlightProbe = this.executeDatabaseProbe()
      .then((response) => {
        this.lastProbeResult = { response, timestamp: Date.now() };
        this.inFlightProbe = null;
        return response;
      })
      .catch((err) => {
        const failureResponse: ReadinessResponse = {
          status: 'error',
          timestamp: new Date().toISOString(),
          checks: {
            database: 'down',
          },
        };
        this.lastProbeResult = { response: failureResponse, timestamp: Date.now() };
        this.inFlightProbe = null;

        this.logger.warn(
          `Readiness database probe failed: ${(err as Error)?.message ?? 'Unknown error'}`,
          'HealthService',
        );

        throw new ReadinessException(failureResponse);
      });

    return this.inFlightProbe;
  }

  async getDetailedHealth(): Promise<DetailedHealthResponse> {
    let dbStatus: 'up' | 'down' = 'down';

    try {
      await this.executeDatabaseProbe();
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    const mem = process.memoryUsage();

    return {
      status: dbStatus === 'up' ? 'ok' : 'degraded',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      checks: {
        database: {
          status: dbStatus,
        },
        memory: {
          heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
          rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
        },
      },
    };
  }

  /**
   * Executes a bounded database probe.
   * Uses a PostgreSQL session statement timeout (2000ms) inside a Prisma transaction
   * bounded by a 2500ms client timeout to guarantee cancellation at both the database
   * engine and client levels.
   */
  private async executeDatabaseProbe(): Promise<ReadinessResponse> {
    await this.prisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe('SET LOCAL statement_timeout = 2000;');
        await tx.$queryRawUnsafe('SELECT 1;');
      },
      {
        timeout: 2500,
        maxWait: 1000,
      },
    );

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'up',
      },
    };
  }
}
