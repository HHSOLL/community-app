'use client';

import { Card } from '@community-app/ui';
import { useTranslation } from 'react-i18next';

const checklistItems = [
  {
    title: '통신 개통',
    detail: 'eSIM 또는 선불 요금제 가이드, 추천 통신사 비교'
  },
  {
    title: '은행 계좌 개설',
    detail: '필요 서류, 예약 팁, 수수료 비교'
  },
  {
    title: '학생증 발급',
    detail: 'Cal 1 Card 절차, 사전 준비물, 수령 팁'
  }
];

export function ChecklistPreview() {
  const { t } = useTranslation();
  return (
    <Card title={t('checklist.title')} description={t('checklist.description')}>
      <ol className="space-y-3">
        {checklistItems.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
              ✓
            </span>
            <div>
              <p className="font-medium text-slate-800">{item.title}</p>
              <p className="text-sm text-slate-600">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
