/**
 * CareerOS — Shared Contracts
 */

export * from './api';

/**
 * Legacy system health interface preserved for backward compatibility.
 */
export interface SystemHealth {
  status: 'ok' | 'degraded' | 'error';
  version: string;
  timestamp: string;
  uptimeSeconds: number;
}

/**
 * Generic API response envelope preserved for backward compatibility.
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    correlationId?: string;
  };
}
