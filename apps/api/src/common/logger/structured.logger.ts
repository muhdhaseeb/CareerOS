import { Injectable, LoggerService } from '@nestjs/common';
import { RequestContext } from '../context/request-context';
import { SecretRedactor } from './secret-redactor';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'VERBOSE';

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  context?: string;
  correlationId: string;
  message: string;
  data?: unknown;
  stack?: string;
}

@Injectable()
export class StructuredLogger implements LoggerService {
  private isProduction = process.env.NODE_ENV === 'production';

  log(message: unknown, context?: string): void {
    this.writeLog('INFO', message, context);
  }

  error(message: unknown, stack?: string, context?: string): void {
    this.writeLog('ERROR', message, context, stack);
  }

  warn(message: unknown, context?: string): void {
    this.writeLog('WARN', message, context);
  }

  debug(message: unknown, context?: string): void {
    this.writeLog('DEBUG', message, context);
  }

  verbose(message: unknown, context?: string): void {
    this.writeLog('VERBOSE', message, context);
  }

  private writeLog(level: LogLevel, rawMessage: unknown, context?: string, stack?: string): void {
    const timestamp = new Date().toISOString();
    const correlationId = RequestContext.getCorrelationId();

    let messageStr = '';
    let extraData: unknown = undefined;

    if (typeof rawMessage === 'string') {
      messageStr = SecretRedactor.redactString(rawMessage);
    } else if (rawMessage instanceof Error) {
      const redacted = SecretRedactor.redact(rawMessage) as Record<string, unknown>;
      messageStr = (redacted.message as string) || rawMessage.message;
      if (!stack && redacted.stack) {
        stack = redacted.stack as string;
      }
    } else if (rawMessage !== null && typeof rawMessage === 'object') {
      extraData = SecretRedactor.redact(rawMessage);
      messageStr = '[Structured Data]';
    } else {
      messageStr = String(rawMessage);
    }

    const sanitizedStack = stack ? SecretRedactor.redactString(stack) : undefined;

    const entry: StructuredLogEntry = {
      timestamp,
      level,
      context,
      correlationId,
      message: messageStr,
      ...(extraData !== undefined ? { data: extraData } : {}),
      ...(sanitizedStack ? { stack: sanitizedStack } : {}),
    };

    if (this.isProduction) {
      process.stdout.write(JSON.stringify(entry) + '\n');
    } else {
      const contextPrefix = context ? `[${context}] ` : '';
      const corr = correlationId !== 'unknown' ? `(${correlationId}) ` : '';
      const output = `${timestamp} [${level}] ${contextPrefix}${corr}${messageStr}`;

      if (level === 'ERROR') {
        process.stderr.write(output + (sanitizedStack ? `\n${sanitizedStack}` : '') + '\n');
      } else {
        process.stdout.write(output + '\n');
      }
    }
  }
}
