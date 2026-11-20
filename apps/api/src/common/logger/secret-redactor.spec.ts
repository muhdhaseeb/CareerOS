import { describe, it, expect } from 'vitest';
import { SecretRedactor } from './secret-redactor';

describe('SecretRedactor', () => {
  it('should redact sensitive keys in flat and nested objects', () => {
    const input = {
      username: 'johndoe',
      password: 'supersecretpassword123',
      nested: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz',
        safeField: 'hello',
        credential: 'raw-credential-string',
        authConfig: {
          apiKey: 'secret-key-999',
          allowedOrigins: ['localhost'],
        },
      },
    };

    const redacted = SecretRedactor.redact(input) as Record<string, unknown>;

    expect(redacted.username).toBe('johndoe');
    expect(redacted.password).toBe('[REDACTED]');
    const nested = redacted.nested as Record<string, unknown>;
    expect(nested.token).toBe('[REDACTED]');
    expect(nested.safeField).toBe('hello');
    expect(nested.credential).toBe('[REDACTED]');
    const authConfig = nested.authConfig as Record<string, unknown>;
    expect(authConfig.apiKey).toBe('[REDACTED]');
    expect(authConfig.allowedOrigins).toEqual(['localhost']);
  });

  it('should redact bearer tokens in strings', () => {
    const logMessage =
      'User authorized with Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.sig successfully';
    const result = SecretRedactor.redactString(logMessage);
    expect(result).toBe('User authorized with Bearer [REDACTED] successfully');
  });

  it('should redact query string secrets', () => {
    const query =
      '/api/v1/resource?user=123&token=supersecrettoken&password=myPass&apiKey=secret123';
    const result = SecretRedactor.redactString(query);
    expect(result).toBe(
      '/api/v1/resource?user=123&token=[REDACTED]&password=[REDACTED]&apiKey=[REDACTED]',
    );
  });

  it('should redact PostgreSQL database connection URIs', () => {
    const uri =
      'Connection error on postgresql://postgres:mypassword123@localhost:5433/careeros_dev_db';
    const result = SecretRedactor.redactString(uri);
    expect(result).toBe(
      'Connection error on postgresql://postgres:[REDACTED]@localhost:5433/careeros_dev_db',
    );
  });

  it('should redact Error instances and their stacks', () => {
    const error = new Error(
      'Failed to connect to postgresql://postgres:mypassword123@localhost:5433/db',
    );
    (error as unknown as Record<string, unknown>).token = 'secret-session-token';

    const redacted = SecretRedactor.redact(error) as Record<string, unknown>;

    expect(redacted.name).toBe('Error');
    expect(redacted.message).toContain('postgresql://postgres:[REDACTED]@localhost:5433/db');
    expect(redacted.message).not.toContain('mypassword123');
    expect(redacted.token).toBe('[REDACTED]');
  });

  it('should handle circular references safely', () => {
    const obj: Record<string, unknown> = { name: 'test' };
    obj.self = obj;

    const redacted = SecretRedactor.redact(obj) as Record<string, unknown>;
    expect(redacted.name).toBe('test');
    expect(redacted.self).toBe('[CIRCULAR]');
  });

  it('should preserve primitives and arrays', () => {
    expect(SecretRedactor.redact(null)).toBeNull();
    expect(SecretRedactor.redact(undefined)).toBeUndefined();
    expect(SecretRedactor.redact(42)).toBe(42);
    expect(SecretRedactor.redact(true)).toBe(true);

    const list = [1, 'safe', { password: 'pass' }];
    const redactedList = SecretRedactor.redact(list) as unknown[];
    expect(redactedList[0]).toBe(1);
    expect(redactedList[1]).toBe('safe');
    expect((redactedList[2] as Record<string, unknown>).password).toBe('[REDACTED]');
  });
});
