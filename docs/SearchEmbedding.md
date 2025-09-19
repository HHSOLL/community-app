# E. 검색 & 임베딩 파이프라인

## 0. Summary (EN)
Describes Meilisearch schemas, tokenizer options for KR/EN, and the job flow for generating embeddings to suggest similar questions. Jobs leverage Upstash/QStash with batched syncs and fallback to manual triggers. Thresholds guard relevance before proposing duplicates.

## 1. Meilisearch 인덱스 설계
1.1 인덱스 `questions`: primary_key=`id`, searchable=[`title`,`body`,`tags`], filterable=[`term`,`tags`,`trust_score`,`locale`].  
1.2 인덱스 `guides`: searchable=[`topic`,`summary`,`body`], filterable=[`school_id`,`term`,`updated_at`].  
1.3 인덱스 `checklists`: searchable=[`title`,`notes`], filterable=[`user_id`,`status`]; 주로 개인용 검색.

## 2. 언어 처리
2.1 Tokenizer: Meilisearch `deunicode=true`, `min_word_size_for_typo=4`, `min_word_size_for_two_typos=8`.  
2.2 KR 전처리: open-source tokenizer(`mecab-ko` 사전)로 bigram 생성 후 인덱싱.  
2.3 EN은 기본 tokenizer 사용, stop-words 리스트 커스터마이즈(academic terms 유지).

## 3. 동기화 플로우
3.1 트리거: Postgres `INSERT/UPDATE` 이벤트 → Supabase Function → QStash 큐 메시지.  
3.2 Worker: Next.js Route Handler `/api/search/reindex` 수신 → fetch record → upsert to Meilisearch.  
3.3 삭제: soft delete 플래그 감지 시 Meilisearch 문서 제거.

## 4. 임베딩 파이프라인
4.1 모델: Instructor-large(오픈소스) 혹은 Voyage-lite (비용 고려) → self-hosted inference.  
4.2 작업 큐: Upstash Redis 스트림 `embedding:queue`.  
4.3 배치 주기: 신규 질문/가이드 생성 후 1분 내 트리거, 백필 job은 6시간마다.  
4.4 저장: Postgres `question_embeddings(question_id uuid, vector vector(768), updated_at)` with pgvector.  
4.5 추천 임계치: cosine similarity ≥ 0.78 시 유사 질문 추천.  
4.6 실패 재시도: 최대 3회, 이후 운영 Slack 알림.

## 5. 운영 도구
5.1 대시보드: 최근 24시간 색인건수, 큐 길이, embedding 실패율.  
5.2 긴급 모드: `/ops/search/pause` 토글로 색인 중단.  
5.3 로깅: Cloudflare Workers 혹은 Supabase Edge Function에서 request log 저장.

## 6. 체크리스트
- [ ] Meilisearch KR tokenizer 성능 검증
- [ ] pgvector 확장 설치 여부 확인
- [ ] Embedding 모델 지연 시간 측정 (p95 < 1.5s)
- [ ] 큐 재시도 정책 모니터링 알림 연결
- [ ] 백필 job cron 스케줄 등록

## 7. Assumptions
- Meilisearch SaaS free tier로 100k documents 처리 가능.  
- pgvector 확장은 Neon Developer tier에서 사용 가능.  
- Embedding inference는 Fly.io 256MB 인스턴스로 운영.

## 8. Open Issues
- 멀티 언어 결과 랭킹 시 한국어 우선 정렬 vs 사용자 언어 우선 규칙.  
- Embedding 모델 업데이트 시 백필 전략.  
- 개인정보가 포함된 항목의 색인 필터링 정책.
