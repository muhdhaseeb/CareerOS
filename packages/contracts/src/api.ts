/**
 * CareerOS — API and Observability Contracts
 *
 * Defines standardized response envelopes, error structures, health probes,
 * and operational metrics shared across the monorepo.
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: {
    timestamp: string;
    correlationId: string;
  };
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  meta: {
    timestamp: string;
    correlationId: string;
  };
}

export type HealthStatus = 'ok' | 'degraded' | 'error';

export interface LivenessResponse {
  status: 'ok';
  timestamp: string;
}

export interface ReadinessResponse {
  status: 'ok' | 'error';
  timestamp: string;
  checks: {
    database: 'up' | 'down';
  };
}

export interface DetailedHealthResponse {
  status: HealthStatus;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    database: {
      status: 'up' | 'down';
    };
    memory: {
      heapUsedMb: number;
      heapTotalMb: number;
      rssMb: number;
    };
  };
}

export interface SystemMetricsResponse {
  timestamp: string;
  uptimeSeconds: number;
  memory: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
}
