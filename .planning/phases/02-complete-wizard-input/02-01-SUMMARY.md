---
phase: 02-complete-wizard-input
plan: 01
subsystem: ui
tags: [react, nextjs, typescript, wizard, reducer, vitest]

# Dependency graph
requires:
  - phase: 01-foundation-video-pipeline
    provides: WizardShell/wizardReducer 2-step skeleton, ScoringInput/Departments/TechStackAnswers/DataReadinessAnswers types (already defined, unused until this plan), StepCompanyProfile.tsx brand-styling precedent
provides:
  - Full 10-section WizardAnswers contract (departments, techStack, dataReadiness, aiAdoption, automation, agentInterest, security, employeeReadiness added as required fields)
  - lib/constants/wizardOptions.ts with all Step 3-9 option lists (SYSTEMS_OPTIONS, API_MATURITY_OPTIONS, AI_TOOLS_OPTIONS, AI_ADOPTION_FREQUENCY_OPTIONS, AUTOMATION_PROCESS_OPTIONS, AGENT_TYPE_OPTIONS, SECURITY_CHECKLIST_OPTIONS, DEPARTMENT_CONFIG)
  - wizardReducer.ts with all 8 new UPDATE_* actions and TOTAL_WIZARD_STEPS=5 state-machine bound
  - StepBusinessProcess, StepTechnology, StepDataReadiness step components wired into WizardShell as steps 2-4
affects: [02-02, 02-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Option-list constants centralized in lib/constants/wizardOptions.ts, string values/order load-bearing against lib/scoring/categoryFormulas.ts denominators"
    - "DEPARTMENT_CONFIG-driven rendering (map over config array) instead of hardcoded per-department JSX blocks"
    - "Each UPDATE_* reducer action follows the same immutable spread-merge pattern (spread sub-object, spread payload on top)"

key-files:
  created:
    - lib/constants/wizardOptions.ts
    - components/wizard/StepBusinessProcess.tsx
    - components/wizard/StepTechnology.tsx
    - components/wizard/StepDataReadiness.tsx
  modified:
    - lib/types/assessment.ts
    - components/wizard/wizardReducer.ts
    - components/wizard/wizardReducer.test.ts
    - components/wizard/WizardShell.tsx

key-decisions:
  - "WizardShell's renderStep() switch has no default case (relies on TypeScript inference of undefined return for unreachable branches) once all 5 cases 0-4 exist, matching the plan's explicit instruction to remove the temporary Task-2 fallback in Task 3"
  - "TOTAL_STEPS local const in WizardShell.tsx replaced by TOTAL_WIZARD_STEPS imported from wizardReducer.ts, making the reducer the single source of truth for step count"

patterns-established:
  - "Non-blocking validity: slider-only steps (BusinessProcess, DataReadiness) always report onValidityChange(true) since 0 is a legitimate default rating; only steps with a required select (Technology's apiMaturity) block Next"

requirements-completed: [WIZ-03, WIZ-04, WIZ-05]

duration: 25min
completed: 2026-07-17
---

# Phase 02 Plan 01: Wizard Contract Extension + Steps 2-4 Summary

**Extended WizardAnswers/wizardReducer to a full 10-section, 5-step state machine and shipped 3 new brand-styled wizard steps (Business Process, Technology, Data Readiness) taking the assessment wizard from 2 to 5 navigable steps.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-07-17T05:20:00Z
- **Completed:** 2026-07-17T05:44:51Z
- **Tasks:** 3 completed (Task 1 as TDD RED/GREEN pair)
- **Files modified:** 8 (4 created, 4 modified)

## Accomplishments
- `WizardAnswers` now covers all 10 assessment sections (contact, companyProfile, departments, techStack, dataReadiness, aiAdoption, automation, agentInterest, security, employeeReadiness) — `ScoringInput` required no changes since its matching 8 fields were already optional
- `wizardReducer.ts` exposes `TOTAL_WIZARD_STEPS = 5` and 8 new isolated `UPDATE_*` actions, each verified by unit tests to merge only into their own sub-object
- 3 new fully brand-styled (`kx-navy`/`kx-gold`/`kx-caption`, `accent-kx-gold` sliders, `accent-kx-navy` checkboxes) wizard steps wired into `WizardShell.tsx` as steps 2-4, each driven by config/option-list constants rather than hardcoded JSX blocks

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Rewrite reducer boundary tests for 5-step wizard** - `f4c5d59` (test)
2. **Task 1 (GREEN): Extend WizardAnswers, wizardOptions, wizardReducer** - `992fae7` (feat)
3. **Task 2: Build StepBusinessProcess, wire in as step 2** - `5d24406` (feat)
4. **Task 3: Build StepTechnology + StepDataReadiness, wire in as steps 3-4** - `b074647` (feat)

**Plan metadata:** (pending) `docs(02-01): complete wizard contract extension plan`

_Note: Task 1 is `tdd="true"` — RED (failing tests against unimplemented reducer changes) then GREEN (implementation) commits, per plan._

## Files Created/Modified
- `lib/types/assessment.ts` - `WizardAnswers` extended with 8 new required sections
- `lib/constants/wizardOptions.ts` - All Step 3-9 option-list constants + `DEPARTMENT_CONFIG` (new file)
- `components/wizard/wizardReducer.ts` - `TOTAL_WIZARD_STEPS=5`, 8 new `UPDATE_*` actions/cases, `stepIndex: number`, NEXT/BACK clamped via `Math.min`/`Math.max`
- `components/wizard/wizardReducer.test.ts` - Rewrote 2-step boundary tests for the 5-step machine, added `UPDATE_DEPARTMENT`/`UPDATE_TECH_STACK` isolation tests
- `components/wizard/StepBusinessProcess.tsx` - 6-department slider + capability checklist step (new file)
- `components/wizard/StepTechnology.tsx` - Systems multi-select + API maturity required select (new file)
- `components/wizard/StepDataReadiness.tsx` - 4-dimension data readiness slider step (new file)
- `components/wizard/WizardShell.tsx` - `TOTAL_STEPS` replaced with imported `TOTAL_WIZARD_STEPS`; ternary rendering replaced with a `switch(state.stepIndex)` covering cases 0-4

## Decisions Made
- Kept `renderStep()` switch without a `default` case once all 5 cases existed (Task 3), per the plan's explicit instruction — TypeScript's structural typing tolerates the implicit `undefined` fallthrough since `state.stepIndex` isn't a literal union, and `npx tsc --noEmit` confirmed no type error resulted
- No changes to `ScoringInput` — confirmed structurally that a fully-populated `WizardAnswers` satisfies `ScoringInput`'s optional matching fields without modification

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Plans 02-02 and 02-03 can now add the remaining 5 step components (AI Adoption, Automation, Agent Interest, Security, Employee Readiness) purely by adding step files and bumping `TOTAL_WIZARD_STEPS` — no further reducer/type rewrites needed, since the full contract surface is defined here
- `npm run build`, `npm run lint`, and `npm run test` all exit 0 with the wizard navigable through 5 real steps with zero data loss across Back/Next

---
*Phase: 02-complete-wizard-input*
*Completed: 2026-07-17*

## Self-Check: PASSED

All 8 created/modified files verified present on disk. All 4 task commits (f4c5d59, 992fae7, 5d24406, b074647) verified present in git log.
