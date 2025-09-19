const BUCKET: Record<string, { count: number; expiresAt: number }> = {};

export class RateLimitError extends Error {
  constructor(message: string, public readonly status = 429) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = BUCKET[key];

  if (!bucket || now > bucket.expiresAt) {
    BUCKET[key] = { count: 1, expiresAt: now + windowMs };
    return;
  }

  if (bucket.count >= limit) {
    throw new RateLimitError('요청이 너무 잦습니다. 잠시 후 다시 시도하세요.');
  }

  bucket.count += 1;
}

export function resetRateLimiter() {
  Object.keys(BUCKET).forEach((key) => delete BUCKET[key]);
}
