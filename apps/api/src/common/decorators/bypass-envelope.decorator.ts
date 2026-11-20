import { SetMetadata } from '@nestjs/common';

export const BYPASS_ENVELOPE_KEY = 'BYPASS_ENVELOPE';

/**
 * Decorator to intentionally bypass the standard { success: true, data, meta }
 * API response envelope. Used for health probes, liveness, readiness, and raw file streams.
 */
export const BypassEnvelope = () => SetMetadata(BYPASS_ENVELOPE_KEY, true);
