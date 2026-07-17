# Walking Skeleton — KODRYX AI Maturity Assessment™ (KAMA)

**Phase:** 1
**Generated:** 2026-07-16

## Capability Proven End-to-End

An SMB decision-maker can enter their contact info and Company Profile in a
brand-styled wizard, submit once, have the answers persisted to SQLite via
Prisma, and land on a stable `/results/[id]` page that shows a real
(partial) AI maturity score and stage — proving wizard → API → Prisma/SQLite
→ scoring → results is wired end to end before Phase 2 adds the remaining
8 wizard steps and Phases 3-6 add the full scoring/report/wow-factor/PDF/
admin layers.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14, App Router, TypeScript | Locked by approved design spec (`docs/superpowers/specs/2026-07-16-kodryx-ai-maturity-assessment-design.md`) |
| Styling | Tailwind CSS, theme extended with KODRYX tokens ported from `colors_and_type.css` | Locked by design spec + brand fidelity constraint |
| Data layer | Prisma + SQLite (`prisma/dev.db`, file-based) | Locked by design spec — no external services, runs entirely locally via `npm run dev` |
| Test runner | Vitest (unit tests for pure scoring logic) | Lightweight, native ESM/TS support, no config overhead for logic-only tests introduced in this phase |
| Auth | None | Locked constraint — single-user/internal tool, no login anywhere in v1 |
| State management (wizard) | Local React state (`useReducer`) in a client component, no external state library | Only 2 steps in Phase 1; adding a state library is unjustified until Phase 2's 10-step wizard, deferred to that phase's own discretion |
| Validation | Manual field checks (no schema library) on both client and server | Two-step surface is small enough that a schema library (e.g. zod) is unnecessary overhead for Phase 1; server-side manual validation is still the authoritative gate |
| Directory layout | `app/` (routes + API routes), `components/wizard/*` (wizard step components), `lib/scoring/*` (pure scoring functions), `lib/types/*` (shared TS contracts), `lib/constants/*` (option lists), `lib/prisma.ts` (singleton client) | Keeps business logic (scoring) separate from UI and route handlers so Phase 2-6 can extend without restructuring |

## Stack Touched in Phase 1

- [x] Project scaffold (Next.js 14 App Router, TypeScript, Tailwind, ESLint, Vitest)
- [x] Routing — real routes: `/` (landing), `/assessment` (wizard), `/results/[id]` (results)
- [x] Database — Prisma `Assessment` model migrated to SQLite; one real write (`POST /api/assessments`) and one real read (`GET`-equivalent direct Prisma read in `/results/[id]`)
- [x] UI — interactive 2-step wizard (Registration + Company Profile) wired to the API via the wizard's submit action
- [x] Deployment — local dev run via `npm run dev` (no hosted deployment in v1, per locked constraint)

## Out of Scope (Deferred to Later Slices)

- The remaining 8 wizard steps (departments, tech stack, data readiness, AI adoption, automation, agent interest, security, employee readiness) — Phase 2
- Industry weight adjustment, company-size normalization, full stage descriptions, data-completeness caption logic (ENG-02..05) — Phase 3
- SWOT, Opportunity Matrix, Risk Assessment, ranged ROI, roadmap, benchmark table, executive summary generation (GEN-01..08) — Phase 4
- Animated gauge, radar chart, department heatmap, quadrant plot, ROI range bars, roadmap timeline, "Analyzing..." transition (RES-01..08) — Phase 5
- Client-side PDF export, `/admin` list view (PDF-01, ADMIN-01/02) — Phase 6
- A schema/validation library (zod) and a wizard state library — revisit only if Phase 2's larger wizard surface makes manual validation/local state unwieldy

## Subsequent Slice Plan

- Phase 2: All remaining assessment steps, same wizard shell and progress-bar pattern extended to 10 steps
- Phase 3: Industry/size-adjusted scoring engine layered on top of the same `calculateCategoryScores`/`calculateTotalScore` functions (no rewrite needed — they already read the full `ScoringInput` shape)
- Phase 4: Auto-generated report content sections added to the same `Assessment` row (nullable JSON fields already reserved in the Phase 1 schema)
- Phase 5: Results page upgraded from plain score/stage to the full wow-factor visual experience
- Phase 6: PDF export and `/admin` view added on top of the existing API/data layer
