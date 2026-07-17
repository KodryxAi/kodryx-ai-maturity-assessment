# Roadmap: KODRYX AI Maturity Assessment™ (KAMA)

## Overview

KAMA is built as a vertical MVP: Phase 1 stands up the full stack (Next.js +
Tailwind + brand tokens + Prisma/SQLite) and proves the entire pipeline works
end to end with just two wizard steps, a seed scoring calculation, and a
bare results page reachable at a stable URL. Phase 2 fills out the rest of
the assessment wizard so all ten input categories exist. Phase 3 upgrades
the scoring engine with the industry/size adjustments and stage ladder that
make the score executive-credible. Phase 4 layers on the fully-generated
report content — SWOT, opportunity matrix, risk, ranged ROI, roadmap,
benchmark, and executive summary. Phase 5 turns the results page into the
"wow factor" visual experience (gauge, radar, heatmap, quadrant plot, range
bars, timeline). Phase 6 closes the loop with client-side PDF export and the
no-auth admin list view. Each phase after Phase 1 extends a working,
demoable product rather than adding an isolated layer.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & End-to-End Skeleton** - Full stack scaffolded; a user can register, fill in Company Profile, submit, and see a basic score at a stable results URL (completed 2026-07-16)
- [x] **Phase 2: Complete Wizard Input** - All remaining assessment steps (departments, tech, data, AI adoption, automation, agent interest, security, employee readiness) with polished wizard transitions (completed 2026-07-17)
- [x] **Phase 3: Industry- & Size-Adjusted Scoring Engine** - Score reflects industry weighting and company size, assigns a maturity stage, and flags data confidence (completed 2026-07-17)
- [x] **Phase 4: Auto-Generated Report Content** - SWOT, Opportunity Matrix, Risk Assessment, ranged ROI, roadmap, benchmark, and executive summary generated deterministically (completed 2026-07-17)
- [x] **Phase 5: Wow-Factor Results Experience** - Results page delivers the full animated/visual experience (gauge, radar, heatmap, quadrant plot, ROI bars, timeline, exec callout) (completed 2026-07-17)
- [x] **Phase 6: PDF Export & Admin View** - Branded client-side PDF export and the no-auth `/admin` submissions list (completed 2026-07-17)

## Phase Details

### Phase 1: Foundation & End-to-End Skeleton
**Goal**: A user can complete the first two wizard steps, submit, and land on a real `/results/[id]` page showing a working (basic) maturity score — proving the entire pipeline (wizard → API → Prisma/SQLite → scoring → results) is wired end to end before any remaining steps or wow-factor visuals are built.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, WIZ-01, WIZ-02, WIZ-12, ENG-01, RES-09
**Success Criteria** (what must be TRUE):
  1. Next.js 14 + TypeScript + Tailwind project runs locally via `npm run dev`, with KODRYX brand tokens (Navy `#0E2A3A`, Gold `#C9A24D`, Poppins/Inter) visibly applied to the wizard and results page.
  2. User can enter contact info (name, email, company, optional phone) and complete the Company Profile step (industry, employee band, revenue band, business model, goals, blended hourly cost).
  3. Submitting the wizard calls `POST /api/assessments` once, persists the answers via Prisma to SQLite, and returns an assessment id.
  4. User is redirected to `/results/[id]` — a stable, reloadable, shareable URL — and sees an overall maturity score (0-100) computed from the categories collected so far.
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 14/Tailwind/Prisma foundation, KODRYX brand tokens, shared TS contracts (FOUND-01, FOUND-02, FOUND-03)
- [x] 01-02-PLAN.md — TDD maturity scoring engine: calculateCategoryScores, calculateTotalScore, getStage (ENG-01)
- [x] 01-03-PLAN.md — Assessment wizard UI: Registration + Company Profile steps, progress bar, state persistence (WIZ-01, WIZ-02, WIZ-12)
- [x] 01-04-PLAN.md — POST/GET API routes, /results/[id] page, wizard submit wiring, end-to-end walkthrough (WIZ-12, RES-09)
**UI hint**: yes

### Phase 2: Complete Wizard Input
**Goal**: Users can complete the full 10-step assessment — every department, technology, data, AI adoption, automation, agent-interest, security, and employee-readiness input from the design spec — with the same smooth, no-data-loss wizard experience proven in Phase 1.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: WIZ-03, WIZ-04, WIZ-05, WIZ-06, WIZ-07, WIZ-08, WIZ-09, WIZ-10, WIZ-11
**Success Criteria** (what must be TRUE):
  1. User can rate all 6 departments (Sales, Marketing, HR, Finance, Operations, Support) with a 0-5 maturity slider plus a capability checklist each.
  2. User can select systems-in-use and API maturity, rate the 4 data-readiness dimensions, select AI tools/frequency, select automated processes, select valuable AI agent types, and check off security/governance controls.
  3. User can rate the 5 employee-readiness dimensions (AI Skills, Training, Change Readiness, Leadership Support, Innovation Culture).
  4. A persistent progress bar (navy track, gold fill) is visible across every step, with a subtle 200ms fade/slide transition between steps and no jank.
  5. Completing all 10 steps and submitting still produces one `POST /api/assessments` call and a working `/results/[id]` page reflecting the fuller answer set.
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Wizard contract extension + Business Process/Technology/Data Readiness steps (WIZ-03, WIZ-04, WIZ-05)
- [x] 02-02-PLAN.md — AI Adoption, Automation, AI Agent Interest steps (WIZ-06, WIZ-07, WIZ-08)
- [x] 02-03-PLAN.md — Security, Employee Readiness steps + full POST validation (WIZ-09, WIZ-10, WIZ-11)
**UI hint**: yes

### Phase 3: Industry- & Size-Adjusted Scoring Engine
**Goal**: The maturity score is no longer a flat, generic calculation — it reflects the company's industry and size, assigns a named maturity stage with guidance text, and honestly signals confidence when input data is thin.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: ENG-02, ENG-03, ENG-04, ENG-05
**Success Criteria** (what must be TRUE):
  1. Two submissions with identical raw ratings but different industries produce different category-weighted scores (industry multiplier table applied, then renormalized to 100).
  2. Technology and Automation scoring is normalized against each company's employee-count band rather than an absolute checklist count.
  3. The results page shows one of the 6 named stages (e.g., "Level 3 — AI Exploring") with its static "what this means" and "what's next" text, matching the computed total score.
  4. A "Based on a fast-pass assessment; scores refine with more detail" caption appears on the results page when fewer than half of optional checklist items were touched.
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — TDD industry weight adjustment + company-size normalization (ENG-02, ENG-03)
- [x] 03-02-PLAN.md — TDD stage ladder guidance text + data-completeness computation (ENG-04, ENG-05)
- [x] 03-03-PLAN.md — Wire dataCompleteness/stage guidance into API route + results page, end-to-end walkthrough (ENG-04, ENG-05)

### Phase 4: Auto-Generated Report Content
**Goal**: Beyond the score, the report auto-generates the full executive-grade analysis a real consulting engagement would produce — SWOT, opportunity matrix, risk assessment, department-level ranged ROI, phased roadmap, benchmark comparison, and executive summary — all deterministic, no AI/LLM calls.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: GEN-01, GEN-02, GEN-03, GEN-04, GEN-05, GEN-06, GEN-07, GEN-08
**Success Criteria** (what must be TRUE):
  1. The report shows a SWOT with gap-specific bullets (naming the actual missing capability or low rating, not a generic per-category sentence), capped at 4-5 bullets per quadrant and ranked by adjusted weight × score-gap.
  2. The report shows an Opportunity Matrix where each initiative (derived from `agentInterest` selections cross-referenced with detected gaps) has Impact/Effort/ROI/Priority values.
  3. The report shows all 7 risk types (Technical, Business, Security, Operational, Compliance, Adoption, Budget) rated Low/Medium/High.
  4. The report shows a per-department ROI breakdown (Conservative/Expected/Optimistic) using the user's blended hourly cost, with an explicit assumptions block.
  5. The report shows a 30/90/180/365-day roadmap with 1-2 items swapped based on lowest-scoring categories, a benchmark comparison (score vs. industry average vs. top quartile), the top-3 "Recommended First Moves" ranked by (Impact + ROI)/Effort, and a templated Executive Summary paragraph.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Wow-Factor Results Experience
**Goal**: The results page delivers the premium, "wow factor" visual reveal specified in the design — the report should feel like it came from a real consulting engagement, not a data dump — while staying within KODRYX's minimal-motion brand rules.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: RES-01, RES-02, RES-03, RES-04, RES-05, RES-06, RES-07, RES-08
**Success Criteria** (what must be TRUE):
  1. After the wizard's last step, a brief "Analyzing your AI maturity..." transition (cycling through the 10 category names) plays before the results page mounts.
  2. The total score renders as an animated radial/arc gauge (navy track, gold fill) that counts up from 0 to the final score on mount.
  3. All 10 category scores render as a radar/spider chart, and the 6 departments render as a colored heatmap grid.
  4. The Opportunity Matrix renders as an Impact-vs-Effort quadrant plot with ROI-sized bubbles (First Moves visually highlighted), ROI ranges render as horizontal range bars per department, and the roadmap renders as a horizontal timeline strip across the 4 phases.
  5. The benchmark comparison bar and the Executive Summary + First Moves callout appear at the very top of the results page, above the gauge.
**Plans**: TBD
**UI hint**: yes

### Phase 6: PDF Export & Admin View
**Goal**: The two remaining product surfaces close the loop — the SMB can keep a branded, shareable copy of their report, and KODRYX can see every lead that has come through the funnel.
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: PDF-01, ADMIN-01, ADMIN-02
**Success Criteria** (what must be TRUE):
  1. User can click "Download PDF" on the results page and receive a client-side-generated PDF containing every visual (gauge, radar, heatmap, quadrant plot, ROI ranges, timeline) plus the Executive Summary and First Moves, with KODRYX branding intact.
  2. `/admin` lists every submission (company, industry, contact, score, stage, submitted date) sorted newest-first, with no authentication required.
  3. Each admin row links through to that submission's `/results/[id]` page.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & End-to-End Skeleton | 4/4 | Complete   | 2026-07-16 |
| 2. Complete Wizard Input | 3/3 | Complete   | 2026-07-17 |
| 3. Industry- & Size-Adjusted Scoring Engine | 3/3 | Complete   | 2026-07-17 |
| 4. Auto-Generated Report Content | 0/TBD | Not started | - |
| 5. Wow-Factor Results Experience | 0/TBD | Not started | - |
| 6. PDF Export & Admin View | 0/TBD | Not started | - |
