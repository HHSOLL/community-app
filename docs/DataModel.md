# C. 데이터 설계 & ERD

## 0. Summary (EN)
Outlines relational schemas for users, questions, answers, guides, checklists, reports, and system telemetry optimized for PostgreSQL/Supabase. Tables include indexes, foreign keys, and JSONB fields where flexible metadata is needed. A sample migration provides the baseline DDL to bootstrap Neon/Supabase instances quickly.

## 1. 테이블 정의
### 1.1 users
```
columns:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  email text UNIQUE NOT NULL
  email_domain text NOT NULL CHECK (email_domain IN ('berkeley.edu','haas.berkeley.edu'))
  school_id text NOT NULL
  languages text[] DEFAULT ARRAY['ko']
  verified boolean DEFAULT false
  reputation integer DEFAULT 0
  roles text[] DEFAULT ARRAY['member']
  created_at timestamptz DEFAULT now()
indexes:
  idx_users_email_domain (email_domain)
```
### 1.2 questions
```
columns:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id uuid REFERENCES users(id)
  school_id text NOT NULL
  term text NOT NULL
  title text NOT NULL
  body text NOT NULL
  tags text[] DEFAULT '{}'
  source_refs jsonb DEFAULT '[]'
  status text DEFAULT 'published'
  created_at timestamptz DEFAULT now()
  updated_at timestamptz
indexes:
  idx_questions_school_term (school_id, term)
  idx_questions_tags GIN (tags)
```
### 1.3 answers
```
columns:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE
  user_id uuid REFERENCES users(id)
  body text NOT NULL
  source_refs jsonb DEFAULT '[]'
  upvotes integer DEFAULT 0
  accepted boolean DEFAULT false
  created_at timestamptz DEFAULT now()
  updated_at timestamptz
```
### 1.4 guides
```
columns:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  school_id text NOT NULL
  topic text NOT NULL
  summary text NOT NULL
  body text NOT NULL
  version text NOT NULL
  last_verified_at timestamptz
  sources jsonb DEFAULT '[]'
  created_at timestamptz DEFAULT now()
  updated_at timestamptz
indexes:
  idx_guides_school_topic (school_id, topic)
```
### 1.5 checklist_templates & items
```
checklist_templates:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  school_id text NOT NULL
  term text NOT NULL
  locale text NOT NULL
  items jsonb NOT NULL -- structured array of task templates
  created_at timestamptz DEFAULT now()

checklist_items:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  user_id uuid REFERENCES users(id)
  template_id uuid REFERENCES checklist_templates(id)
  title text NOT NULL
  status text DEFAULT 'pending'
  due_at timestamptz
  notes text
  metadata jsonb DEFAULT '{}'
  created_at timestamptz DEFAULT now()
  updated_at timestamptz
indexes:
  idx_checklist_items_user_status (user_id, status)
```
### 1.6 reports
```
columns:
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
  reporter_id uuid REFERENCES users(id)
  target_type text CHECK (target_type IN ('question','answer','guide','user'))
  target_id uuid NOT NULL
  reason text NOT NULL
  status text DEFAULT 'pending'
  created_at timestamptz DEFAULT now()
  resolved_at timestamptz
  resolution_notes text
indexes:
  idx_reports_target (target_type, target_id)
```
### 1.7 audit_events
```
columns:
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  user_id uuid REFERENCES users(id)
  event_type text NOT NULL
  payload jsonb NOT NULL
  created_at timestamptz DEFAULT now()
indexes:
  idx_audit_events_type (event_type)
```

## 2. 마이그레이션 초안
```
-- 0001_init.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE users (...);
CREATE TABLE questions (...);
CREATE TABLE answers (...);
CREATE TABLE guides (...);
CREATE TABLE checklist_templates (...);
CREATE TABLE checklist_items (...);
CREATE TABLE reports (...);
CREATE TABLE audit_events (...);
```
세부 컬럼 정의는 위 테이블 스펙을 그대로 삽입하고, 각 외래키에 `ON DELETE CASCADE` 혹은 `ON DELETE SET NULL`을 상황에 맞게 추가한다.

## 3. 인덱스 전략
3.1 텍스트 검색은 Meilisearch로 위임, Postgres는 필터/정렬 인덱스 위주.  
3.2 tags, sources 등 유연 데이터는 jsonb/array 인덱스를 혼합 활용.  
3.3 보고용 대량 조회는 materialized view `guide_refresh_queue` (만료 임박 가이드)로 대비.

## 4. 체크리스트
- [ ] 모든 FK와 제약조건 검토
- [ ] Term/School 기준 템플릿 시드 데이터 확보
- [ ] audit_events GDPR 준수 검토
- [ ] 보고서용 뷰 설계 확정
- [ ] 마이그레이션 스크립트 실행 테스트

## 5. Assumptions
- Supabase/Neon에서 `pgcrypto` 확장 사용 가능.  
- tags는 10개 이하, checklist items 100개 이하라 성능 영향 경미.  
- audit_events는 90일 후 cold storage 이전.

## 6. Open Issues
- guide-body를 Markdown vs Structured JSON 중 선택 확정.  
- checklist_templates.items 구조(간단 JSON vs 별도 테이블) 추가 논의.  
- 보고자가 비회원일 때 처리는 MVP scope 밖으로 유지.
