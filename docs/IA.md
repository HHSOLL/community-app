# B. IA & 네비게이션 맵

## 0. Summary (EN)
Defines the page architecture for checklist-first navigation, mapping components and states so UX and engineering align on App Router routes. Home prioritizes onboarding tasks, while dedicated surfaces handle Q&A, guides, search, and moderation utilities. Textual state diagrams describe key transitions for rapid implementation before visual wireframes.

## 1. 상위 구조
1.1 `/ko` (기본) / `/en` 로케일 세그먼트.  
1.2 주요 탭: 홈(체크리스트 허브), 질문, 가이드, 검색, 내 정보, 운영 대시보드(역할 기반).  
1.3 상단 글로벌 네비: `체크리스트 | 질문 | 가이드 | 검색 | 운영(운영자)` + 언어 스위처.

## 2. 페이지별 컴포넌트
2.1 홈 `/[locale]`: Progress Header, Checklist Board, Q&A Spotlight, Guide Spotlight, Moderation Digest.  
2.2 질문 `/[locale]/questions`: Filter Bar(카테고리/학기/태그/신뢰도), Question List, Ask Form Drawer, Adoption Badge.  
2.3 가이드 `/[locale]/guides`: Guide Library Grid, Version Tag, Last Verified Indicator, Promote Queue.  
2.4 검색 `/[locale]/search`: Universal Search Bar, Facet Panel, Result List(questions/guides/checklist).  
2.5 내 정보 `/[locale]/me`: Profile Card, Checklist Summary, Reputation Timeline, Notification Preferences.  
2.6 운영 `/[locale]/ops`: Report Queue Table, Guide Expiry Alerts, Cohort Metrics Snapshot.

## 3. 상태 다이어그램 (텍스트)
3.1 체크리스트: `Draft -> Generated -> In Progress -> Completed`; 중간 상태에서 각 항목 `Pending -> Doing -> Done`.  
3.2 질문: `New -> Answered -> Accepted -> Archived`; 신고 시 `New -> Flagged -> Resolved/Removed`.  
3.3 가이드: `Candidate(채택 Q&A) -> Draft -> Review -> Published -> Refresh Due`.  
3.4 신고: `Submitted -> Triaged(ML) -> Assigned -> Actioned -> Closed`.  
3.5 인증: `Invite -> Email Sent -> Token Verified -> Profile Completed`.

## 4. 라우트 계약
4.1 Next.js App Router 사용, `app/[locale]/(shell)/...` 패턴으로 탭별 레이아웃.  
4.2 보호 라우트: 질문/가이드 작성, 운영 대시보드는 server actions로 권한 체크.  
4.3 Static params로 로케일 빌드, dynamic segment `questions/[id]`, `guides/[id]`, `checklist/[id]`.

## 5. 체크리스트
- [ ] 각 탭별 핵심 컴포넌트 정의 승인
- [ ] 상태 전이 검토 후 UX 스토리보드 작성
- [ ] 라우트 보호 정책 백엔드와 합의
- [ ] 언어 스위처 상호작용 설계 검수
- [ ] 운영 대시보드 진입 조건 명시

## 6. Assumptions
- 홈 화면은 체크리스트 완료율을 핵심 KPI로 삼아 항상 최상단에 표시.  
- 운영 대시보드는 role=admin 계정만 접근.  
- 모바일 대응은 responsive-first로 처리, 별도 앱 전환 시 UI kit 재활용.

## 7. Open Issues
- 운영 대시보드 위치(별도 서브도메인 vs 네비게이션 내) 최종 결정.  
- 질문 상세 내 실시간 코멘트 필요 여부.  
- Facet 조합 제한(가이드 vs 질문) 정책 확정.
