# G. 모더레이션 정책 & 운영 플레이북

## 0. Summary (EN)
Defines community safety rules, ML thresholds, and human review SLAs to protect the platform. Workflow diagrams cover reporting, escalation, and resolution steps so the ops team can react quickly. Includes keyword lists, evidence capture, and communication templates.

## 1. 정책 원칙
1.1 실명 기반 신뢰: 기본 공개 프로필, 닉네임은 표시용.  
1.2 최소 수집: 이메일, 언어, 체류정보 외 민감정보 저장 금지.  
1.3 투명성: 조치 내역 이용자 메일로 통지, 재심 7일 내 처리.

## 2. 금칙어 & 스팸 규칙
2.1 금칙어 목록: 혐오 표현, 광고 키워드(대출, 카지노 등), 개인정보 공유(주민등록번호).  
2.2 자동 필터: 정규식 + 다국어 리스트, 감지 시 게시 중단 후 재검토.  
2.3 스팸 ML: HuggingFace `bert-base-multilingual-cased` fine-tune, threshold 0.82 이상 시 `pending_review`로 격리.

## 3. 신고 처리 플로우
3.1 사용자 신고 접수 → 즉시 큐 기록.  
3.2 ML 선분류(`severity`: high/medium/low).  
3.3 운영자 triage: high는 6시간 이내, 나머지는 24시간.  
3.4 조치: `dismiss`, `soft_remove`, `hard_remove`, `suspend_user`.  
3.5 결과 기록: audit_events + 이메일 통지 템플릿.

## 4. 휴먼 리뷰 플레이북
4.1 체크포인트: 사실 확인, 정책 위반 항목, 증빙 캡처.  
4.2 Escalation: 법적 이슈 → 학교/법무 채널.  
4.3 재발 대응: 1회 경고, 2회 7일 정지, 3회 영구 퇴출.  
4.4 가이드 만료 알림: 30일 초과 시 운영자에게 Slack DM + 이메일.

## 5. 운영 메트릭
5.1 MTTAR(Target) < 12시간.  
5.2 신고 재발률 < 10%.  
5.3 승인 대비 취소 비율 < 5%.  
5.4 키워드 false positive율 < 15%.

## 6. 체크리스트
- [ ] 금칙어 리스트 초기 버전 200개 작성
- [ ] ML threshold 실제 데이터로 튜닝
- [ ] SLA 대시보드 구성 (Ops)
- [ ] 조치 템플릿(메일/슬랙) 확정
- [ ] Escalation 연락망 문서화

## 7. Assumptions
- 운영팀 1~2명이 교대, Slack ops 채널 상시 모니터링.  
- 학교 정책 위반시 법무 자문 필요.  
- ML 모델은 월 1회 재학습.

## 8. Open Issues
- 신고 악용 방지를 위한 rate limit(사용자별) 세부 설정.  
- 익명 제보 허용 여부.  
- 모더레이션 로그 보관 기간(6개월 vs 1년).
