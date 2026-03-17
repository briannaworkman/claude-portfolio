import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RateLimiter } from '@/lib/terminal/rate-limiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the limit', () => {
    const limiter = new RateLimiter({ maxRequests: 3, windowMs: 60_000 });
    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip1')).toBe(true);
  });

  it('blocks when limit is exceeded', () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60_000 });
    limiter.check('ip1');
    limiter.check('ip1');
    expect(limiter.check('ip1')).toBe(false);
  });

  it('allows requests again after window slides', () => {
    const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60_000 });
    limiter.check('ip1');
    limiter.check('ip1');

    // Advance time past the window
    vi.advanceTimersByTime(61_000);

    expect(limiter.check('ip1')).toBe(true);
  });

  it('tracks IPs independently', () => {
    const limiter = new RateLimiter({ maxRequests: 1, windowMs: 60_000 });
    expect(limiter.check('ip1')).toBe(true);
    expect(limiter.check('ip2')).toBe(true);
    expect(limiter.check('ip1')).toBe(false);
  });
});
