# Documentation Index

## Summary (EN)
Central directory for MVP deliverables spanning PRD, IA, ERD, API specs, search pipeline, frontend contracts, moderation handbook, analytics, infra plans, project schedule, seed content, and risk register. Each document provides Korean primary guidance with English summaries.

## Deliverables
1. `PRD.md` – 제품 요구사항 및 KPI.
2. `IA.md` – 정보 구조와 네비게이션 맵.
3. `DataModel.md` – ERD 및 마이그레이션 초안.
4. `API.md` – REST/tRPC 라우트 명세.
5. `SearchEmbedding.md` – 검색·임베딩 파이프라인.
6. `Frontend.md` – Next.js 설계와 UI 계약.
7. `Moderation.md` – 정책 및 운영 플레이북.
8. `Analytics.md` – 메트릭/관측 계획.
9. `Infra.md` – 인프라 & 비용 전략.
10. `ProjectPlan.md` – 주차별 개발 계획표.
11. `SeedContent.md` – 시드 체크리스트/콘텐츠 패키지.
12. `RiskMitigation.md` – 리스크 및 대응 전략.

### 운영 관리 메모
- `infra/sql/seed_checklist_templates.sql`을 실행해 학기/언어별 템플릿을 시드할 수 있으며, 이후 `/api/admin/templates`로 수정 가능합니다 (환경 변수 `ADMIN_EMAILS`에 등록된 계정만 허용).

각 문서에는 검수 체크리스트와 Assumptions/Open Issues가 포함되어 있으며, 지속적으로 업데이트된다.
