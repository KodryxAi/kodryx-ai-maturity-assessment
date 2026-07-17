---
phase: 01-foundation-end-to-end-skeleton
plan: 02
subsystem: scoring
tags: [typescript, vitest, tdd, scoring-engine]

# Dependency graph
requires:
  - phase: 01-foundation-end-to-end-skeleton (plan 01)
    provides: "ScoringInput/CategoryScores/CategoryKey/Stage TS contracts and LEADERSHIP_GOALS constant"
provides:
  - "calculateCategoryScores(input) and calculateTotalScore(scores) pure scoring functions over the full 10-category ScoringInput shape"
  - "getStage(totalScore) 6-band stage-ladder lookup"
  - "CATEGORY_WEIGHTS and per-category ratio functions (businessProcessRatio..innovationRatio) in categoryFormulas.ts"
affects: [01-03, 01-04, phase-2-wizard-steps, phase-3-industry-size-adjustment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Each category ratio function defaults to 0 when its ScoringInput section is undefined — no special-casing needed as Phase 2 fills in the remaining 8 wizard sections"
    - "Option-count denominators (8 systems, 10 AI tools, 9 automation processes, 11 security items, 4 maturity/frequency levels) defined as named constants at the top of categoryFormulas.ts for Phase 2 UI reuse"
    - "aiAgentsRatio implemented as a composite proxy (0.5 * automationRatio + 0.5 * aiAdoptionRatio) per the design spec, since Step 7 captures interest/opportunity rather than current agent usage"

key-files:
  created:
    - lib/scoring/categoryFormulas.ts
    - lib/scoring/calculateScore.ts
    - lib/scoring/calculateScore.test.ts
    - lib/scoring/stage.ts
    - lib/scoring/stage.test.ts
  modified: []

key-decisions:
  - "getStage uses <= boundary comparisons per band (0-20, 21-40, ...) matching the design spec's inclusive-upper-bound ladder exactly"

patterns-established:
  - "Scoring functions are pure and side-effect-free, built against the full ScoringInput shape (not a Phase-1-shrunk shape) so later phases add sections without touching this code"

requirements-completed: [ENG-01]

# Metrics
duration: 4min
completed: 2026-07-16
---

# Phase 1 Plan 02: Maturity Scoring Engine Summary

**Pure, fully-tested `calculateCategoryScores`/`calculateTotalScore`/`getStage` functions implementing the design spec's 10-category weighted formula table and 6-band stage ladder, built against the complete `ScoringInput` shape so Phase 2's remaining 8 wizard steps require zero rewrite.**

## Performance

- **Duration:** 4 min (TDD implementation span; commit-to-commit)
- **Started:** 2026-07-16T16:46:55+05:30
- **Completed:** 2026-07-16T16:50:14+05:30
- **Tasks:** 2 (each executed as RED test commit -> GREEN implementation commit)
- **Files modified:** 5 created

## Accomplishments
- `categoryFormulas.ts` — `CATEGORY_WEIGHTS` (sums to exactly 100) and 10 pure 0-1 ratio functions, one per `CategoryKey`, each defaulting to 0 when its `ScoringInput` section is `undefined`
- `calculateScore.ts` — `calculateCategoryScores(input)` (weighted, unrounded per-category scores) and `calculateTotalScore(scores)` (rounded, clamped to 0-100)
- `stage.ts` — `getStage(totalScore)` mapping any 0-100 score to exactly one of the 6 named design-spec stage bands
- All 10 tests across `calculateScore.test.ts` and `stage.test.ts` pass; full project test suite (11 tests including the Plan 01 scaffold test) passes; `npx tsc --noEmit` and `npm run lint` both clean

## Task Commits

Each task followed the RED -> GREEN TDD cycle with two commits:

1. **Task 1: 10-category raw ratio formulas + weighted category scores (RED)** - `d29f627` (test)
2. **Task 1: 10-category raw ratio formulas + weighted category scores (GREEN)** - `69a2bce` (feat)
3. **Task 2: stage-ladder lookup (RED)** - `a4f7716` (test)
4. **Task 2: stage-ladder lookup (GREEN)** - `0b48fef` (feat)

**Plan metadata:** _pending_ (docs: complete plan — committed after this summary)

_TDD tasks each produced two commits (test -> feat); no refactor commit was needed for either task._

## Files Created/Modified
- `lib/scoring/categoryFormulas.ts` - `CATEGORY_WEIGHTS` + `businessProcessRatio`, `technologyRatio`, `dataRatio`, `aiAdoptionRatio`, `automationRatio`, `aiAgentsRatio`, `securityRatio`, `peopleRatio`, `leadershipRatio`, `innovationRatio`, and the `CATEGORY_RATIO_FNS` lookup map
- `lib/scoring/calculateScore.ts` - `calculateCategoryScores(input)` and `calculateTotalScore(scores)`
- `lib/scoring/calculateScore.test.ts` - 5 tests: leadership ratio at 0/6, 3/6, 6/6 goals selected; total-score rounding; 0-100 clamping (130 -> 100, -10 -> 0)
- `lib/scoring/stage.ts` - `getStage(totalScore): Stage`, the 6-band ladder
- `lib/scoring/stage.test.ts` - 5 tests covering both edges of every band (0, 20/21, 40/41, 60/61, 75/76, 90/91, 100)

## Decisions Made
- `getStage` implemented with `<=` boundary comparisons per band in ascending order, matching the design spec's inclusive-upper-bound table (e.g. 20 is Level 1, 21 is Level 2) exactly — no rounding ambiguity since `totalScore` is always an integer by the time it reaches `getStage` (produced by `calculateTotalScore`'s `Math.round`).

## Deviations from Plan

None - plan executed exactly as written. All formulas, weights, denominators, and stage-ladder boundaries match the plan's `<action>` and `<behavior>` specifications and the design spec's Scoring Engine section verbatim.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. This plan is pure in-process TypeScript with no I/O.

## Next Phase Readiness

- `calculateCategoryScores`, `calculateTotalScore`, and `getStage` are exported and ready to be called from the API route in Plan 01-04 (results computation)
- The scoring functions read the full `ScoringInput` shape, so Phase 2's remaining 8 wizard steps (departments, techStack, dataReadiness, aiAdoption, automation, agentInterest, security, employeeReadiness) will populate real ratios with zero changes to this code
- Phase 3's industry/size-adjustment layer (ENG-02/ENG-03) can wrap `CATEGORY_WEIGHTS` with its multiplier table without touching the ratio functions
- Note for Plan 01-04: `calculateCategoryScores` returns raw per-category scores (not rounded) — round only at the point of persistence/display if the `Assessment.categoryScores` column expects integers, per the design spec

---
*Phase: 01-foundation-end-to-end-skeleton*
*Completed: 2026-07-16*

## Self-Check: PASSED

All 5 key files listed under Key Files (created) verified present on disk, plus the SUMMARY.md itself. All 4 task commit hashes (`d29f627`, `69a2bce`, `a4f7716`, `0b48fef`) verified present in `git log --oneline --all`.
