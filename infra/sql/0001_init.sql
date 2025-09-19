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
