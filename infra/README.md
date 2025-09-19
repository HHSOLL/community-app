# Infra Overview (Stub)

This directory will hold IaC definitions, deployment scripts, and environment configuration templates as the MVP build progresses.

Planned structure:
- `terraform/` – optional Terraform modules for managed services
- `deploy/` – GitHub Actions workflows or shell scripts for CI/CD
- `env/` – shared environment variable templates and secrets management docs

## Supabase Provisioning
1. Create a Supabase project (free tier) and enable the `pgcrypto` extension.
2. Run the SQL migration `infra/sql/0001_init.sql` via the Supabase SQL editor or `psql`:
   ```bash
   psql "$SUPABASE_DB_URL" -f infra/sql/0001_init.sql
   ```
3. Store `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and GitHub/Vercel secrets.
4. Configure Row Level Security rules as features harden; the MVP relies on service role calls only.
