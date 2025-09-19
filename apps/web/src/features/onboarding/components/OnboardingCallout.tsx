'use client';

import { Button, Card } from '@community-app/ui';
import { useTranslation } from 'react-i18next';

export function OnboardingCallout() {
  const { t } = useTranslation();
  return (
    <Card
      title={t('hero.title')}
      description={t('hero.subtitle')}
      actions={<Button>{t('checklist.primaryCta')}</Button>}
    >
      <ul className="list-disc space-y-1 pl-4 text-slate-600">
        <li>학교 이메일 화이트리스트 인증</li>
        <li>학기·체류기간에 따른 자동 체크리스트</li>
        <li>Q&A, 가이드, 검색을 한 곳에서 이용</li>
      </ul>
    </Card>
  );
}
