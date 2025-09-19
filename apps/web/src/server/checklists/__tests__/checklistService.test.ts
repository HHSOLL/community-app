import { ChecklistService } from '../checklistService';
import { createInMemoryUserChecklistRepository } from '../userChecklistRepository';
import { createInMemoryChecklistTemplateRepository } from '../checklistTemplateRepository';

describe('ChecklistService', () => {
  it('generates checklist items and updates status', async () => {
    const userRepo = createInMemoryUserChecklistRepository();
    const service = new ChecklistService(createInMemoryChecklistTemplateRepository(), userRepo);
    const result = await service.generateInitialChecklist('student@berkeley.edu', {
      term: '2025-spring',
      stayLength: 6,
      locale: 'ko'
    });
    expect(result.items).toHaveLength(3);

    const firstItem = result.items[0];
    const updated = await service.updateItemStatus('student@berkeley.edu', firstItem.id, 'done');
    expect(updated).toBe(true);
    const stored = await service.getChecklist('student@berkeley.edu');
    expect(stored.items[0].status).toBe('done');
  });
});
