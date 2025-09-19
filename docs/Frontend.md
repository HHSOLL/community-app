# F. 프런트엔드 설계 & 컴포넌트 계약

## 0. Summary (EN)
Specifies Next.js routing, state management, i18n keys, and UI component contracts to align frontend workstreams. Textual wireframes highlight layout blocks, while validation/loading conventions ensure consistent UX. Shared UI kit guarantees reuse when porting to React Native later.

## 1. 라우팅 전략
1.1 App Router 기반, `app/[locale]/(dashboard)/...` 영역에 보호된 페이지 구성.  
1.2 Public routes: `/[locale]`, `/[locale]/guides`, `/[locale]/questions`.  
1.3 Protected routes: `/[locale]/questions/new`, `/[locale]/me`, `/[locale]/ops`.  
1.4 Server components 기본, 폼/인터랙션은 client components + `use server` actions.

## 2. 상태관리
2.1 React Query(SWR 대체)로 서버 상태 관리, optimistic update(체크리스트 항목).  
2.2 Global store: Zustand `useSessionStore`로 언어, 사용자 프로필 캐시.  
2.3 Toast/알림: Headless UI + zustand slice.  
2.4 에러 핸들링: Error boundaries per route + Sentry instrumentation.

## 3. i18n 키 구조
3.1 `src/i18n/locales/{ko,en}.json` → namespace `common`, `checklist`, `questions`, `guides`, `moderation`, `onboarding`.  
3.2 Key naming: `section.component.state` 예) `checklist.generator.cta`.  
3.3 Server components는 `next-intl` loader, client는 react-i18next hook 사용.

## 4. UI 컴포넌트 계약
4.1 `Button`: props `{ variant: 'primary'|'secondary'|'ghost', size: 'sm'|'md', isLoading }`.  
4.2 `Card`: props `{ title, description, actions, children }` ensure section wrappers.  
4.3 `ProgressBar`: checklist completion, props `{ value, label, intent }`.  
4.4 `QuestionListItem`: displays status badges; props `{ title, status, tags[], onSelect }`.  
4.5 Form components use `react-hook-form` + Zod resolver, validation errors map to Korean/English messages.

## 5. 와이어프레임 설명
5.1 홈: Hero(체크리스트 CTA) + 두열 그리드(체크리스트/질문) + 하단 가이드 카드.  
5.2 질문 리스트: 좌측 facet, 우측 리스트, 상단 검색, floating “Ask” 버튼.  
5.3 가이드 상세: Breadcrumb, 제목/버전, key takeaways, accordion steps, related Q&A.  
5.4 운영 대시보드: 탭(신고, 가이드 만료, 지표), 테이블 + mini charts.

## 6. 폼 검증 & 상태
6.1 모든 제출 버튼은 `disabled` + spinner.  
6.2 에러 메시지는 상단 alert + 필드 하단 미니 텍스트.  
6.3 로딩 skeleton: checklist cards 3개, guide list 2개, question item skeleton.  
6.4 Empty state: 일관된 illustration + CTA (예: “첫 체크리스트를 생성하세요”).

## 7. 체크리스트
- [ ] React Query/Zustand 구조 다이어그램 확정
- [ ] i18n 키 네임스페이스 리뷰
- [ ] UI kit props TS 인터페이스 문서화
- [ ] Skeleton/Empty state 디자인 합의
- [ ] Form validation 메시지 번역 검수

## 8. Assumptions
- UI kit는 Tailwind 기반, 이후 RN 전환 시 design token 추출.  
- React Query devtools는 dev 환경에서만 로드.  
- next-intl + react-i18next 혼합 구성이 허용됨.

## 9. Open Issues
- 다국어 번역 파일 관리 워크플로우(POEditor vs Git) 선택.  
- Theme 다크모드 지원 여부.  
- 운영 탭 접근 UX(탭 숨김 vs 별도 경고 모달) 결정.
