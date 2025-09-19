import { Resend } from 'resend';
import { getAppBaseUrl, getNodeEnv, getResendApiKey } from '@/lib/env';

type SendMagicLinkParams = {
  email: string;
  token: string;
  verificationUrl: string;
};

export interface MagicLinkMailer {
  sendMagicLinkEmail(params: SendMagicLinkParams): Promise<void>;
}

class ConsoleMagicLinkMailer implements MagicLinkMailer {
  constructor(private readonly logger: (message: string) => void = console.info) {}

  async sendMagicLinkEmail({ email, verificationUrl, token }: SendMagicLinkParams) {
    const hint = getNodeEnv() === 'development' ? ` (token: ${token})` : '';
    this.logger(`Magic link requested for ${email}. Visit ${verificationUrl}${hint}`);
  }
}

class ResendMagicLinkMailer implements MagicLinkMailer {
  private readonly resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async sendMagicLinkEmail({ email, verificationUrl }: SendMagicLinkParams) {
    await this.resend.emails.send({
      from: 'Community App Auth <auth@community-app.dev>',
      to: email,
      subject: '[Community App] 로그인 링크',
      html: `
        <p>안녕하세요! Community App 로그인 링크입니다.</p>
        <p><a href="${verificationUrl}">여기를 클릭</a>하여 인증을 완료하세요.</p>
        <p>이 링크는 10분 동안만 유효합니다.</p>
      `
    });
  }
}

let cachedMailer: MagicLinkMailer | null = null;

export function getMagicLinkMailer(): MagicLinkMailer {
  if (cachedMailer) {
    return cachedMailer;
  }

  const apiKey = getResendApiKey();
  if (apiKey) {
    cachedMailer = new ResendMagicLinkMailer(apiKey);
    return cachedMailer;
  }

  cachedMailer = new ConsoleMagicLinkMailer();
  return cachedMailer;
}

export function createConsoleMagicLinkMailer(logger?: (message: string) => void) {
  return new ConsoleMagicLinkMailer(logger);
}

export function buildVerificationUrl(token: string) {
  const baseUrl = getAppBaseUrl();
  const url = new URL('/auth/verify', baseUrl);
  url.searchParams.set('token', token);
  return url.toString();
}
