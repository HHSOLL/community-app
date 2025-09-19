import {
  getChecklistTemplateRepository,
  createInMemoryChecklistTemplateRepository,
  type ChecklistTemplateRepository
} from '@/server/checklists/checklistTemplateRepository';
import {
  createInMemoryUserChecklistRepository,
  getUserChecklistRepository,
  type StoredChecklistItem,
  type UserChecklistRepository
} from '@/server/checklists/userChecklistRepository';
import { randomUUID } from 'crypto';

export type ChecklistItem = StoredChecklistItem;

export class ChecklistService {
  constructor(
    private readonly templateRepository: ChecklistTemplateRepository,
    private readonly userChecklistRepository: UserChecklistRepository
  ) {}

  async generateInitialChecklist(email: string, params: { term: string; stayLength: number; locale: string }) {
    const template = await this.templateRepository.getTemplate(params);

    const items: StoredChecklistItem[] = (template?.items ?? []).map((item, index) => ({
      id: randomUUID(),
      title: item.title,
      description: item.description,
      category: item.category,
      status: 'pending',
      position: item.position ?? index
    }));

    if (items.length === 0) {
      const fallback: StoredChecklistItem[] = [
        {
          id: randomUUID(),
          title: '통신 개통 준비',
          description: '추천 통신사 비교 및 요금제 선택',
          category: '통신',
          status: 'pending',
          position: 0
        },
        {
          id: randomUUID(),
          title: '은행 계좌 개설',
          description: '필요 서류 준비 및 지점 예약',
          category: '은행',
          status: 'pending',
          position: 1
        },
        {
          id: randomUUID(),
          title: 'Cal 1 Card 발급',
          description: '사진 업로드 및 수령 일정 확인',
          category: '학생증',
          status: 'pending',
          position: 2
        }
      ];
      items.push(...fallback);
    }

    await this.userChecklistRepository.replaceChecklist(email, items);

    return { items };
  }

  async getChecklist(email: string) {
    const items = await this.userChecklistRepository.listChecklist(email);
    return { items };
  }
}

let cachedService: ChecklistService | null = null;

export function getChecklistService() {
  if (!cachedService) {
    cachedService = new ChecklistService(getChecklistTemplateRepository(), getUserChecklistRepository());
  }
  return cachedService;
}

export function createInMemoryChecklistService() {
  const templateRepository = createInMemoryChecklistTemplateRepository();
  const userChecklistRepository = createInMemoryUserChecklistRepository();
  return new ChecklistService(templateRepository, userChecklistRepository);
}
