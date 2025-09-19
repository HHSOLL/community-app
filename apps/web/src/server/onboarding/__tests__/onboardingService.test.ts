import { OnboardingService } from '../onboardingService';
import { createInMemoryUserRepository } from '@/server/auth/userRepository';

jest.mock('@/server/auth/userRepository', () => {
  const actual = jest.requireActual('@/server/auth/userRepository');
  return {
    ...actual,
    getUserRepository: jest.fn(() => actual.createInMemoryUserRepository())
  };
});

describe('OnboardingService', () => {
  it('saves and retrieves onboarding profile', async () => {
    const repository = createInMemoryUserRepository();
    const service = new OnboardingService(repository);

    await service.saveProfile('student@berkeley.edu', {
      term: '2025-spring',
      stayLength: 6,
      locale: 'ko',
      preferences: { notifications: true }
    });

    const profile = await service.getProfile('student@berkeley.edu');
    expect(profile).toEqual({
      term: '2025-spring',
      stayLength: 6,
      locale: 'ko',
      preferences: { notifications: true }
    });
  });
});
