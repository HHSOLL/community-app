# D. API 명세 초안

## 0. Summary (EN)
Provides REST-first endpoints with scopes for authentication, checklist generation, Q&A, guide promotion, moderation, and search. Each route notes auth requirements, payload schema, and validation rules, aligning with a future tRPC schema if needed. Email whitelist enforcement and role-based access are embedded.

## 1. 인증 & 사용자
1.1 `POST /api/auth/magic-link/request` — body `{ email }`; validate domain(`@berkeley.edu` 등), rate-limit 5/min.  
1.2 `POST /api/auth/magic-link/verify` — body `{ token }`; on success issue JWT(session) + mark `users.verified=true`.  
1.3 `GET /api/me` — auth required; returns profile, roles, checklist summary.  
1.4 `PATCH /api/me` — update languages, notification preferences; validate array length ≤3.

## 2. 체크리스트
2.1 `POST /api/checklists` — body `{ term, stay_length, locale }`; generates checklist items from template, returns list.  
2.2 `GET /api/checklists/:id` — owner access; includes progress metrics.  
2.3 `PATCH /api/checklists/:id/items/:itemId` — update status (`pending|doing|done`), optional notes.  
2.4 `POST /api/checklists/:id/items` — append custom item with manual metadata.

## 3. Q&A
3.1 `GET /api/questions` — query `page, tags[], term, sort`. Supports search service fallback.  
3.2 `POST /api/questions` — body `{ title, body, term, tags[] }`; runs similarity check before create.  
3.3 `POST /api/questions/:id/answers` — requires verified user.  
3.4 `PATCH /api/questions/:id/accept` — only question owner; sets accepted answer id.  
3.5 `POST /api/questions/:id/report` — body `{ reason }`, pushes to moderation queue.

## 4. Guides
4.1 `POST /api/guides/promote` — admin only; body `{ questionId, summary, body, sources[], version }`.  
4.2 `GET /api/guides` — filter by `topic`, `term`, `verifiedBefore`.  
4.3 `PATCH /api/guides/:id` — admin; updates body, version, last_verified_at.  
4.4 `GET /api/guides/:id/history` — returns audit trail for transparency.

## 5. 검색 & 임베딩
5.1 `GET /api/search` — proxy to Meilisearch; query `q`, facets `type, term, tags`.  
5.2 `POST /api/search/reindex` — admin; triggers background job to sync Postgres ↔ Meilisearch.  
5.3 `POST /api/embeddings/questions/:id` — background worker; generates embedding via open-source model, stores vector for similarity.

## 6. 모더레이션
6.1 `GET /api/reports` — admin; query `status`.  
6.2 `PATCH /api/reports/:id` — admin; body `{ action, notes }`, updates status & audit event.  
6.3 `POST /api/moderation/keyword-scan` — internal job; scans new content for banned terms.

## 7. 검증 및 권한
7.1 모든 요청은 Next.js Route Handlers + middleware로 JWT 검증.  
7.2 역할: `member`, `moderator`, `admin`. 운영 API는 `moderator` 이상만.  
7.3 rate limit: 인증 API 5/min/IP, 질문 생성 10/day/user, 보고 20/day/user.  
7.4 입력 검증: Zod 스키마 정의, 에러는 `400 { code, message, field }` 형태.

## 8. 체크리스트
- [ ] Magic Link 토큰 만료시간(10분) 확인
- [ ] Checklist 생성 파라미터 밸리데이션 테스트 작성
- [ ] Search proxy 인증키 저장 위치 결정
- [ ] Guide promotion 워크플로우 승인 로깅 구현
- [ ] Moderation API SLA 모니터링 구성

## 9. Assumptions
- 클라이언트와 서버 간 JWT 쿠키 기반 세션 유지.  
- Admin UI는 same-origin server actions 호출.  
- Embedding 생성은 서버리스 cron(Upstash/QStash) 활용 가능.

## 10. Open Issues
- Magic Link provider (Supabase Auth vs 자체 구현) 최종 결정.  
- Q&A 자동 유사 질문 임계치(코사인 점수) 튜닝 필요.  
- Search 재색인 빈도(실시간 vs 배치) 결정.
