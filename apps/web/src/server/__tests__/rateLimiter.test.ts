import { checkRateLimit, resetRateLimiter, RateLimitError } from '../rateLimiter';

describe('rateLimiter', () => {
  afterEach(() => {
    resetRateLimiter();
  });

  it('allows requests under the limit', () => {
    expect(() => {
      for (let i = 0; i < 5; i += 1) {
        checkRateLimit('key', 5, 1000);
      }
    }).not.toThrow();
  });

  it('blocks requests over the limit', () => {
    expect(() => {
      for (let i = 0; i < 6; i += 1) {
        checkRateLimit('key', 5, 1000);
      }
    }).toThrow(RateLimitError);
  });
});
