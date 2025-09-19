# Repository Guidelines

## Project Structure & Module Organization
Keep runtime code inside `src/` with feature-first folders (`src/features/<feature>/`). Each feature should include `components/`, `logic/`, and `api/` subfolders so shared code stays isolated. Cross-cutting UI primitives belong in `src/ui/`, reusable hooks in `src/hooks/`, and domain contracts in `src/domain/`. Store data fixtures under `fixtures/`, static assets (images, fonts, locale files) under `assets/`, and long-form documentation in `docs/`. E2E and load-test scripts reside in `tests/e2e/` and `tests/perf/`. Utility scripts (seeding, migrations) go into `tools/` to keep the root clean.

## Build, Test, and Development Commands
We standardize on npm scripts. Run `npm install` after pulling new dependencies. `npm run dev` should start the local server on port 3000 (adjust the script when wiring Vite/Next/Expo). Use `npm run build` to produce a production bundle and fail the build if type errors surface. Execute `npm test` for the unit and integration test suite; add `--watch` while iterating locally. For linting and formatting, wire `npm run lint` (ESLint) and `npm run format` (Prettier) and ensure they pass before pushing.

## Coding Style & Naming Conventions
Write new code in TypeScript; prefer functional components and hooks. Use 2-space indentation, single quotes, and trailing commas where valid. Component files are `PascalCase.tsx`, utilities `camelCase.ts`, configuration and scripts `kebab-case.ts`. Export one default component per file to keep imports predictable. Rely on ESLint with the React, TypeScript, and Jest plugins plus Prettier for formatting—run them via the scripts above. Keep environment variables in `.env.local` and document them in `docs/config.md`.

## Testing Guidelines
Collocate unit tests next to the source as `*.test.tsx` or `*.test.ts`. Use Jest with React Testing Library; integration or service tests belong in `tests/integration/`. Aim for >= 80% statement coverage, verified with `npm test -- --coverage`. Snapshot tests should accompany complex visual components, and contract tests must mock HTTP boundaries.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat: add community feed card`, `fix: correct comment sorting`). Limit commits to a single concern, and include migration notes within the body when schema changes occur. PRs should describe the problem, the solution, manual test evidence, and reference any GitHub issues. Add screenshots or screen recordings for UI changes and double-check that lint, test, and build commands succeed before requesting review.
