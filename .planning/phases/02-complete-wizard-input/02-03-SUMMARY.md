---
phase: 02-complete-wizard-input
plan: 03
subsystem: api
tags: [nextjs, prisma, sqlite, vitest, tdd, wizard]

# Dependency graph
requires:
  - phase: 02-complete-wizard-input
    plan: 01
    provides: Full 10-section WizardAnswers contract, wizardOptions.ts option lists (SECURITY_CHECKLIST_OPTIONS, DEPARTMENT_CONFIG, etc.), UPDATE_SECURITY/UPDATE_EMPLOYEE_READINESS reducer actions
  - phase: 02-complete-wizard-input
    plan: 02
    provides: TOTAL_WIZARD_STEPS=8 state-machine bound, checkbox multi-select pattern precedent
  - phase: 01-foundation-end-to-end-skeleton
    plan: 04
    provides: companyProfile JSON-cast-through-unknown Prisma pattern, POST/GET /api/assessments route shape
provides:
  - StepSecurity, StepEmployeeReadiness step components wired into WizardShell as final steps 8-9
  - TOTAL_WIZARD_STEPS=10 (final wizard step count)
  - POST /api/assessments validating and persisting all 10 WizardAnswers sections (previously only companyProfile)
  - GET /api/assessments/[id] categoryScores now non-zero across all 10 CategoryKey entries for a full submission
affects: [phase-3-industry-size-adjustment, phase-4-swot-roadmap, phase-5-wow-factor-results]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "API route array-field validation: isSubsetNoDuplicates(value, options) helper checks every entry is a member of the option-list constant AND that new Set(value).size === value.length, rejecting both forged values and ratio-inflating duplicates in one pass"
    - "API route numeric-field validation: isFiniteInRange(value, min, max) helper rejects NaN/Infinity/out-of-range/string-typed ratings uniformly across departments[].rating, dataReadiness.*, employeeReadiness.*"
    - "Next.js route handlers tested directly in vitest by importing POST/GET and constructing native Request objects — no HTTP server needed for route-level tests, reusing the same real dev.db Prisma client the app uses (no test-DB isolation infra exists yet in this project)"

key-files:
  created:
    - components/wizard/StepSecurity.tsx
    - components/wizard/StepEmployeeReadiness.tsx
    - app/api/assessments/route.test.ts
  modified:
    - components/wizard/wizardReducer.ts
    - components/wizard/WizardShell.tsx
    - app/api/assessments/route.ts

key-decisions:
  - "departments cast through unknown before Prisma.InputJsonValue (and the same for the other 7 newly-persisted JSON sections), reusing the exact companyProfile escape-hatch pattern documented in Plan 01-04's SUMMARY"
  - "Test file imports POST/GET route handlers directly rather than spinning up an HTTP server, and writes real rows to the local dev.db (matching this project's existing lack of test-DB isolation); afterAll deletes rows by their captured id to avoid polluting dev.db with test-only data"

requirements-completed: [WIZ-09, WIZ-10, WIZ-11]

# Metrics
duration: ~25min
completed: 2026-07-17
---

# Phase 02 Plan 03: Security, Employee Readiness Steps + Full POST Validation Summary

**Closes the 10-step wizard: added the final 2 step components (Security & Governance checklist, Employee Readiness sliders), then extended `POST /api/assessments` (TDD RED→GREEN) to validate and persist all 8 previously-`JsonNull` sections, so a full submission now drives non-zero scores across all 10 scoring categories instead of just Company Profile.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-07-17T06:50:00Z (approx.)
- **Completed:** 2026-07-17T07:02:00Z
- **Tasks:** 3 (Tasks 1-2 fully implemented; Task 3 checkpoint satisfied via automated equivalent — see below)
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments
- `StepSecurity.tsx` renders the 11-item security/governance checklist multi-select (mirrors `StepAgentInterest.tsx`'s toggle pattern), wired into `WizardShell` at step index 8
- `StepEmployeeReadiness.tsx` renders 5 range sliders (AI Skills, Training, Change Readiness, Leadership Support, Innovation Culture), mirrors `StepDataReadiness.tsx`'s pattern, wired in at step index 9
- `TOTAL_WIZARD_STEPS` bumped 8 → 10 (final); `WizardShell.tsx`'s `renderStep()` switch now covers cases 0-9, the full 10-step wizard, with the Submit button firing at stepIndex 9
- `POST /api/assessments` gained 8 new first-failure-wins validation blocks (departments, techStack, dataReadiness, aiAdoption, automation, agentInterest, security, employeeReadiness), each returning 400 on invalid input, matching the existing companyProfile pattern exactly
- `scoringInput` and `prisma.assessment.create` now use the full validated 10-section body; only the 6 out-of-scope Phase 3/4 report fields (benchmark, swot, opportunityMatrix, risk, roadmap, roi) remain `Prisma.JsonNull`
- Verified end-to-end via automated HTTP-level checks (documented below): a fully-populated submission now scores 54/100 (Level 3 — AI Exploring) versus a companyProfile-only submission's 3/100 (Level 1 — AI Unaware) from Plan 01-04's verification, confirming all 9 newly-wired categories now contribute real signal

## Task Commits

Each task was committed atomically:

1. **Task 1: Build StepSecurity + StepEmployeeReadiness, wire in as steps 8-9** - `af58e99` (feat)
2. **Task 2 (RED): Add failing tests for full 10-section POST validation** - `71ec084` (test)
3. **Task 2 (GREEN): Validate and persist all 10 WizardAnswers sections** - `c258821` (feat)
4. **Task 3: End-to-end 10-step wizard walkthrough** - automated verification substituted (non-interactive session); no code changes, no commit for this task

**Plan metadata:** (pending) `docs(02-03): complete security/employee-readiness/full-validation plan`

_Note: Task 2 followed the TDD RED→GREEN cycle per its `tdd="true"` flag._

## Files Created/Modified
- `components/wizard/StepSecurity.tsx` - Security/governance checklist multi-select, always valid (new file)
- `components/wizard/StepEmployeeReadiness.tsx` - 5-dimension readiness sliders, always valid (new file)
- `components/wizard/wizardReducer.ts` - `TOTAL_WIZARD_STEPS` bumped 8 → 10 (final value)
- `components/wizard/WizardShell.tsx` - Added imports + `case 8`/`case 9` to `renderStep()`
- `app/api/assessments/route.ts` - 8 new validation blocks, `isFiniteInRange`/`isSubsetNoDuplicates` helpers, full `scoringInput` construction, real JSON persistence for all 8 previously-`JsonNull` columns
- `app/api/assessments/route.test.ts` - 4 vitest cases covering the full-body happy path and 3 validation-failure behaviors (new file)

## Decisions Made
- Kept the checkbox-multi-select and slider patterns byte-for-byte identical to their Plan 02-01/02-02 precedents (`StepAgentInterest.tsx`, `StepDataReadiness.tsx`) rather than extracting shared components, consistent with prior plans' scoping decision
- `isFiniteInRange`/`isSubsetNoDuplicates` extracted as small local helpers in `route.ts` rather than inlined per-field, since the same two checks repeat across 6+ of the 8 new sections and the plan's threat model (T-02-04, T-02-05) explicitly calls out both as required mitigations
- Test file talks directly to the real local `dev.db` via the imported Prisma client (no mocking, no test-DB isolation) since that's the only pattern this project has established so far (Plan 01-04's curl-based verification did the same, just outside vitest); `afterAll` deletes only the ids the "happy path" test explicitly created to avoid leaving orphaned rows from that test, though the 3 negative-test POSTs (bodies asserted to be invalid) in the RED phase did succeed and create rows before the fix landed — those were manually purged before committing the GREEN implementation (see Issues Encountered)

## Deviations from Plan

None - plan executed exactly as written. The TDD RED/GREEN cycle for Task 2 and the automated substitution for Task 3's human-verify checkpoint were both explicit plan/session instructions, not deviations.

## Issues Encountered

During the RED phase of Task 2 (tests intentionally failing against the pre-fix `route.ts`), 3 of the 4 new tests exercised POST bodies that were *supposed* to be rejected but weren't yet (no validation existed), so those requests succeeded and wrote throwaway rows into the local `dev.db`. These were manually deleted (`prisma.assessment.deleteMany({ where: { companyName: "Acme Co" } })`) before proceeding to GREEN, so no stray RED-phase artifacts remain in the local dev database.

## User Setup Required

None - no external service configuration required.

## Task 3: End-to-End 10-Step Walkthrough — Automated Verification Substituted

This is a fully automated, non-interactive execution session with no human present to type "approved" at the plan's `checkpoint:human-verify` gate. Per the session's explicit instruction, the manual walkthrough was performed via automated HTTP-level equivalents instead of waiting indefinitely on human input:

1. Started `npm run dev -- --port 3103` — confirmed clean startup (`✓ Ready in 1931ms`), no console errors.
2. Issued `POST /api/assessments` with a fully-populated 10-section body (contact: Priya Sharma / priya@acmecorp.com / Acme Manufacturing Co; companyProfile: Manufacturing / 51-200 / $5M-$20M; all 6 departments rated 2-4 with capabilities checked; techStack: 3 systems + Modern API maturity; dataReadiness: 4 sliders at 3-4; aiAdoption: 2 tools + Daily; automation: 3 processes; agentInterest: 2 agent types; security: 3 checklist items; employeeReadiness: 5 sliders at 3-4) — received `201` with `{"id":"cmrol9slw0000ife8ml1zm9m9"}`.
3. Issued `GET /api/assessments/cmrol9slw0000ife8ml1zm9m9` — received `200`; `categoryScores` had all 10 `CategoryKey` entries strictly greater than 0 (businessProcess 12.67, technology 7.81, data 7.00, aiAdoption 4.33, automation 3.33, aiAgents 3.83, security 1.36, people 3.67, leadership 6.50, innovation 3.00), `totalScore: 54`, `stage: "Level 3 — AI Exploring"`.
4. Issued `GET /results/cmrol9slw0000ife8ml1zm9m9` — received `200`; rendered HTML contained the score `54` inside the `text-kx-gold` metric element and the stage label `Level 3 — AI Exploring` — visibly different from Plan 01-04's companyProfile-only verification score of `3` / `Level 1 — AI Unaware` for the same style of submission, confirming the 9 newly-wired categories now materially move the total.
5. Issued `POST /api/assessments` with `departments.sales` deleted — received `400` with `{"error":"departments is invalid"}`.
6. Issued `POST /api/assessments` with `security.checklist: ["Not-A-Real-Control"]` — received `400` with `{"error":"security is invalid"}`.
7. Issued `POST /api/assessments` with `security.checklist: ["MFA","MFA"]` (duplicate valid entry) — received `400` with `{"error":"security is invalid"}`.
8. Issued `GET /results/does-not-exist-xyz` — received `404`, confirming no crash on an invalid id.
9. Reviewed the dev server's stdout across the full session — no errors or warnings beyond the expected route-compilation logs.

The dev server (port 3103) was stopped (`taskkill`) immediately after verification completed.

**Result:** All observable behaviors the human walkthrough's steps 5-6 would have checked (single POST → full-section Prisma persistence → all-10-category scoring → stable, reloadable `/results/[id]` rendering a visibly higher score than a partial submission) are confirmed working via automated HTTP-level checks, plus the 3 validation-failure behaviors from Task 2's `<behavior>` block. Steps 1-4 of the human walkthrough (visual progress-bar/transition verification, manual Back/Next data-loss check, single-network-call DevTools confirmation) require an actual browser and were not independently re-verified in this automated pass — they rely on `WizardShell.tsx`'s existing, unmodified 200ms fade/slide transition logic and `NEXT`/`BACK` reducer behavior, both already covered by `wizardReducer.test.ts`'s 8 passing unit tests and unchanged by this plan's `case 8`/`case 9` additions.

Automated verification substituted for interactive human-verify checkpoint (non-interactive session).

The verification-created row (`cmrol9slw0000ife8ml1zm9m9`) was left in the local gitignored `dev.db`, consistent with Plan 01-04's documented precedent that these are harmless local dev-only rows not committed to git.

## Next Phase Readiness

- `npm run build`, `npm run lint`, and `npx vitest run` (23 tests across 5 files) all exit 0
- Phase 2's full success criteria are met: all 10 wizard steps are real, wired, and navigable; `POST /api/assessments` validates and persists the complete `WizardAnswers` shape; a full submission drives non-zero scores across all 10 categories, verified via `GET /api/assessments/[id]`
- Phase 3 (industry/size adjustment, ENG-02/ENG-03) can now build directly on top of a fully-populated `ScoringInput`, since every section it needs to adjust is real, validated data rather than `undefined`
- Note for Phase 3: `dataCompleteness` is still written as `null` on every submission (unchanged, out of this plan's scope) — Phase 3/ENG-05's conditional fast-pass-caption logic still needs that field wired

---
*Phase: 02-complete-wizard-input*
*Completed: 2026-07-17*

## Self-Check: PASSED

All 7 files (6 created/modified + this SUMMARY.md) verified present on disk. All 3 task commit hashes (`af58e99`, `71ec084`, `c258821`) verified present in `git log --oneline --all`.
