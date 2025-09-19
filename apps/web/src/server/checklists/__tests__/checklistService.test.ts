import { ChecklistService } from '../checklistService';

describe('ChecklistService', () => {
  it('returns stub checklist items', async () => {
    const service = new ChecklistService();
    const result = await service.generateInitialChecklist({ term: '2025-spring', stayLength: 6, locale: 'ko' });
    expect(result.items).toHaveLength(3);
  });
});
