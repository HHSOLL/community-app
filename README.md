# Community App

This repository contains the MVP planning and engineering scaffold for the Community App, a UC Berkeley-focused launchpad that accelerates exchange and visiting students through localized checklists, a moderated Q&A forum, and curated guides in Korean and English.

## Monorepo Layout
- `apps/web`: Next.js App Router client with KR/EN localization, feature previews, and Tailwind styling.
- `packages/ui`: Shared UI kit (Button, Card) ready for reuse in web and future native clients.
- `packages/config`: Centralized ESLint and TypeScript base configs consumed across workspaces.
- `infra`: Stub for IaC, deployment scripts, and environment documentation.
- `docs`: Placeholder for PRD, IA, ERD, API specs, moderation playbooks, and analytics plans.

## Getting Started
```bash
npm install
npm run dev        # boots apps/web on http://localhost:3000 (redirects to /ko)
npm run lint       # eslint using shared workspace config
npm run test       # jest + Testing Library smoke suite
npm run format     # prettier check
```
Copy `.env.example` to `.env.local` before running the app and configure magic link, database, Meilisearch, and analytics endpoints.

## Current Documentation
- `plan.md`: Original project brief, constraints, and deliverables.
- `AGENTS.md`: Contributor guidelines (structure, tooling, collaboration).
- `init_plan.md`: Phase roadmap and development tracks derived from the initial brief.
- `docs/`: Phase 0 deliverables (`PRD`, `IA`, `DataModel`, `API`, `SearchEmbedding`, `Frontend`, `Moderation`, `Analytics`, `Infra`, `ProjectPlan`, `SeedContent`, `RiskMitigation`).

Expect rapid iteration—each phase will layer in production-ready features, ops playbooks, and instrumentation ahead of the Berkeley pilot launch.
