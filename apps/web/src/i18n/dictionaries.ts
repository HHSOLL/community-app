import type { Locale } from '@/lib/i18n/locales';

const dictionaries = {
  ko: () =>
    Promise.resolve({
      hero: {
        title: 'Cal 교환·유학생을 위한 정착 허브',
        subtitle: '체크리스트, Q&A, 가이드를 한 곳에서 관리합니다.'
      },
      checklist: {
        title: '체크리스트 생성기',
        description: '학기, 체류기간에 따라 자동 생성된 체크리스트로 할 일을 빠르게 정리하세요.',
        primaryCta: '체크리스트 시작'
      },
      qa: {
        title: 'Q&A 포럼',
        description: '비익명 기반의 신뢰도 시스템으로 가장 신뢰할 수 있는 답변을 찾을 수 있습니다.'
      },
      guide: {
        title: '가이드 라이브러리',
        description: '채택된 답변을 구조화된 가이드로 승격해 최신 정보를 유지합니다.'
      },
      moderation: {
        title: '모더레이션 & T&S',
        description: '신고, 금칙어 필터, ML 분류를 통해 안전한 커뮤니티를 유지합니다.'
      },
      actions: {
        viewRoadmap: '로드맵 보기'
      }
    }),
  en: () =>
    Promise.resolve({
      hero: {
        title: 'A launchpad for Cal exchange & visiting students',
        subtitle: 'Centralize your checklist, Q&A, and guides in one trusted workspace.'
      },
      checklist: {
        title: 'Checklist generator',
        description: 'Auto-build onboarding tasks by term and stay length so nothing slips through.',
        primaryCta: 'Start checklist'
      },
      qa: {
        title: 'Q&A forum',
        description: 'Find verified answers with identity-backed trust scores and adoption signals.'
      },
      guide: {
        title: 'Guide library',
        description: 'Promote adopted answers into curated guides to keep knowledge evergreen.'
      },
      moderation: {
        title: 'Moderation & T&S',
        description: 'Escalate reports with keyword filters and ML pre-sorting to protect the community.'
      },
      actions: {
        viewRoadmap: 'View roadmap'
      }
    })
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
