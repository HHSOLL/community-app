import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/server/db/client';

export type UserRecord = {
  email: string;
  emailDomain: string;
  schoolId: string;
  languages: string[];
  verified: boolean;
  roles: string[];
};

export type OnboardingProfile = {
  term: string;
  stayLength: number;
  locale: string;
  preferences?: {
    notifications?: boolean;
  };
};

export interface UserRepository {
  ensureVerifiedUser(email: string): Promise<void>;
  updateOnboardingProfile(email: string, profile: OnboardingProfile): Promise<void>;
  getOnboardingProfile(email: string): Promise<OnboardingProfile | null>;
}

class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, UserRecord>();
  private profiles = new Map<string, OnboardingProfile>();

  async ensureVerifiedUser(email: string) {
    if (!this.users.has(email)) {
      const domain = email.split('@')[1] ?? 'berkeley.edu';
      this.users.set(email, {
        email,
        emailDomain: domain,
        schoolId: 'uc-berkeley',
        languages: ['ko'],
        verified: true,
        roles: ['member']
      });
    } else {
      const existing = this.users.get(email)!;
      this.users.set(email, { ...existing, verified: true });
    }
  }

  async updateOnboardingProfile(email: string, profile: OnboardingProfile) {
    await this.ensureVerifiedUser(email);
    this.profiles.set(email, profile);
  }

  async getOnboardingProfile(email: string) {
    return this.profiles.get(email) ?? null;
  }

  clear() {
    this.users.clear();
    this.profiles.clear();
  }
}

class SupabaseUserRepository implements UserRepository {
  constructor(private readonly client: SupabaseClient) {}

  async ensureVerifiedUser(email: string) {
    const domain = email.split('@')[1] ?? '';
    if (!domain) return;

    const { error } = await this.client
      .from('users')
      .upsert({
        email,
        email_domain: domain,
        school_id: 'uc-berkeley',
        verified: true
      }, {
        onConflict: 'email'
      });

    if (error) {
      throw error;
    }
  }

  async updateOnboardingProfile(email: string, profile: OnboardingProfile) {
    const { error } = await this.client
      .from('onboarding_profiles')
      .upsert({
        user_email: email,
        term: profile.term,
        stay_length: profile.stayLength,
        locale: profile.locale,
        preferences: profile.preferences ?? {}
      }, {
        onConflict: 'user_email'
      });

    if (error) {
      throw error;
    }
  }

  async getOnboardingProfile(email: string) {
    const { data, error } = await this.client
      .from('onboarding_profiles')
      .select('term, stay_length, locale, preferences')
      .eq('user_email', email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      term: data.term,
      stayLength: data.stay_length,
      locale: data.locale,
      preferences: data.preferences ?? {}
    } satisfies OnboardingProfile;
  }
}

const inMemoryRepository = new InMemoryUserRepository();
let cachedRepository: UserRepository | null = null;

export function getUserRepository(): UserRepository {
  if (cachedRepository) {
    return cachedRepository;
  }

  const client = getSupabaseAdminClient();
  if (client) {
    cachedRepository = new SupabaseUserRepository(client);
    return cachedRepository;
  }

  cachedRepository = inMemoryRepository;
  return cachedRepository;
}

export function createInMemoryUserRepository() {
  return new InMemoryUserRepository();
}

export function resetUserRepositoryForTests() {
  inMemoryRepository.clear();
  cachedRepository = inMemoryRepository;
}
