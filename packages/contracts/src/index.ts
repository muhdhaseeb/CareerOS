/**
 * CareerOS — Shared Contracts
 * Strictly minimal system health contracts for foundation verification.
 */

export interface SystemHealth {
  status: 'ok' | 'degraded' | 'error';
  version: string;
  timestamp: string;
  uptimeSeconds: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    correlationId?: string;
  };
}
