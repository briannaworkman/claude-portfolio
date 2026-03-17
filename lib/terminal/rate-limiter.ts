type RateLimiterOptions = {
  maxRequests: number;
  windowMs: number;
};

export class RateLimiter {
  private store = new Map<string, number[]>();
  private maxRequests: number;
  private windowMs: number;

  constructor({ maxRequests, windowMs }: RateLimiterOptions) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(ip: string): boolean {
    const now = Date.now();
    const cutoff = now - this.windowMs;

    const timestamps = (this.store.get(ip) ?? []).filter((t) => t > cutoff);

    if (timestamps.length >= this.maxRequests) return false;

    timestamps.push(now);
    this.store.set(ip, timestamps);
    return true;
  }
}
