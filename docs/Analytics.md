# H. 애널리틱스 & 메트릭 계획

## 0. Summary (EN)
Details product health metrics, instrumentation events, and dashboards required for beta and launch. Aligns KPIs with data sources (PostHog, Supabase, Sentry) and specifies cohort slicing. Provides checklists to ensure alerts and governance are set before beta.

## 1. 핵심 지표
1.1 Activation: 체크리스트 생성률, 첫 번째 항목 완료 시간.  
1.2 Engagement: 질문 작성수, 답변 채택률, 가이드 열람수.  
1.3 Retention: D7/D30 체크리스트 재방문, Q&A 팔로업, 가이드 업데이트.  
1.4 Quality: 신고 처리 속도, 가이드 최신성, 유사 질문 제안 클릭률.

## 2. 이벤트 스키마
```
track('checklist_created', { template_id, locale, stay_length })
track('checklist_item_status_changed', { item_id, from, to })
track('question_posted', { tags, term, locale })
track('answer_adopted', { question_id, answer_id })
track('guide_viewed', { guide_id, locale })
track('report_submitted', { target_type, severity })
```

## 3. 도구 & 배포
3.1 PostHog Cloud Free: client SDK + server capture.  
3.2 Supabase analytics for SQL cohorts.  
3.3 Sentry for 에러, Slack alert Webhook.  
3.4 dbt or Lightdash optional, MVP는 SQL notebook으로 대체.

## 4. 대시보드 구성
4.1 Executive: KPI 요약(주간 업데이트).  
4.2 Ops: 신고 SLA, 가이드 만료, 큐 길이.  
4.3 Product: funnel (온보딩 → 체크리스트 완료 → 질문 참여).  
4.4 Experiment: 유사 질문 추천 클릭률 AB 테스트.

## 5. 데이터 거버넌스
5.1 PII 최소화, email 해시 후 저장.  
5.2 사용자 삭제 요청 시 이벤트도 soft delete.  
5.3 데이터 접근 권한: Ops/PM만 dashboard 접근.

## 6. 체크리스트
- [ ] PostHog 프로젝트 생성 및 API 키 공유
- [ ] 이벤트 스키마를 코드와 동기화
- [ ] Slack 에러/지표 알림 설정
- [ ] KPI 대시보드 초안 제작
- [ ] 삭제권 프로세스 문서화

## 7. Assumptions
- PostHog Free tier로 월 1M 이벤트 처리 가능.  
- Ops 대시보드는 Supabase SQL view + Metabase 무료 버전 사용.  
- 개인정보는 US 리전에 저장.

## 8. Open Issues
- Guide 뷰 수집 방식(서버 로그 vs 클라이언트 이벤트) 결정.  
- Cohort 기준(체류기간 vs 입국월) 정교화.  
- 실험 플랫폼 선택(PostHog Experiments vs 자체 구현).
