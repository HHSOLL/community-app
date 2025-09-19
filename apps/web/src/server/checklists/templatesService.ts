import { getChecklistTemplateRepository } from '@/server/checklists/checklistTemplateRepository';

const repo = getChecklistTemplateRepository();

export async function listTemplates(args: { term: string; stayLength: number; locale: string }) {
  return repo.getTemplate(args);
}

export async function upsertTemplate(args: {
  term: string;
  stayLength: number;
  locale: string;
  items: Array<{ title: string; description: string; category: string; position?: number }>;
}) {
  await repo.upsertTemplate({ term: args.term, stayLength: args.stayLength, locale: args.locale }, args.items);
}
