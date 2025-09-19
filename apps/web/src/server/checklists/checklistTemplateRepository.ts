import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/server/db/client';

type TemplateKey = {
  term: string;
  stayLength: number;
  locale: string;
};

type TemplateItem = {
  title: string;
  description: string;
  category: string;
  position?: number;
};

type ChecklistTemplate = {
  items: TemplateItem[];
};

export interface ChecklistTemplateRepository {
  getTemplate(key: TemplateKey): Promise<ChecklistTemplate | null>;
}

const fallbackTemplates: Record<string, TemplateItem[]> = {
  '2025-spring:6:ko': [
    {
      title: '통신 개통 준비',
      description: '추천 통신사 비교 및 요금제 선택',
      category: '통신',
      position: 0
    },
    {
      title: '은행 계좌 개설',
      description: '필요 서류 준비 및 지점 예약',
      category: '은행',
      position: 1
    },
    {
      title: 'Cal 1 Card 발급',
      description: '사진 업로드 및 수령 일정 확인',
      category: '학생증',
      position: 2
    }
  ]
};

class InMemoryChecklistTemplateRepository implements ChecklistTemplateRepository {
  async getTemplate(key: TemplateKey) {
    const template = fallbackTemplates[`${key.term}:${key.stayLength}:${key.locale}`];
    if (!template) return null;
    return { items: template } satisfies ChecklistTemplate;
  }
}

type TemplateRow = {
  items: TemplateItem[];
};

class SupabaseChecklistTemplateRepository implements ChecklistTemplateRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getTemplate(key: TemplateKey) {
    const { data, error } = await this.client
      .from<TemplateRow>('checklist_templates')
      .select('items')
      .match({ term: key.term, stay_length: key.stayLength, locale: key.locale })
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return { items: data.items } satisfies ChecklistTemplate;
  }
}

let cachedRepository: ChecklistTemplateRepository | null = null;
const inMemoryRepository = new InMemoryChecklistTemplateRepository();

export function getChecklistTemplateRepository(): ChecklistTemplateRepository {
  if (cachedRepository) {
    return cachedRepository;
  }

  const client = getSupabaseAdminClient();
  if (client) {
    cachedRepository = new SupabaseChecklistTemplateRepository(client);
    return cachedRepository;
  }

  cachedRepository = inMemoryRepository;
  return cachedRepository;
}

export function createInMemoryChecklistTemplateRepository() {
  return new InMemoryChecklistTemplateRepository();
}
