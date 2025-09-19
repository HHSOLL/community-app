export type ChecklistItem = {
  title: string;
  description: string;
  category: string;
};

export type GeneratedChecklist = {
  items: ChecklistItem[];
};

export class ChecklistService {
  async generateInitialChecklist(params: { term: string; stayLength: number; locale: string }) {
    // TODO: replace with template-driven generation backed by checklist_templates table.
    const baseItems: ChecklistItem[] = [
      {
        title: '통신 개통 준비',
        description: `${params.term} 학기 기준 추천 통신사 비교`,
        category: '통신'
      },
      {
        title: '은행 계좌 개설',
        description: '필요 서류 확인 및 예약',
        category: '은행'
      },
      {
        title: 'Cal 1 Card 발급',
        description: '사진 업로드 및 수령 일정 확인',
        category: '학생증'
      }
    ];

    return {
      items: baseItems
    } satisfies GeneratedChecklist;
  }
}

let cachedService: ChecklistService | null = null;

export function getChecklistService() {
  if (!cachedService) {
    cachedService = new ChecklistService();
  }
  return cachedService;
}
