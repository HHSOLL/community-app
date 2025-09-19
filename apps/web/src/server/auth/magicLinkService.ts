import { randomUUID } from 'crypto';
import { getAllowedDomains, getNodeEnv } from '@/lib/env';
import { isAllowedSchoolEmail, normalizeEmail } from '@/lib/utils/email';
import {
  buildVerificationUrl,
  createConsoleMagicLinkMailer,
  getMagicLinkMailer,
  type MagicLinkMailer
} from '@/server/auth/magicLinkMailer';
import {
  createInMemoryMagicLinkRepository,
  getMagicLinkRepository,
  resetMagicLinkRepositoryForTests,
  type MagicLinkRepository
} from '@/server/auth/magicLinkRepository';

const TOKEN_TTL_SECONDS = 10 * 60;

export class MagicLinkError extends Error {
  constructor(message: string, public readonly status: number = 400) {
    super(message);
    this.name = 'MagicLinkError';
  }
}

type MagicLinkRequestResult = {
  email: string;
  expiresAt: number;
  debugToken?: string;
};

type MagicLinkVerificationResult = {
  email: string;
};

export class MagicLinkService {
  constructor(
    private readonly repository: MagicLinkRepository,
    private readonly mailer: MagicLinkMailer
  ) {}

  async requestMagicLink(email: string): Promise<MagicLinkRequestResult> {
    const allowedDomains = getAllowedDomains();
    const normalizedEmail = normalizeEmail(email);

    if (!isAllowedSchoolEmail(normalizedEmail, allowedDomains)) {
      throw new MagicLinkError('해당 이메일 도메인은 허용되지 않습니다.', 403);
    }

    const token = randomUUID();
    const expiresAt = Date.now() + TOKEN_TTL_SECONDS * 1000;

    await this.repository.saveToken({ token, email: normalizedEmail, expiresAt });

    const verificationUrl = buildVerificationUrl(token);
    await this.mailer.sendMagicLinkEmail({ email: normalizedEmail, token, verificationUrl });

    return {
      email: normalizedEmail,
      expiresAt,
      debugToken: getNodeEnv() !== 'production' ? token : undefined
    };
  }

  async verifyMagicLink(token: string): Promise<MagicLinkVerificationResult> {
    const record = await this.repository.consumeToken(token);
    if (!record) {
      throw new MagicLinkError('유효하지 않은 토큰입니다.', 400);
    }

    if (Date.now() > record.expiresAt) {
      throw new MagicLinkError('토큰이 만료되었습니다.', 410);
    }

    return { email: record.email };
  }

  async purgeExpiredTokens(now = Date.now()): Promise<void> {
    await this.repository.purgeExpired(now);
  }
}

let cachedService: MagicLinkService | null = null;

export function getMagicLinkService(): MagicLinkService {
  if (!cachedService) {
    cachedService = new MagicLinkService(getMagicLinkRepository(), getMagicLinkMailer());
  }

  return cachedService;
}

export function createInMemoryMagicLinkService() {
  const repository = createInMemoryMagicLinkRepository();
  const mailer = createConsoleMagicLinkMailer();
  return {
    service: new MagicLinkService(repository, mailer),
    repository,
    mailer
  };
}

export function resetMagicLinkServiceForTests() {
  resetMagicLinkRepositoryForTests();
  cachedService = new MagicLinkService(getMagicLinkRepository(), getMagicLinkMailer());
}
