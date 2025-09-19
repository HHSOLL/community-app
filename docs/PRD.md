# A. 제품 요구사항 문서 (PRD)

## 0. Summary (EN)
Deliver a web-first MVP that solves fragmented onboarding for UC Berkeley exchange students by providing automated checklists, trusted Q&A, and living guides. Success hinges on checklist completion, forum adoption, and guide freshness while keeping costs within free-tier infrastructure. This PRD frames personas, journeys, scope, non-functional targets, and trust policies so engineering can execute immediately. Release phasing targets a closed beta in week 6 and campus-wide pilot in week 7.

## 1. 문제 정의
1.1 교환·유학생은 통신/은행/주거 등 행정 처리 정보를 여러 커뮤니티에서 수작업으로 모아야 하며, 최신성 검증이 어렵다.  
1.2 Q&A 포럼은 검색 혹은 검증 기능이 부족해 중복 질문과 부정확한 답변이 쌓인다.  
1.3 정착 체크리스트가 개인별 상황(학기, 체류기간, 언어)에 맞춰 자동 구성되지 않아 반복 작성에 시간이 든다.

## 2. 목표 및 KPI
2.1 핵심 목표: 8주 내 Cal 대상 베타 출시 및 50명 정착 체커 활성화.  
2.2 KPI: W8 체크리스트 완료율 ≥ 65%, Q&A 답변 채택률 ≥ 40%, Guide 최신성(30일 내 검증) ≥ 80%, NPS ≥ 30.  
2.3 비용 KPI: 월간 인프라 비용 $30 이하, 운영 SLA 준수율 ≥ 90%.

## 3. 페르소나
3.1 신규 교환·유학생 (KR 기본, EN 병행): 출국 전~도착 후 30일, 행정/생활 정보가 절실.  
3.2 학생 단체 코디네이터: 공지, 가이드 승인, 신고 처리 담당.  
3.3 향후 확장 페르소나: 영어 사용자, 캠퍼스 기관 파트너.

## 4. 사용자 시나리오
4.1 온보딩: Berkeley 이메일 인증 → 학기/체류기간/언어 입력 → 초기 체크리스트 생성.  
4.2 체크리스트 수행: 각 항목에서 필요 서류, 예상 시간, 참고 링크 확인 후 완료 상태 업데이트.  
4.3 Q&A: 질문 등록 시 카테고리/태그/학기 지정, 유사 질문 추천 확인, 답변 채택으로 신뢰도 부여.  
4.4 Guide: 채택된 Q&A를 운영팀이 구조화하여 버전 관리, 만료 알림을 기반으로 주기 검수.  
4.5 모더레이션: 사용자 신고 → ML 분류 → 운영 대시보드에서 SLA 내 조치.

## 5. 기능 범위
5.1 MVP (필수): 인증, 체크리스트 생성/관리, Q&A CRUD, Guide 승격, 검색/필터, 신고 흐름, 운영 미니 대시보드.  
5.2 V1.1 (후속): 캠퍼스 마켓, 그룹/DM, 기관 대시보드, 콘텐츠 협업 툴.  
5.3 제외: 모바일 앱(React Native) 정식 릴리스, 결제, 광고.

## 6. 비기능 요구사항
6.1 성능: p95 API < 300ms, 초기 TTFB < 500ms, 이미지 최적화 Tailwind/Next Image 활용.  
6.2 가용성: Vercel + Neon/Supabase Free Tier, 주 1회 무중단 배포 파이프라인.  
6.3 보안: Magic Link 토큰 즉시 폐기, 데이터 암호화, 삭제권 UI 제공, 활동 로그 30일 보존.  
6.4 국제화: react-i18next + locale 미들웨어, 날짜·화폐 포맷 자동 변환.

## 7. 정책 & T&S
7.1 실명/학교 이메일 기반 계정, 기본 비익명(닉네임제).  
7.2 신고 대응 SLA: 긴급 6시간, 일반 24시간.  
7.3 금칙어/스팸 필터 도입, 반복 위반 시 경고 → 7일 정지 → 퇴출.  
7.4 출처 기재 의무 및 정보 만료 시 수동/자동 알림.

## 8. 관측 및 측정
8.1 이벤트 스키마: checklist_item_created/completed, question_created/answer_adopted, guide_published, report_resolved.  
8.2 메트릭 대시보드: D7/D30 리텐션, 체크리스트 완료율, 채택률, 가이드 최신성, MTTAR.  
8.3 에러 추적: Sentry free tier, SLA 지연 알림 Slack Webhook.

## 9. 릴리스 플랜
9.1 W1~W2: 설계/문서/데이터 모델 확정.  
9.2 W3~W5: 인증-체크리스트-Q&A-Guide-검색 구현과 QA.  
9.3 W6: 모더레이션/운영 대시보드, 클로즈드 베타 30명.  
9.4 W7: 오픈 베타(캠퍼스 한정), 지표 수집 및 콘텐츠 보강.

## 10. 체크리스트
- [ ] KPI 정의 재확인 및 승인
- [ ] 기능 범위(MVP/V1.1) 확정
- [ ] T&S 정책 리뷰 완료
- [ ] 관측 지표 트래킹 계획 배포
- [ ] 릴리스 캘린더 팀 공유

## 11. Assumptions
- Cal 교환·유학생 커뮤니티에서 최소 50명 베타리스트를 확보 가능.  
- Vercel/Neon Free Tier로도 초기 트래픽(≤500 DAU)을 감당.  
- 운영팀 1명이 신고/가이드 검수 담당 가능.

## 12. Open Issues
- 이메일 도메인 화이트리스트 확장 범위(@berkeley.edu 외 affiliate 도메인).  
- Guide 만료 기준(30일 vs 45일) 최종 확정 필요.  
- QA 채택 신뢰도 점수 가중치 설계 추가 조사.
