import { getUserRepository, type OnboardingProfile } from '@/server/auth/userRepository';

export class OnboardingService {
  constructor(private readonly repository = getUserRepository()) {}

  async saveProfile(email: string, profile: OnboardingProfile) {
    await this.repository.ensureVerifiedUser(email);
    await this.repository.updateOnboardingProfile(email, profile);
  }

  async getProfile(email: string) {
    return this.repository.getOnboardingProfile(email);
  }
}

let cachedService: OnboardingService | null = null;

export function getOnboardingService() {
  if (!cachedService) {
    cachedService = new OnboardingService();
  }

  return cachedService;
}
