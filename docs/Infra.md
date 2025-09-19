# I. 인프라 & 비용 계획

## 0. Summary (EN)
Outlines deployment stack spanning Vercel, Neon/Supabase, Upstash, and Meilisearch with expected monthly costs under $30. Provides scaling path, CI/CD workflow, and environment configuration template references. Emphasizes free-tier usage and minimal ops overhead.

## 1. 호스팅 & 서비스
1.1 Frontend/Edge: Vercel Hobby (무료) — Next.js App Router + Preview deployments.  
1.2 DB: Neon Postgres (Free) or Supabase (Free) with pgvector.  
1.3 Auth: Magic Link 자체 구현 + Resend(Email) Free tier 3k emails/월.  
1.4 Search: Meilisearch Cloud Starter (~$15, 초기에는 Docker on Fly.io 무료).  
1.5 Cache/Queue: Upstash Redis Free (1GB, 10k req/day).  
1.6 Storage: Supabase Storage Free (1GB).  
1.7 Monitoring: Sentry Free, PostHog Free.

## 2. 비용 추정 (월)
- Vercel: $0 (Hobby)
- Neon: $0 (Free up to 3 projects)
- Upstash Redis: $0
- Resend Email: $0 (3k emails)
- Meilisearch: $15 (필요 시) / Fly.io 무료 대안
- Sentry/PostHog: $0
합계 ≈ $15 (Meilisearch 유료 사용 시), 무료 셀프호스트 시 $0 근접.

## 3. CI/CD 파이프라인
3.1 GitHub Actions: `lint`, `test`, `build` on PR.  
3.2 Vercel integration for preview.  
3.3 Deploy branch `main` → Production.  
3.4 Secrets: GitHub Encrypted Secrets (`DATABASE_URL`, `RESEND_API_KEY`, `UPSTASH_REDIS_URL`, `MEILISEARCH_KEY`).

## 4. 환경 변수 템플릿
4.1 `.env.example` 유지, `EMAIL_DOMAIN_WHITELIST`, `MAGIC_LINK_SECRET`, `DATABASE_URL`, `SEARCH_URL`, `POSTHOG_API_KEY`, `SENTRY_DSN`.  
4.2 Staging 별도 `.env.staging` GitHub Actions + Vercel 환경에서 관리.

## 5. 업스케일 경로
5.1 DB: Neon → Supabase Pro 또는 RDS.  
5.2 Search: Meilisearch managed plan 업그레이드 또는 Algolia.  
5.3 Queue: Upstash → AWS SQS.  
5.4 Infra as Code: Terraform 모듈 infra/terraform에 추가.

## 6. 체크리스트
- [ ] 서비스별 Free tier 한도 문서화 완료
- [ ] GitHub Secrets 및 Vercel 환경변수 등록
- [ ] CI/CD 워크플로우 YAML 작성
- [ ] 백업/복구 계획 정리
- [ ] 비용 모니터링 대시보드 설정

## 7. Assumptions
- 월간 활성 사용자 500명 기준 Free tier로 충분.  
- 이메일 전송량 2,000건 이하.  
- 개발/운영 인력 4인이 GitHub Actions 관리 가능.

## 8. Open Issues
- 셀프호스팅 Meilisearch vs Managed 최종 선택.  
- pgvector가 Neon 무료 플랜에서 가능한지 확인 필요.  
- 백업 데이터 암호화 전략.
