import { Card } from '@community-app/ui';
import { useTranslation } from 'react-i18next';

const sampleQuestions = [
  {
    title: 'BART 학생 할인 등록은 어떻게 하나요?',
    status: '채택 · 3시간 전',
    tags: ['교통', '행정']
  },
  {
    title: 'Berkeley International House 입주 절차가 궁금합니다.',
    status: '답변 2 · 1일 전',
    tags: ['주거', '체크리스트']
  }
];

export function QaPreview() {
  const { t } = useTranslation();
  return (
    <Card title={t('qa.title')} description={t('qa.description')}>
      <div className="space-y-4">
        {sampleQuestions.map((question) => (
          <article key={question.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900">{question.title}</h4>
              <span className="text-xs text-slate-500">{question.status}</span>
            </header>
            <div className="mt-3 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
