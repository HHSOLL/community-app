import { Card } from '@community-app/ui';
import { useTranslation } from 'react-i18next';

const guideEntries = [
  {
    title: '은행 계좌 개설 가이드 (2025 봄 기준)',
    summary: '채택된 Q&A를 바탕으로 계좌 종류, 예약 방법, 서류 준비까지 정리했습니다.'
  },
  {
    title: '수강 정정(Adjustment) 생존 가이드',
    summary: 'Phase 1~3 일정, 대기열 팁, 인기 과목 확보 전략을 다룹니다.'
  }
];

export function GuidePreview() {
  const { t } = useTranslation();
  return (
    <Card title={t('guide.title')} description={t('guide.description')}>
      <ul className="space-y-4">
        {guideEntries.map((guide) => (
          <li key={guide.title} className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-900">{guide.title}</p>
            <p className="mt-1 text-sm text-slate-600">{guide.summary}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
