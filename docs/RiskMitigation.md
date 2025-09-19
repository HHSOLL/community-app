# L. 리스크 & 대응 전략

## 0. Summary (EN)
Lists top project risks (information freshness, harmful content, content scarcity, email auth) and outlines mitigation plus rollback plans. Ensures the team anticipates operational, technical, and compliance issues before launch.

## 1. 정보 최신성/정책 변경
- 리스크: 행정/은행 정책 자주 변경 → 가이드 부정확.  
- 대응: 가이드 만료 알림(30일), 운영팀 주간 검수, 사용자 신고 채널.  
- 롤백: 최신성 확인 전 가이드 비공개 전환.

## 2. 유해 콘텐츠/갈등
- 리스크: 혐오표현, 잘못된 조언.  
- 대응: 금칙어 필터, ML 선분류, 휴먼 리뷰 SLA.  
- 롤백: 게시물 비공개 + 사용자 정지, 재발 시 IP 차단.

## 3. 초기 콘텐츠 공백
- 리스크: 빈 체크리스트/질문으로 사용자 이탈.  
- 대응: 시드 콘텐츠, 운영팀 Seed Q&A 30개 작성, 베타 사용자 리워드.  
- 롤백: 큐레이션된 외부 링크 제공.

## 4. 이메일 인증 이슈
- 리스크: berkeley.edu 외 도메인(haas, law) 접근 제한.  
- 대응: 화이트리스트 확장 옵션, 메일 수동 검증 프로세스.  
- 롤백: 임시 초대 코드 도입.

## 5. 기술 운영 리스크
- 리스크: Free tier 성능 한계, 시간대 다른 운영자 공백.  
- 대응: 모니터링 알림, 최소 2인 on-call, 필요 시 유료 플랜 업그레이드.  
- 롤백: Rate limit 강화, 야간 모니터 Slack Bot.

## 6. 체크리스트
- [ ] 가이드 검수 캘린더 설정
- [ ] 금칙어/ML 모델 주기 점검 계획 수립
- [ ] Seed 콘텐츠 생성 일정 확정
- [ ] 화이트리스트 확장 정책 문서화
- [ ] On-call 룰북 공유

## 7. Assumptions
- 운영팀이 정책 변경을 주간 단위로 수집 가능.  
- 메일 서버가 안정적으로 대량 발송 처리.  
- 베타 사용자와 커뮤니케이션 채널 확보.

## 8. Open Issues
- Berkeley 이외 타학교 확장 시 정책 차이 대응.  
- 법무 검토 리소스 확보.  
- 긴급 상황(안전 이슈) 대응 프로토콜 수립.
