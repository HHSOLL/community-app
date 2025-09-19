import { ChecklistService } from '../checklistService';
import { createInMemoryUserChecklistRepository } from '../userChecklistRepository';
import { createInMemoryChecklistTemplateRepository } from '../checklistTemplateRepository';

describe('ChecklistService', () => {
  it('returns stub checklist items', async () => {
    const service = new ChecklistService(
      createInMemoryChecklistTemplateRepository(),
      createInMemoryUserChecklistRepository()
    );
    const result = await service.generateInitialChecklist('student@berkeley.edu', {
      term: '2025-spring',
      stayLength: 6,
      locale: 'ko'
    });
    expect(result.items).toHaveLength(3);
  });
});
