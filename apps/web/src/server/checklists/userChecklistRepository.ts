import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/server/db/client';

export type StoredChecklistItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'done';
  position: number;
};

export interface UserChecklistRepository {
  replaceChecklist(email: string, items: StoredChecklistItem[]): Promise<void>;
  listChecklist(email: string): Promise<StoredChecklistItem[]>;
  updateStatus(email: string, itemId: string, status: StoredChecklistItem['status']): Promise<boolean>;
}

class InMemoryUserChecklistRepository implements UserChecklistRepository {
  private store = new Map<string, StoredChecklistItem[]>();

  async replaceChecklist(email: string, items: StoredChecklistItem[]) {
    this.store.set(
      email,
      items.map((item, index) => ({
        id: item.id || `item-${index}`,
        title: item.title,
        description: item.description,
        category: item.category,
        status: item.status ?? 'pending',
        position: item.position ?? index
      }))
    );
  }

  async listChecklist(email: string) {
    return this.store.get(email) ?? [];
  }

  async updateStatus(email: string, itemId: string, status: StoredChecklistItem['status']) {
    const items = this.store.get(email);
    if (!items) return false;
    const index = items.findIndex((item) => item.id === itemId);
    if (index === -1) return false;
    items[index] = { ...items[index], status };
    return true;
  }
}

type DbRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  position: number;
};

class SupabaseUserChecklistRepository implements UserChecklistRepository {
  constructor(private readonly client: SupabaseClient) {}

  async replaceChecklist(email: string, items: StoredChecklistItem[]) {
    const mapped = items.map((item, index) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status ?? 'pending',
      position: item.position ?? index
    }));

    await this.client.from('user_checklist_items').delete().eq('user_email', email);

    if (mapped.length === 0) {
      return;
    }

    const { error } = await this.client.from('user_checklist_items').insert(
      mapped.map((item) => ({
        user_email: email,
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        status: item.status ?? 'pending',
        position: item.position ?? 0
      }))
    );

    if (error) {
      throw error;
    }
  }

  async listChecklist(email: string) {
    const { data, error } = await this.client
      .from<DbRow>('user_checklist_items')
      .select('id,title,description,category,status,position')
      .eq('user_email', email)
      .order('position', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      status: (row.status as StoredChecklistItem['status']) ?? 'pending',
      position: row.position
    }));
  }

  async updateStatus(email: string, itemId: string, status: StoredChecklistItem['status']) {
    const { data, error } = await this.client
      .from('user_checklist_items')
      .update({ status })
      .match({ id: itemId, user_email: email })
      .select('id')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return Boolean(data);
  }
}

const inMemoryRepository = new InMemoryUserChecklistRepository();
let cachedRepository: UserChecklistRepository | null = null;

export function getUserChecklistRepository(): UserChecklistRepository {
  if (cachedRepository) {
    return cachedRepository;
  }

  const client = getSupabaseAdminClient();
  if (client) {
    cachedRepository = new SupabaseUserChecklistRepository(client);
    return cachedRepository;
  }

  cachedRepository = inMemoryRepository;
  return cachedRepository;
}

export function createInMemoryUserChecklistRepository() {
  return new InMemoryUserChecklistRepository();
}
