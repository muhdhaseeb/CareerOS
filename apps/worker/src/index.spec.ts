import { describe, it, expect } from 'vitest';
import { PrismaClient } from '@careeros/database';
import { initializeWorker } from './index';

describe('Worker Initialization', () => {
  it('should initialize with ready status', () => {
    const worker = initializeWorker();
    expect(worker.status).toBe('ready');
    expect(worker.initializedAt).toBeDefined();
  });

  it('should resolve PrismaClient from @careeros/database', () => {
    expect(PrismaClient).toBeDefined();
  });
});
