/**
 * CareerOS — Shared Utilities
 */

/**
 * Asserts that a condition is true, throwing an Error if not.
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}

/**
 * Returns an ISO timestamp string.
 */
export function getCurrentIsoTimestamp(): string {
  return new Date().toISOString();
}
