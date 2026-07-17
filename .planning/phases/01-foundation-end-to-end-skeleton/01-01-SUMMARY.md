---
phase: 01-foundation-end-to-end-skeleton
plan: 01
subsystem: infra
tags: [nextjs, react, typescript, tailwindcss, prisma, sqlite, vitest]

# Dependency graph
requires: []
provides:
  - Next.js 14 App Router project scaffold (dev/build/lint/test all green)
  - KODRYX brand tokens (kx-navy/gold/grey, radii, Poppins/Inter font families) in Tailwind
  - Branded landing page at `/` with CTA to `/assessment`
  - Prisma + SQLite `Assessment` model, migrated (`prisma/dev.db`)
  - Shared TS contracts (`WizardAnswers`, `ScoringInput`, `CategoryScores`, `Stage`) and
    `companyProfile` option-list constants for downstream wizard/scoring work
affects: [01-02, 01-03, 01-04]

# Tech tracking
tech-stack:
  added: [next@14.2.35, react@18, tailwindcss@3, vitest@1, prisma@6.19.3, "@prisma/client@6.19.3"]
  patterns:
    - "PrismaClient singleton cached on globalThis for Next.js dev hot-reload safety (lib/prisma.ts)"
    - "Brand tokens defined in tailwind.config.ts theme.extend (not CSS custom properties) — kx-caption/eyebrow/metric/divider-gold utility classes in globals.css use literal hex values instead of var(--kx-*)"
    - "JSON columns on the Assessment Prisma model for flexible per-section wizard answers, avoiding 100+ discrete columns"

key-files:
  created:
    - package.json
    - tsconfig.json
    - next.config.mjs
    - postcss.config.js
    - tailwind.config.ts
    - vitest.config.ts
    - .eslintrc.json
    - .gitignore
    - .env
    - app/layout.tsx
    - app/page.tsx
    - app/globals.css
    - public/logo-kodryx.png
    - prisma/schema.prisma
    - prisma/migrations/20260716110526_init/migration.sql
    - lib/prisma.ts
    - lib/types/assessment.ts
    - lib/constants/companyProfile.ts
    - lib/scaffold.test.ts
  modified: []

key-decisions:
  - "Pinned prisma + @prisma/client to exact 6.19.3 instead of latest (7.8.0) — Prisma 7 removed datasource url from schema.prisma and requires a driver adapter passed to PrismaClient(), which would force a different data-access pattern than this plan (and all downstream plans) assume"
  - "Package versions otherwise left unpinned (^ ranges) per plan, resolving to latest 14.x/18.x/3.x/1.x/8.x lines at install time"

patterns-established:
  - "Prisma version is pinned exact in package.json (6.19.3) — do not bump to prisma@latest without re-evaluating the driver-adapter migration"
  - "kx-* Tailwind color tokens + kx-caption/eyebrow/metric/divider-gold utility classes are the only brand vocabulary; no CSS custom properties are used for brand tokens in this project"

requirements-completed: [FOUND-01, FOUND-02, FOUND-03]

# Metrics
duration: 34min
completed: 2026-07-16
---

# Phase 1 Plan 01: Foundation Scaffold Summary

**Next.js 14 App Router project with KODRYX Navy/Gold brand tokens wired into Tailwind, a branded landing page, and a migrated Prisma/SQLite `Assessment` model with shared TS contracts for every later plan.**

## Performance

- **Duration:** 34 min
- **Started:** 2026-07-16T16:03:00+05:30
- **Completed:** 2026-07-16T16:37:13+05:30
- **Tasks:** 4 (Task 0 checkpoint auto-approved, Tasks 1-3 executed)
- **Files modified:** 20 created

## Accomplishments
- Working Next.js 14 App Router project — `npm run dev`, `npm run build`, `npm run lint`, and `npm run test` all exit 0
- KODRYX brand system (Navy `#0E2A3A` / Gold `#C9A24D`, Poppins display / Inter body, hairline borders, no shadows/gradients) wired into `tailwind.config.ts` and visible on `/`
- Branded landing page with logo, heading, and a working `/assessment` CTA link
- Prisma schema with the full `Assessment` model from the design spec, migrated to SQLite (`prisma/dev.db`)
- Shared TS contracts (`WizardAnswers`, `ScoringInput`, `CategoryKey`, `CategoryScores`, `Stage`) and `companyProfile` constants ready for Plans 01-02/01-03/01-04

## Task Commits

Each task was committed atomically:

1. **Task 0: Package legitimacy check before install** — auto-approved (no commit; gate-only task, no files created/modified)
2. **Task 1: Scaffold Next.js 14 App Router project + toolchain** - `e903d8c` (feat)
3. **Task 2: Wire KODRYX brand tokens + branded landing page** - `6079479` (feat)
4. **Task 3: Prisma/SQLite data model + shared TS contracts** - `c507ffa` (feat)

**Plan metadata:** _pending_ (docs: complete plan — committed after this summary)

## Files Created/Modified
- `package.json` / `package-lock.json` - dependencies, npm scripts (dev/build/start/lint/test)
- `tsconfig.json`, `next.config.mjs`, `postcss.config.js`, `vitest.config.ts`, `.eslintrc.json`, `.gitignore` - toolchain config
- `tailwind.config.ts` - kx-navy/gold/grey/grey-50/100/200 colors, sm/md/lg radii, display/body font families
- `app/layout.tsx` - Poppins/Inter via `next/font/google`, page metadata, `bg-white text-kx-navy` body
- `app/page.tsx` - branded landing page (logo, h1, body copy, `Start Assessment` CTA to `/assessment`)
- `app/globals.css` - Tailwind directives + `.kx-caption`/`.kx-eyebrow`/`.kx-metric`/`.kx-divider-gold` utility classes (literal hex values)
- `public/logo-kodryx.png` - brand logo asset, byte-identical copy from the design system source
- `prisma/schema.prisma` - full `Assessment` model (companyProfile/categoryScores/totalScore/stage required; the other 9 JSON sections and report fields nullable)
- `prisma/migrations/20260716110526_init/migration.sql` - initial migration, creates `Assessment` table
- `lib/prisma.ts` - PrismaClient singleton (globalThis-cached for dev hot-reload)
- `lib/types/assessment.ts` - `WizardAnswers`, `ScoringInput`, `CategoryKey`, `CategoryScores`, `Stage`, and per-section answer interfaces
- `lib/constants/companyProfile.ts` - `INDUSTRY_OPTIONS`, `EMPLOYEE_BANDS`, `REVENUE_BANDS`, `BUSINESS_MODEL_OPTIONS`, `LEADERSHIP_GOALS`, `INDUSTRY_HOURLY_COST_DEFAULTS`
- `lib/scaffold.test.ts` - trivial passing test so Vitest has a runnable suite (per Task 1 acceptance criteria; superseded by real tests in Plan 01-02)
- `.env` - `DATABASE_URL="file:./dev.db"` (gitignored, not committed)

## Decisions Made
- Pinned `prisma`/`@prisma/client` to exact `6.19.3` rather than the npm-default latest (`7.8.0`) — see Deviations below for full rationale.
- Left all other dependency versions as caret ranges per the plan (resolved to `next@14.2.35`, `react@18.3.x`, `tailwindcss@3.4.x`, `vitest@1.6.x`, `eslint@8.57.x` at install time).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Pinned Prisma to 6.19.3 instead of latest (7.8.0)**
- **Found during:** Task 3 (Prisma/SQLite data model)
- **Issue:** `npm install prisma @prisma/client` (unpinned, per plan wording) resolved to Prisma 7.8.0. Prisma 7 removed the `url` property from `datasource` blocks in `schema.prisma` (`npx prisma validate` failed with error code P1012) and requires an explicit driver `adapter` argument passed to the `PrismaClient` constructor instead of the plain `new PrismaClient()` this plan (and every downstream plan reading `lib/prisma.ts`) specifies. Adopting the Prisma 7 API would mean every future plan touching the data layer needs a different connection pattern than what's documented in the design spec and this plan.
- **Fix:** Reinstalled `prisma@6.19.3` and `@prisma/client@6.19.3` (exact versions, last stable 6.x release) via `npm install prisma@6.19.3 @prisma/client@6.19.3 --save-exact`. `npx prisma validate` then passed and `npx prisma migrate dev --name init` ran cleanly with the classic `url = env("DATABASE_URL")` schema syntax and adapter-free `PrismaClient()`.
- **Files modified:** `package.json`, `package-lock.json`
- **Verification:** `npx prisma validate` passes, `prisma/dev.db` exists, `prisma/migrations/20260716110526_init/migration.sql` contains `CREATE TABLE "Assessment"`, `npm run build`/`test`/`lint` all exit 0
- **Committed in:** `c507ffa` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to keep the data-access pattern this plan and all downstream plans depend on (`new PrismaClient()`, schema-level `datasource url`). No scope creep — same package, pinned to the last compatible major version. Future plans should not run `npm install prisma@latest` without first evaluating the Prisma 7 driver-adapter migration.

## Issues Encountered
None beyond the Prisma version deviation documented above.

## User Setup Required

None - no external service configuration required. `.env` was created locally with `DATABASE_URL="file:./dev.db"` (gitignored, not committed — this is expected since it's a local file-based SQLite path with no secret, but downstream contributors cloning the repo will need to recreate it; the design spec confirms no external services are used).

## Next Phase Readiness

- `npm run dev` serves the branded `/` landing page; `npm run build`, `npm run lint`, `npm run test` all exit 0
- `prisma/dev.db` exists with a migrated `Assessment` table matching the design spec
- `lib/types/assessment.ts` and `lib/constants/companyProfile.ts` are ready for Plan 01-02 (wizard steps) and Plan 01-03/01-04 (scoring engine, results page) to import
- Note for next plan: Prisma is pinned at 6.19.3 — do not upgrade to 7.x without updating `lib/prisma.ts` to the driver-adapter pattern and `prisma/schema.prisma` to move `url` out of `datasource`

---
*Phase: 01-foundation-end-to-end-skeleton*
*Completed: 2026-07-16*

## Self-Check: PASSED

All 18 files listed under Key Files (created) verified present on disk. All 3 task commit hashes (`e903d8c`, `6079479`, `c507ffa`) verified present in `git log --oneline --all`.
