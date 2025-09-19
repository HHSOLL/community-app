# J. 프로젝트 계획표

## 0. Summary (EN)
Schedules workstreams week-by-week with deliverables, owners, and definitions of done. Focuses on shipping MVP rapidly: Phase 0 docs, Phase 1 core features, Phase 2 moderation, Phase 3 beta launch. This plan guides daily standups and review gates.

## 1. 타임라인
### W1–W2 (Phase 0: Foundation)
- 활동: 요구사항/IA/ERD/API/Infra 문서 완성, 디자인 토큰, i18n 구조 확정.  
- DoD: `[ ] PRD 승인`, `[ ] IA 맵 합의`, `[ ] 데이터 모델 리뷰`, `[ ] CI/CD 스켈레톤 실행`, `[ ] i18n 키맵 공유`.

### W3–W5 (Phase 1: Core MVP Build)
- 활동: 인증, 체크리스트, Q&A, 가이드 승격, 검색 MVP, UI kit 확장.  
- DoD: `[ ] 이메일 인증 플로우`, `[ ] 체크리스트 CRUD`, `[ ] Q&A 채택 흐름`, `[ ] Guide 승격`, `[ ] 검색 연동`, `[ ] E2E 스모크`.  
- 마일스톤 리뷰(W5): 데모 + 사용자 테스트 5명.

### W6 (Phase 2: Moderation & Ops)
- 활동: 신고 파이프라인, 모더레이션 대시보드, ML 필터, 운영 매뉴얼.  
- DoD: `[ ] 신고 큐`, `[ ] 모더레이션 SLA 모니터`, `[ ] ML threshold 검증`, `[ ] 운영 플레이북 배포`.

### W7 (Phase 3: Beta Launch)
- 활동: 클로즈드 베타(30명) → 공개 베타, 애널리틱스 대시보드, 콘텐츠 보강.  
- DoD: `[ ] 베타 공지 발송`, `[ ] PostHog 대시보드`, `[ ] 시드 콘텐츠 검수`, `[ ] 피드백 루프 가동`.

## 2. 역할 분배 (예시)
- PM/AI 엔지니어: 문서화, AI 파이프라인, 실험.  
- FE 엔지니어: Next.js, UI kit, i18n.  
- BE 엔지니어: API, DB, Auth, Queue.  
- Ops/Designer: 콘텐츠, 모더레이션, 릴리스 자산.

## 3. 커뮤니케이션
3.1 주간 스프린트 킥오프(월), 데모 & 레트로(금).  
3.2 Slack 채널: `#build`, `#ops`, `#beta`.  
3.3 문서: Notion 또는 docs/ 폴더와 동기화.

## 4. 체크리스트
- [ ] 스프린트 일정 캘린더 등록
- [ ] 오너별 DoD 명시
- [ ] 베타 모집 리스트 작성
- [ ] 피드백 수집 폼 배포
- [ ] 위기 대응 연락망 작성

## 5. Assumptions
- 주 5일 20시간 이상 투입 가능.  
- UC Berkeley 학사 일정과 큰 충돌 없음(시즌 중간고사 제외).  
- 베타 참가자는 Kakao/Discord 커뮤니티에서 모집 가능.

## 6. Open Issues
- 베타 사용자 보상(굿즈 vs 기프티콘) 결정.  
- QA 리소스(외부) 추가 필요 여부.  
- 주간 회의 시간대(UTC-8 vs KST) 조율.
