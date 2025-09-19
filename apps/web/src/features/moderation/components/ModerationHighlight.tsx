'use client';

import { Card } from '@community-app/ui';
import { useTranslation } from 'react-i18next';

const moderationPillars = [
  {
    title: '신고 큐',
    detail: '사용자 신고가 자동으로 운영 대시보드에 누적되어 SLA 내 처리합니다.'
  },
  {
    title: '금칙어 & 스팸 필터',
    detail: '다국어 키워드 필터와 ML 분류로 위험 콘텐츠를 사전 차단합니다.'
  },
  {
    title: '휴먼 리뷰',
    detail: '운영팀이 가이드라인 위반 여부를 최종 판단하고 조치를 기록합니다.'
  }
];

export function ModerationHighlight() {
  const { t } = useTranslation();
  return (
    <Card title={t('moderation.title')} description={t('moderation.description')}>
      <div className="grid gap-3 md:grid-cols-3">
        {moderationPillars.map((pillar) => (
          <div key={pillar.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{pillar.title}</p>
            <p className="mt-1 text-xs text-slate-600">{pillar.detail}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
