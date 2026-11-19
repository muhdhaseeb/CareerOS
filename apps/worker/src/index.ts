/**
 * CareerOS — Standalone Background Worker
 * Minimal worker process stub. BullMQ queues will be configured in TASK-002 and TASK-016.
 */
import { getCurrentIsoTimestamp } from '@careeros/utils';

export function initializeWorker(): { status: string; initializedAt: string } {
  const initializedAt = getCurrentIsoTimestamp();
  return {
    status: 'ready',
    initializedAt,
  };
}

if (require.main === module) {
  const info = initializeWorker();
  // Safe logging during startup
  console.log(`[Worker] Started at ${info.initializedAt} with status: ${info.status}`);
}
