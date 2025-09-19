import { requestMagicLink, verifyMagicLink, MagicLinkError, purgeExpiredTokens } from '../magicLinkService';

jest.mock('@/lib/env', () => ({
  getAllowedDomains: () => ['berkeley.edu'],
  getNodeEnv: () => 'test'
}));

jest.mock('@/lib/utils/email', () => ({
  normalizeEmail: (email: string) => email.trim().toLowerCase(),
  isAllowedSchoolEmail: (email: string, allowed: string[]) => allowed.includes(email.split('@')[1] ?? '')
}));

describe('magicLinkService', () => {
  it('creates and verifies a magic link token', () => {
    const { token, email } = requestMagicLink('student@berkeley.edu');
    expect(token).toBeDefined();
    const result = verifyMagicLink(token);
    expect(result.email).toBe(email);
  });

  it('rejects invalid domains', () => {
    expect(() => requestMagicLink('user@gmail.com')).toThrow(MagicLinkError);
  });

  it('expires tokens after TTL', () => {
    const { token } = requestMagicLink('student@berkeley.edu');
    purgeExpiredTokens(Date.now() + 11 * 60 * 1000);
    expect(() => verifyMagicLink(token)).toThrow(MagicLinkError);
  });
});
