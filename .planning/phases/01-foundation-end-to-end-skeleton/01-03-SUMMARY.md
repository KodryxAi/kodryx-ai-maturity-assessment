---
phase: 01-foundation-end-to-end-skeleton
plan: 03
subsystem: ui
tags: [nextjs, react, typescript, tailwindcss, useReducer, forms, vitest, tdd]

# Dependency graph
requires:
  - phase: 01-foundation-end-to-end-skeleton (Plan 01)
    provides: WizardAnswers/ContactInfo/CompanyProfileAnswers TS contracts, companyProfile option-list constants, kx-* Tailwind brand tokens, kx-caption utility class
provides:
  - Interactive 2-step /assessment wizard (Registration + Company Profile) with local step/answers state
  - components/wizard/wizardReducer.ts pure reducer (stepIndex + answers state machine), unit-tested
  - Brand-styled ProgressBar with 200ms navy-track/gold-fill transition
  - WizardShell onSubmit contract: (answers: WizardAnswers) => Promise<{ ok: true; id: string } | { ok: false; error: string }>
affects: [01-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Wizard state machine extracted into a pure, dependency-free reducer (wizardReducer.ts) separate from the WizardShell component — keeps TDD tests DOM-free and fast (no jsdom/RTL needed), consumed via useReducer"
    - "Step components own their own validity computation and report it up via an onValidityChange(boolean) callback rather than the parent re-deriving validity from raw answers"
    - "'Manually edited' field tracking (blendedHourlyCost prefill) uses local useState scoped to the step component, per plan; resets on step remount (acceptable per plan wording — only guaranteed within a single visit to the step)"

key-files:
  created:
    - components/wizard/wizardReducer.ts
    - components/wizard/wizardReducer.test.ts
    - components/wizard/ProgressBar.tsx
    - components/wizard/WizardShell.tsx
    - components/wizard/StepRegistration.tsx
    - components/wizard/StepCompanyProfile.tsx
    - app/assessment/page.tsx
  modified: []

key-decisions:
  - "Extracted the reducer (state/actions/initial state) into its own wizardReducer.ts module instead of inlining useReducer's reducer function inside WizardShell.tsx, so Task 1's TDD requirement could be satisfied with plain vitest unit tests against a pure function, with no jsdom/@testing-library dependency to add"
  - "NEXT/BACK actions clamp at the step bounds (0|1) inside the reducer itself rather than relying on the caller to guard — makes the state machine safe against extra dispatches"

patterns-established:
  - "State machines driving multi-step UI flows are extracted as pure reducer modules (state/action types/initial state/reducer fn) exported separately from the component that calls useReducer, enabling reducer-only unit tests without a DOM test environment"

requirements-completed: [WIZ-01, WIZ-02, WIZ-12]

# Metrics
duration: ~18min
completed: 2026-07-16
---

# Phase 1 Plan 03: Assessment Wizard (Registration + Company Profile) Summary

**Two-step assessment wizard at `/assessment` — a TDD-tested `useReducer` state machine (`wizardReducer`) driving a brand-styled progress bar, Registration form, and Company Profile form with industry-default cost prefill, all preserving answers across Back/Next navigation.**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-07-16T16:47:00+05:30 (approx.)
- **Completed:** 2026-07-16T17:04:21+05:30
- **Tasks:** 2 (Task 1 TDD: RED + GREEN; Task 2: forms + route)
- **Files modified:** 7 created

## Accomplishments
- `wizardReducer.ts` — pure, unit-tested state machine: `UPDATE_CONTACT`/`UPDATE_COMPANY_PROFILE` merge partial payloads into the correct sub-object only, `NEXT`/`BACK` clamp at step bounds (0|1), full Back-then-Forward round trip preserves both steps' data
- `ProgressBar.tsx` — navy-track (`bg-kx-grey-100`)/gold-fill (`bg-kx-gold`) bar with `transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]`, "Step X of Y" `kx-caption` label
- `WizardShell.tsx` — `'use client'` host wiring `useReducer(wizardReducer, initialWizardState)` to `ProgressBar` and the current step, 200ms fade+4px-slide transition on step change, brand-styled Back/Next/Submit buttons (`bg-kx-navy`/`border-kx-grey-200`, hover/disabled states, no shadows/gradients), `onSubmit` error surfaced inline without throwing
- `StepRegistration.tsx` — Name/Email/Company (required) + optional Phone, email-format regex validation, reports validity live via `onValidityChange`
- `StepCompanyProfile.tsx` — Industry/Employee Band/Revenue Band/Business Model selects, Leadership Goals checkbox multi-select (optional), Blended Hourly Cost number input that prefills from `INDUSTRY_HOURLY_COST_DEFAULTS[industry]` until the user types into the cost field directly
- `/assessment` route renders `WizardShell` with a placeholder `onSubmit` returning `{ ok: false, error: '...' }` — Plan 01-04 swaps only this function body for the real API call + redirect

## Task Commits

Each task was committed atomically (Task 1 followed RED → GREEN per its `tdd="true"` marking):

1. **Task 1 (RED): failing wizard reducer tests** - `6740e2c` (test)
2. **Task 1 (GREEN): WizardShell state machine + ProgressBar** - `b629feb` (feat)
3. **Task 2: StepRegistration + StepCompanyProfile forms + /assessment route** - `5eb48e8` (feat)

**Plan metadata:** _pending_ (docs: complete plan — committed after this summary)

## Files Created/Modified
- `components/wizard/wizardReducer.ts` - pure reducer: `WizardState`, `WizardAction` union, `initialWizardState`, `wizardReducer()`
- `components/wizard/wizardReducer.test.ts` - 6 vitest unit tests covering initial state, both UPDATE actions' isolation, NEXT/BACK clamping, and Back-then-Forward data preservation
- `components/wizard/ProgressBar.tsx` - presentational progress bar (track/fill divs + caption)
- `components/wizard/WizardShell.tsx` - client component hosting the reducer, step routing, fade transition, Back/Next/Submit buttons, submit error handling
- `components/wizard/StepRegistration.tsx` - Registration form with validity computation
- `components/wizard/StepCompanyProfile.tsx` - Company Profile form with cost-prefill behavior and validity computation
- `app/assessment/page.tsx` - `/assessment` route mounting `WizardShell` with a scoped placeholder `onSubmit`

## Decisions Made
- Split the reducer out of `WizardShell.tsx` into `wizardReducer.ts` specifically so the plan's TDD requirement ("write failing tests first... for the WizardShell state machine logic") could be satisfied with fast, DOM-free vitest unit tests, since the project's `vitest.config.ts` runs in `environment: "node"` with no jsdom/React Testing Library installed. This avoided adding new test-infra dependencies for this plan.
- Followed the plan's literal instruction to track `costManuallyEdited` as local `useState` inside `StepCompanyProfile` (not lifted into the reducer) — this satisfies the plan's stated acceptance criteria (checked within a single visit to the step) and matches the plan's explicit wording ("track a local `costManuallyEdited` boolean").

## Deviations from Plan

None - plan executed exactly as written, including the recently patched Task 1 brand-button-class instructions (Back: `border border-kx-grey-200 text-kx-navy ... disabled:opacity-40 disabled:cursor-not-allowed`; Next/Submit: `bg-kx-navy text-white ... disabled:opacity-40 disabled:cursor-not-allowed`).

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `npm run build`, `npm run test` (17 tests, including the 6 new reducer tests), and `npm run lint` all exit 0
- `/assessment` renders Registration first with the progress bar at 50%, verified via `curl` against a local `npm run dev` server (SSR output contains "Step 1 of 2" and the Registration field labels)
- `onSubmit: (answers: WizardAnswers) => Promise<{ ok: true; id: string } | { ok: false; error: string }>` contract is defined and wired into `app/assessment/page.tsx` with a placeholder body — Plan 01-04 only needs to replace that one function body with the real `fetch('/api/assessments', ...)` call and success redirect; no other file from this plan needs to change
- Note for Plan 01-04: `WizardShell` itself does not hold router access by design (per this plan's `<action>` spec) — any navigation on successful submit must happen inside the `onSubmit` implementation in `app/assessment/page.tsx`, not inside `WizardShell.tsx`

---
*Phase: 01-foundation-end-to-end-skeleton*
*Completed: 2026-07-16*

## Self-Check: PASSED

All 7 files listed under Key Files (created) verified present on disk. All 3 task commit hashes (`6740e2c`, `b629feb`, `5eb48e8`) verified present in `git log --oneline --all`.
