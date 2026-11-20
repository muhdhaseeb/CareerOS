/**
 * CareerOS — Secret and PII Redactor
 *
 * Recursively scans logs, objects, headers, and strings to ensure sensitive
 * credentials, authentication tokens, and secrets are excluded from logs.
 */

const SENSITIVE_KEY_REGEX =
  /^(password|passwd|token|secret|authorization|cookie|set-cookie|credential|bearer|session|jwt|apikey|api_key|privatekey|private_key)$/i;

const BEARER_TOKEN_REGEX = /Bearer\s+[A-Za-z0-9_\-.]+/gi;
const QUERY_SECRET_REGEX = /((?:password|token|secret|api[_-]?key)=)[^&\s]+/gi;
const POSTGRES_URI_REGEX = /(postgres(?:ql)?:\/\/[^:]+:)[^@]+(@)/gi;

export class SecretRedactor {
  static redact(value: unknown, visited = new WeakSet()): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      return this.redactString(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (value instanceof Error) {
      return this.redactError(value, visited);
    }

    if (typeof value === 'object') {
      if (visited.has(value as object)) {
        return '[CIRCULAR]';
      }
      visited.add(value as object);

      if (Array.isArray(value)) {
        return value.map((item) => this.redact(item, visited));
      }

      const redactedObj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        if (SENSITIVE_KEY_REGEX.test(key)) {
          redactedObj[key] = '[REDACTED]';
        } else {
          redactedObj[key] = this.redact(val, visited);
        }
      }
      return redactedObj;
    }

    return String(value);
  }

  static redactString(str: string): string {
    return str
      .replace(BEARER_TOKEN_REGEX, 'Bearer [REDACTED]')
      .replace(QUERY_SECRET_REGEX, '$1[REDACTED]')
      .replace(POSTGRES_URI_REGEX, '$1[REDACTED]$2');
  }

  private static redactError(err: Error, visited: WeakSet<object>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {
      name: err.name,
      message: this.redactString(err.message),
    };

    if (err.stack) {
      sanitized.stack = this.redactString(err.stack);
    }

    // Capture custom enumerable properties on error instance
    for (const [key, val] of Object.entries(err)) {
      if (key !== 'name' && key !== 'message' && key !== 'stack') {
        if (SENSITIVE_KEY_REGEX.test(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.redact(val, visited);
        }
      }
    }

    return sanitized;
  }
}
