import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/server/db/client';

type TokenRecord = {
  token: string;
  email: string;
  expiresAt: number;
};

export interface MagicLinkRepository {
  saveToken(record: TokenRecord): Promise<void>;
  consumeToken(token: string): Promise<TokenRecord | null>;
  purgeExpired(now: number): Promise<void>;
}

class InMemoryMagicLinkRepository implements MagicLinkRepository {
  private records = new Map<string, TokenRecord>();

  async saveToken(record: TokenRecord) {
    this.records.set(record.token, record);
  }

  async consumeToken(token: string) {
    const record = this.records.get(token) ?? null;
    if (record) {
      this.records.delete(token);
    }
    return record;
  }

  async purgeExpired(now: number) {
    for (const [token, record] of this.records.entries()) {
      if (now > record.expiresAt) {
        this.records.delete(token);
      }
    }
  }

  clear() {
    this.records.clear();
  }
}

const TABLE_NAME = 'magic_link_tokens';

type SupabaseRow = {
  token: string;
  email: string;
  expires_at: string;
};

class SupabaseMagicLinkRepository implements MagicLinkRepository {
  constructor(private readonly client: SupabaseClient) {}

  async saveToken(record: TokenRecord) {
    const { error } = await this.client
      .from(TABLE_NAME)
      .upsert({
        token: record.token,
        email: record.email,
        expires_at: new Date(record.expiresAt).toISOString()
      });

    if (error) {
      throw error;
    }
  }

  async consumeToken(token: string) {
    const { data, error } = await this.client
      .from<SupabaseRow>(TABLE_NAME)
      .select('token,email,expires_at')
      .eq('token', token)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    await this.client.from(TABLE_NAME).delete().eq('token', token);

    return {
      token: data.token,
      email: data.email,
      expiresAt: new Date(data.expires_at).getTime()
    } satisfies TokenRecord;
  }

  async purgeExpired(now: number) {
    const cutoff = new Date(now).toISOString();
    await this.client.from(TABLE_NAME).delete().lt('expires_at', cutoff);
  }
}

const inMemoryRepository = new InMemoryMagicLinkRepository();
let cachedRepository: MagicLinkRepository | null = null;

export function getMagicLinkRepository(): MagicLinkRepository {
  if (cachedRepository) {
    return cachedRepository;
  }

  const client = getSupabaseAdminClient();
  if (client) {
    cachedRepository = new SupabaseMagicLinkRepository(client);
    return cachedRepository;
  }

  cachedRepository = inMemoryRepository;
  return cachedRepository;
}

export function createInMemoryMagicLinkRepository() {
  return new InMemoryMagicLinkRepository();
}

export function resetMagicLinkRepositoryForTests() {
  inMemoryRepository.clear();
  cachedRepository = inMemoryRepository;
}
