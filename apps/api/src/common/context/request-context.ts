import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestStore {
  correlationId: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestStore>();

export class RequestContext {
  static getCorrelationId(): string {
    const store = asyncLocalStorage.getStore();
    return store?.correlationId ?? 'unknown';
  }

  static run<R>(store: RequestStore, callback: () => R): R {
    return asyncLocalStorage.run(store, callback);
  }
}
