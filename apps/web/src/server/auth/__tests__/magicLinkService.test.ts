import { MagicLinkService, MagicLinkError } from '../magicLinkService';
import { createInMemoryMagicLinkRepository } from '../magicLinkRepository';
import { createInMemoryUserRepository } from '../userRepository';
import type { MagicLinkMailer } from '../magicLinkMailer';

jest.mock('@/lib/env', () => ({
  getAllowedDomains: () => ['berkeley.edu'],
  getNodeEnv: () => 'test',
  getAppBaseUrl: () => 'http://localhost:3000',
  getResendApiKey: () => '',
  getSupabaseConfig: () => null
}));

describe('magicLinkService', () => {
  const createService = () => {
    const repository = createInMemoryMagicLinkRepository();
    const mailer: MagicLinkMailer = {
      sendMagicLinkEmail: jest.fn(() => Promise.resolve())
    };
    const userRepository = createInMemoryUserRepository();
    return {
      service: new MagicLinkService(repository, mailer, userRepository),
      repository,
      mailer,
      userRepository
    };
  };

  it('creates and verifies a magic link token', async () => {
    const { service, mailer } = createService();
    const result = await service.requestMagicLink('student@berkeley.edu');
    expect(result.debugToken).toBeDefined();
    expect((mailer.sendMagicLinkEmail as jest.Mock).mock.calls[0][0].email).toBe('student@berkeley.edu');

    const verification = await service.verifyMagicLink(result.debugToken!);
    expect(verification.email).toBe('student@berkeley.edu');
  });

  it('rejects invalid domains', async () => {
    const { service } = createService();
    await expect(service.requestMagicLink('user@gmail.com')).rejects.toThrow(MagicLinkError);
  });

  it('expires tokens after TTL', async () => {
    const { service, repository } = createService();
    const { debugToken } = await service.requestMagicLink('student@berkeley.edu');
    await repository.purgeExpired(Date.now() + 11 * 60 * 1000);
    await expect(service.verifyMagicLink(debugToken!)).rejects.toThrow(MagicLinkError);
  });
});
