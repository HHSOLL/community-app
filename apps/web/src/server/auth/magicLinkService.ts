import { randomUUID } from 'crypto';
import { getAllowedDomains, getNodeEnv } from '@/lib/env';
import { isAllowedSchoolEmail, normalizeEmail } from '@/lib/utils/email';

const TOKEN_TTL_SECONDS = 10 * 60;

type PendingToken = {
  email: string;
  expiresAt: number;
};

const pendingTokens = new Map<string, PendingToken>();

export class MagicLinkError extends Error {
  constructor(message: string, public readonly status: number = 400) {
    super(message);
    this.name = 'MagicLinkError';
  }
}

export function requestMagicLink(email: string) {
  const allowedDomains = getAllowedDomains();
  const normalizedEmail = normalizeEmail(email);

  if (!isAllowedSchoolEmail(normalizedEmail, allowedDomains)) {
    throw new MagicLinkError('해당 이메일 도메인은 허용되지 않습니다.', 403);
  }

  const token = randomUUID();
  const expiresAt = Date.now() + TOKEN_TTL_SECONDS * 1000;
  pendingTokens.set(token, { email: normalizedEmail, expiresAt });

  return {
    token,
    email: normalizedEmail,
    expiresAt,
    debugToken: getNodeEnv() !== 'production' ? token : undefined
  } as const;
}

export function verifyMagicLink(token: string) {
  const record = pendingTokens.get(token);
  if (!record) {
    throw new MagicLinkError('유효하지 않은 토큰입니다.', 400);
  }

  if (Date.now() > record.expiresAt) {
    pendingTokens.delete(token);
    throw new MagicLinkError('토큰이 만료되었습니다.', 410);
  }

  pendingTokens.delete(token);

  return {
    email: record.email
  } as const;
}

export function purgeExpiredTokens(now = Date.now()) {
  for (const [token, record] of pendingTokens.entries()) {
    if (now > record.expiresAt) {
      pendingTokens.delete(token);
    }
  }
}
