/**
 * CareerOS — Database Target Safety Guard
 * Protects native PostgreSQL on port 5432 and enforces environment-aware target allowlists.
 */

export function validateDatabaseTarget(
  connectionString: string,
  environment: 'development' | 'test' | 'production',
): void {
  if (!connectionString) {
    throw new Error('[DATABASE TARGET ERROR] Connection string is missing.');
  }

  let parsed: URL;
  try {
    parsed = new URL(connectionString);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[DATABASE TARGET ERROR] Invalid connection string URL: ${msg}`);
  }

  if (environment === 'production') {
    const dbName = parsed.pathname.replace(/^\//, '');
    if (
      dbName === 'careeros_local_dev' ||
      dbName === 'careeros_dev_db' ||
      dbName === 'careeros_test_db'
    ) {
      throw new Error(
        `[DATABASE TARGET ERROR] Production environment cannot use local development database name "${dbName}".`,
      );
    }
    const sslMode = parsed.searchParams.get('sslmode');
    if (sslMode !== 'require' && !parsed.searchParams.has('ssl')) {
      throw new Error(
        '[DATABASE TARGET ERROR] Production database connection requires explicit SSL configuration (e.g., sslmode=require).',
      );
    }
    return;
  }

  // Local Development & Integration Testing Rules
  // 1. Host must be strictly loopback
  if (parsed.hostname !== '127.0.0.1' && parsed.hostname !== 'localhost') {
    throw new Error(
      `[DATABASE TARGET ERROR] Host "${parsed.hostname}" is forbidden for local ${environment}. Must be 127.0.0.1 or localhost.`,
    );
  }

  // 2. Port must strictly be 5433 (native PostgreSQL on 5432 is strictly forbidden)
  if (parsed.port !== '5433') {
    throw new Error(
      `[DATABASE TARGET ERROR] Port "${parsed.port}" is forbidden. Must be 5433 to protect native PostgreSQL on 5432.`,
    );
  }

  // 3. Strict Database Name Separation
  const dbName = parsed.pathname.replace(/^\//, '');
  if (environment === 'test') {
    if (dbName !== 'careeros_test_db') {
      throw new Error(
        `[DATABASE TARGET ERROR] Target database "${dbName}" is forbidden for integration tests. Expected "careeros_test_db".`,
      );
    }
  } else if (environment === 'development') {
    const allowedDevDbs = ['careeros_dev_db', 'careeros_local_dev'];
    if (!allowedDevDbs.includes(dbName)) {
      throw new Error(
        `[DATABASE TARGET ERROR] Target database "${dbName}" is forbidden for development. Expected one of: ${allowedDevDbs.join(', ')}.`,
      );
    }
  }
}
