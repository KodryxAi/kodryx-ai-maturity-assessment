---
phase: 03-industry-size-adjusted-scoring-engine
plan: 02
subsystem: scoring-engine
tags: [scoring, tdd, stage-guidance, data-completeness]

requires: []
provides:
  - "getStage(totalScore) returning a fully-populated Stage (level, label, whatThisMeans, whatsNext)"
  - "computeDataCompleteness(input) classifying a ScoringInput as thin/complete against a 68-item optional-checklist denominator"
affects:
  - lib/scoring/calculateScore.ts
  - results page (Plan 03-03 wiring)

tech-stack:
  added: []
  patterns:
    - "Static per-stage guidance copy embedded directly in the getStage lookup, no i18n/config indirection"
    - "Ratio-below-threshold classifier pattern (touched/total < 0.5) for completeness signals, mirroring the size-normalization ratio pattern from 03-01"

key-files:
  created:
    - lib/scoring/completeness.ts
    - lib/scoring/completeness.test.ts
  modified:
    - lib/types/assessment.ts
    - lib/scoring/stage.ts
    - lib/scoring/stage.test.ts

key-decisions:
  - "TOTAL_OPTIONAL_CHECKLIST_ITEMS restricted to the 5 multi-select checklist sections (departments[].capabilities, techStack.systems, aiAdoption.toolsInUse, automation.processesAutomated, security.checklist) — rating sliders always carry a default value and agentInterest.agentTypes is an opportunity signal for Phase 4, not a completeness signal"

patterns-established:
  - "Ratio-below-0.5-threshold classifier for completeness signals"

requirements-completed: [ENG-04, ENG-05]

duration: 4min
completed: 2026-07-17
---

# Phase 3 Plan 2: Stage ladder guidance text + data-completeness computation Summary

**getStage returns static per-stage "what this means"/"what's next" guidance copy for all 6 bands (ENG-04), and a new computeDataCompleteness classifies submissions as "thin" or "complete" against a 68-item optional-checklist denominator (ENG-05) — both pure, fully-tested functions with zero wiring into the results page or API route yet.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-17T13:29:43+05:30
- **Completed:** 2026-07-17T13:31:23+05:30
- **Tasks:** 2 (both TDD)
- **Files modified:** 5 (2 created, 3 modified)

## Accomplishments

- **ENG-04:** `Stage` interface extended with `whatThisMeans`/`whatsNext`; `getStage` now returns exact, distinct 1-sentence guidance copy for all 6 named stages, with every existing boundary condition (0/20/21/40/41/60/61/75/76/90/91/100) and `level`/`label` value unchanged.
- **ENG-05:** New `lib/scoring/completeness.ts` exports `TOTAL_OPTIONAL_CHECKLIST_ITEMS` (68 = 30 department capabilities + 8 systems + 10 AI tools + 9 automation processes + 11 security items), `countTouchedOptionalItems(input)`, and `computeDataCompleteness(input)` returning `"thin"` when touched/total < 0.5, else `"complete"`.

## Task Commits

Each task followed strict RED → GREEN TDD:

1. **Task 1: Stage ladder guidance text (ENG-04)**
   - `1e18e3c` (test) — RED: rewrote all 5 `stage.test.ts` blocks with expected `whatThisMeans`/`whatsNext`; confirmed 5/5 failing against the old 2-field `Stage` shape.
   - `abd357d` (feat) — GREEN: extended `Stage` interface and `getStage`; all 5 tests pass.
2. **Task 2: Data-completeness computation (ENG-05)**
   - `f6ed765` (test) — RED: new `completeness.test.ts` (4 tests) referencing the not-yet-existing `./completeness` module; confirmed failing (module not found).
   - `1ebb3e9` (feat) — GREEN: created `lib/scoring/completeness.ts`; all 4 tests pass.

**Plan metadata:** (this commit, pending) `docs(03-02): complete stage guidance + data-completeness plan`

## Files Created/Modified

- `lib/types/assessment.ts` - `Stage` interface gains `whatThisMeans: string; whatsNext: string;`
- `lib/scoring/stage.ts` - `getStage` returns full `Stage` shape with static per-band guidance copy
- `lib/scoring/stage.test.ts` - all 5 boundary tests updated to assert the 2 new fields
- `lib/scoring/completeness.ts` (new) - `TOTAL_OPTIONAL_CHECKLIST_ITEMS`, `countTouchedOptionalItems`, `computeDataCompleteness`
- `lib/scoring/completeness.test.ts` (new) - 4 tests: denominator value, thin case, complete case, all-undefined-sections case

## Decisions Made

- Restricted the "optional checklist items" denominator to exactly the 5 multi-select sections named in the plan (departments capabilities, systems, AI tools, automation processes, security checklist) — rating-slider sections (`departments[].rating`, `dataReadiness.*`, `employeeReadiness.*`) always carry a default value and can't signal "untouched," and `agentInterest.agentTypes` is reserved as a Phase 4 opportunity/interest signal rather than a maturity-completeness one. Documented inline in `completeness.ts` per the plan's instruction.

## Deviations from Plan

None - plan executed exactly as written. All copy text, field names, boundary values, and the 68-item denominator match the plan's `<action>`/`<behavior>` blocks verbatim.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None - both functions are pure business logic, fully implemented and tested, with no UI or data-flow stubs.

## Threat Flags

None - no new trust boundaries, I/O, or network/auth surface introduced. Confirms the plan's own threat_model assessment (pure computation over already-typed in-process values).

## Next Phase Readiness

`getStage` and `computeDataCompleteness` are both ready for Plan 03-03 to wire into the API route (`app/api/assessments/[id]/route.ts` or equivalent) and the results page, without touching any file from this plan.

---
*Phase: 03-industry-size-adjusted-scoring-engine*
*Completed: 2026-07-17*

## Self-Check: PASSED

- FOUND: lib/scoring/completeness.ts
- FOUND: lib/scoring/completeness.test.ts
- FOUND: lib/scoring/stage.ts
- FOUND: lib/scoring/stage.test.ts
- FOUND: lib/types/assessment.ts
- FOUND: commit 1e18e3c
- FOUND: commit abd357d
- FOUND: commit f6ed765
- FOUND: commit 1ebb3e9
