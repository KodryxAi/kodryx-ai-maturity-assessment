---
phase: 03-industry-size-adjusted-scoring-engine
plan: 01
subsystem: scoring-engine
tags: [scoring, tdd, industry-weights, size-normalization]
requires: []
provides:
  - getAdjustedWeights (industry-adjusted, renormalized-to-100 category weights)
  - SIZE_BAND_BASELINES (employeeBand-scaled Technology/Automation baselines)
affects:
  - lib/scoring/calculateScore.ts
tech-stack:
  added: []
  patterns:
    - "Renormalize-to-100 pattern for weighted category tables adjusted by a lookup multiplier"
    - "Baseline-capped ratio pattern (Math.min(1, count/baseline)) for size-normalized coverage scores"
key-files:
  created:
    - lib/scoring/industryWeights.ts
    - lib/scoring/industryWeights.test.ts
    - lib/scoring/categoryFormulas.test.ts
  modified:
    - lib/scoring/calculateScore.ts
    - lib/scoring/calculateScore.test.ts
    - lib/scoring/categoryFormulas.ts
decisions:
  - "Mapped the design spec's 'Operations' multiplier column to the businessProcess CategoryKey (documented inline in industryWeights.ts)"
  - "The 4 industries without explicit spec rows (Financial Services, Professional Services, Education, Other) use the spec's own stated (default/other) 1.0-across-the-board row"
metrics:
  duration: 25min
  completed: 2026-07-17
---

# Phase 03 Plan 01: Industry weight adjustment + company-size normalization Summary

Implemented ENG-02 (industry-adjusted, renormalized-to-100 category weights) and ENG-03 (employee-band-scaled Technology/Automation coverage baselines) via strict TDD — both fully proven by 11 new passing automated tests before any downstream results-page wiring consumes them.

## What Was Built

**ENG-02 — Industry weight adjustment** (`lib/scoring/industryWeights.ts`, new):
- `INDUSTRY_MULTIPLIERS`: a static table keyed by all 8 `INDUSTRY_OPTIONS` values, mapping the design spec's "Operations/Technology/Data/Security" multiplier columns onto `businessProcess`/`technology`/`data`/`security` `CategoryKey`s. Manufacturing, SaaS / Technology, Healthcare, and Retail get the spec's explicit multiplier rows; the remaining 4 industries (Financial Services, Professional Services, Education, Other) use the spec's own stated default row (1.0 across the board).
- `getIndustryMultiplier(industry, category)`: looks up a multiplier, defaulting to `1.0` for any industry/category pair not in the table (this is what makes the other 6 categories — aiAdoption, automation, aiAgents, people, leadership, innovation — always multiply by 1.0 regardless of industry, and what makes an unrecognized industry string degrade gracefully rather than throw).
- `getAdjustedWeights(industry)`: multiplies each of the 10 `CATEGORY_WEIGHTS` by its industry multiplier, then renormalizes all 10 so they sum to exactly 100.
- `calculateScore.ts`'s `calculateCategoryScores` now computes `getAdjustedWeights(input.companyProfile.industry)` once per call instead of reading the static `CATEGORY_WEIGHTS` import directly — `calculateTotalScore` is unaffected.

**ENG-03 — Company-size normalization** (`lib/scoring/categoryFormulas.ts`):
- `SIZE_BAND_BASELINES`: per-`employeeBand` systems/automation baselines — `"1-10": 3/3`, `"11-50": 5/5`, `"51-200": 7/7`, `"200+": 8/9` (the "200+" baselines equal the full absolute option-list lengths; "1-10" matches the design spec's own illustrative example verbatim; the middle two are linear steps between the anchors).
- `technologyRatio`/`automationRatio` now divide the raw systems/processes count by the caller's band baseline (capped at `1.0` via `Math.min`), falling back to the pre-existing `TOTAL_SYSTEMS_OPTIONS`/`TOTAL_AUTOMATION_PROCESSES_OPTIONS` absolute denominators when `employeeBand` isn't a recognized `SIZE_BAND_BASELINES` key. Every other ratio function (businessProcess, data, aiAdoption, aiAgents, security, people, leadership, innovation) is untouched — normalization applies only to Technology and Automation per the design spec.

Also updated `calculateScore.test.ts`'s shared `baseCompanyProfile.industry` fixture from `"SaaS / Technology"` to `"Other"` (a true renormalization no-op under the new default multiplier row), keeping all 5 pre-existing tests passing unchanged, and added a new ENG-02 test proving two `ScoringInput`s with identical `techStack`/`employeeBand` but different `industry` now produce different `calculateCategoryScores(...).technology` values.

## Verification

- `npm run test -- lib/scoring/industryWeights.test.ts lib/scoring/calculateScore.test.ts` — 5 + 6 tests pass.
- `npm run test -- lib/scoring/categoryFormulas.test.ts` — 6 tests pass.
- `npm run test` (full project suite) — 7 test files, 35 tests, all passing.
- `npx tsc --noEmit` — clean, no type errors.
- `getAdjustedWeights` sums to 100 (±1e-6) for every one of the 8 `INDUSTRY_OPTIONS` values (proven by test).
- `grep -c "CATEGORY_WEIGHTS" lib/scoring/calculateScore.ts` → `0` (import removed as specified).
- `grep -c "SIZE_BAND_BASELINES\[" lib/scoring/categoryFormulas.ts` → `2` (only `technologyRatio`/`automationRatio` reference it, as specified).

## TDD Gate Compliance

Both tasks followed RED → GREEN strictly:
- Task 1 (ENG-02): `test(03-01)` commit `84ff3e9` (RED, confirmed failing) → `feat(03-01)` commit `474c1dd` (GREEN, confirmed passing).
- Task 2 (ENG-03): `test(03-01)` commit `5f738c3` (RED, confirmed failing — 3 of 6 new assertions failed pre-implementation, matching the size-normalization behavior not yet existing) → `feat(03-01)` commit `5ed4a89` (GREEN, confirmed passing).

No REFACTOR commit was needed — both implementations were minimal and clean on first pass.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written. One minor interpretation applied per the plan's own instruction: the plan's `<behavior>` section for Task 2 describes a single "Test 6" covering the fallback behavior for both `technologyRatio` and `automationRatio`; this was implemented as one `it()` block with two assertions (rather than two separate `it()` blocks) to keep the test count at exactly 6, matching the acceptance criteria's literal "All 6 categoryFormulas.test.ts tests pass."

## Known Stubs

None — this plan is pure business logic with no UI or data-flow stubs.

## Threat Flags

None — no new trust boundaries, I/O, or network/auth surface introduced. Confirms the plan's own threat_model assessment (pure computation over an already-typed in-process `ScoringInput`).

## Self-Check: PASSED

- FOUND: lib/scoring/industryWeights.ts
- FOUND: lib/scoring/industryWeights.test.ts
- FOUND: lib/scoring/categoryFormulas.test.ts
- FOUND: commit 84ff3e9
- FOUND: commit 474c1dd
- FOUND: commit 5f738c3
- FOUND: commit 5ed4a89
