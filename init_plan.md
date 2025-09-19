# Initial Delivery Plan

## 1. Phase Roadmap
- Phase 0 – Foundation (W1-W2): PRD·IA·ERD·API·인프라 초안을 완성하고 이중언어 UI 토대를 마련한다. 주요 산출물 검토 후 DoD 체크리스트(`[ ] PRD 승인`, `[ ] IA 확정`, `[ ] 데이터 모델 승인`, `[ ] CI/CD 골조 배포`)를 주차 종료 전에 모두 완료한다.
  EN: Lock scope, IA, schema, and initial CI/CD during weeks 1-2, clearing the DoD checklist before week close.
- Phase 1 – Core MVP Build (W3-W5): 이메일 인증, 체크리스트 생성, Q&A, 가이드 승격, 검색 기능을 종단 간 연결하고 React Query 및 i18n 구성을 마무리한다. DoD는 `[ ] 인증 플로우`, `[ ] 체크리스트 생성`, `[ ] Q&A`, `[ ] 가이드 승격`, `[ ] 검색`, `[ ] 기본 테스트 통과`이다.
  EN: Deliver the onboarding-to-guide pipeline with KR/EN support and baseline tests across weeks 3-5.
- Phase 2 – Moderation & Ops (W6): 신고 처리, 모더레이션 대시보드, 스팸 ML 파이프라인을 구성하고 운영 SLA를 문서화한다. 체크리스트는 `[ ] 신고 흐름`, `[ ] T&S 대시보드`, `[ ] ML 분류`, `[ ] 운영 플레이북 업데이트`.
  EN: Harden trust & safety tooling and document operator flows in week 6.
- Phase 3 – Beta Launch (W7): 클로즈드→오픈 베타 전환, 지표 계측 세팅, 초기 콘텐츠 강화 및 피드백 루프를 구축한다. DoD는 `[ ] 베타 공지`, `[ ] 애널리틱스 대시보드`, `[ ] 시드 콘텐츠 검수`, `[ ] 피드백 수집 루프`.
  EN: Launch to the Berkeley cohort, instrument analytics, and reinforce content in week 7.

## 2. Development Tracks
- Product & Research: A–L 산출물을 관리하며 매주 deliverable checklist(`[ ] 요구사항`, `[ ] IA`, `[ ] 데이터 모델`, `[ ] 정책`, `[ ] 릴리스 범위`)를 점검한다.
  EN: Keep the deliverables on track with weekly checklist sign-offs.
- Engineering (FE/BE): `/apps/web`, `/packages/ui`, `/packages/config`, `/infra` 구조로 병렬 개발하며 Jest/Playwright를 통한 자동화 테스트를 누적시킨다.
  EN: Parallelize frontend, shared UI, and infra setup while scaling automated tests.
- Data & AI: Meilisearch 인덱스, 임베딩 배치 잡, 샘플 마이그레이션을 준비해 기능 통합 전 선행한다.
  EN: Prepare search and embedding pipelines before feature wiring.
- QA & Ops: 80% 커버리지 목표, 스테이징 스모크 테스트, 모더레이션 SLA 정비.
  EN: Enforce coverage goals, staging smoke runs, and operations readiness.

## 3. Assumptions & Open Issues
- Assumptions: Next.js 웹 MVP 우선, 팀 구성 4인(PO/FE/BE/AI Ops), 베타 대상은 Cal 교환·유학생 커뮤니티, Free/Dev 티어 리소스 사용 가능.
  EN: Assume a web-first Next.js MVP with a four-member team targeting Berkeley exchange students on free-tier infra.
- Open Issues: 이메일 도메인 화이트리스트 운영 주체 확정, 스팸 ML 임계치 데이터 확보, 베타 사용자 모집 채널 및 운영 리소스 조율.
  EN: Need decisions on domain whitelist management, ML threshold data, and beta recruitment channels.
