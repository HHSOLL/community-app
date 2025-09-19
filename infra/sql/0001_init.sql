-- Schema bootstrap for Community App (Supabase/Neon compatible)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  email_domain text NOT NULL,
  school_id text NOT NULL,
  languages text[] DEFAULT ARRAY['ko'],
  verified boolean DEFAULT false,
  reputation integer DEFAULT 0,
  roles text[] DEFAULT ARRAY['member'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email_domain ON users(email_domain);

CREATE TABLE IF NOT EXISTS magic_link_tokens (
  token text PRIMARY KEY,
  email text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_magic_link_tokens_expires ON magic_link_tokens(expires_at);

CREATE TABLE IF NOT EXISTS onboarding_profiles (
  user_email text PRIMARY KEY,
  term text NOT NULL,
  stay_length integer NOT NULL,
  locale text NOT NULL,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checklist_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  stay_length integer NOT NULL,
  locale text NOT NULL,
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_checklist_templates_unique
  ON checklist_templates(term, stay_length, locale);

CREATE TABLE IF NOT EXISTS user_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_checklist_items_email
  ON user_checklist_items(user_email);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER onboarding_profiles_updated_at
  BEFORE UPDATE ON onboarding_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

INSERT INTO checklist_templates (term, stay_length, locale, items)
VALUES
  (
    '2025-spring',
    6,
    'ko',
    '[
      {"title":"통신 개통 준비","description":"추천 통신사 비교 및 요금제 선택","category":"통신","position":0},
      {"title":"은행 계좌 개설","description":"필요 서류 준비 및 지점 예약","category":"은행","position":1},
      {"title":"Cal 1 Card 발급","description":"사진 업로드 및 수령 일정 확인","category":"학생증","position":2}
    ]'::jsonb
  )
ON CONFLICT DO NOTHING;
