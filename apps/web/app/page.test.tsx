import { describe, it, expect } from 'vitest';
import HomePage from './page';

describe('HomePage Smoke Test', () => {
  it('renders HomePage component successfully', () => {
    expect(HomePage).toBeDefined();
  });
});
