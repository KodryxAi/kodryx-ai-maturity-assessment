---
phase: 03-industry-size-adjusted-scoring-engine
plan: 03
subsystem: scoring-engine
tags: [wiring, results-page, api-route, data-completeness, stage-guidance]

requires:
  - "getAdjustedWeights / SIZE_BAND_BASELINES (Plan 03-01)"
  - "getStage(totalScore).whatThisMeans/whatsNext (Plan 03-02)"
  - "computeDataCompleteness(input) (Plan 03-02)"
provides:
  - "POST /api/assessments persisting a real thin/complete dataCompleteness value"
  - "/results/[id] rendering stage guidance text and a conditional fast-pass caption"
affects:
  - app/api/assessments/route.ts
  - app/api/assessments/route.test.ts
  - "app/results/[id]/page.tsx"

tech-stack:
  added: []
  patterns:
    - "Server Component computes getStage(assessment.totalScore) fresh at render time rather than trusting the persisted stage string, avoiding drift"

key-files:
  created: []
  modified:
    - app/api/assessments/route.ts
    - app/api/assessments/route.test.ts
    - "app/results/[id]/page.tsx"

key-decisions:
  - "Live end-to-end verification (industry scoring divergence, size-band fairness intent, stage guidance rendering, completeness caption toggle) was performed via automated curl POSTs against a locally-started `npm run dev` server instead of an interactive human walkthrough, since this execution session is non-interactive (YOLO mode, no human present to type 'approved')."

requirements-completed: [ENG-04, ENG-05]

duration: 10min
completed: 2026-07-17
---

# Phase 3 Plan 3: Wire scoring/stage/completeness into route.ts + results page Summary

**`POST /api/assessments` now persists a real computed `dataCompleteness` value (replacing the previous hardcoded `null`), and `/results/[id]` now renders the computed stage's `whatThisMeans`/`whatsNext` guidance text plus a fast-pass caption that only appears when the submission is data-thin — closing the loop on Plans 03-01/03-02's pure logic so ENG-02, ENG-04, and ENG-05 are all now visible to a real user.**

## What Was Built

**Task 1 — Persist real `dataCompleteness` (TDD, ENG-05 wiring):**
- `app/api/assessments/route.ts`: imported `computeDataCompleteness` from `lib/scoring/completeness`; replaced the literal `dataCompleteness: null,` line in the `prisma.assessment.create` call with `dataCompleteness: computeDataCompleteness(scoringInput),` — computed from the same already-validated `scoringInput` object used for `calculateCategoryScores`.
- `app/api/assessments/route.test.ts`: extended `fullDepartments()` to accept an optional `capCount = 2` parameter (all existing call sites unaffected by the default); added 2 new tests — POSTing the existing `fullBody()` fixture (20/68 touched) then GETting confirms `dataCompleteness: "thin"`, and POSTing `fullBody({ departments: fullDepartments(5) })` (38/68 touched) then GETting confirms `dataCompleteness: "complete"`.

**Task 2 — Stage guidance text + conditional caption (ENG-04 wiring, ENG-05 display):**
- `app/results/[id]/page.tsx`: imported `getStage` from `lib/scoring/stage`; computes `const stage = getStage(assessment.totalScore);` right after the `notFound()` guard. The stage badge now renders `{stage.label}` (computed fresh, not the persisted string) instead of `{assessment.stage}`. A new `<div className="flex flex-col gap-1">` renders `stage.whatThisMeans` and `stage.whatsNext`, each in a brand-styled `<p className="kx-caption text-kx-grey">`. The pre-existing fast-pass caption paragraph is now wrapped in `{assessment.dataCompleteness === "thin" && (...)}`, so it is completely absent from the rendered HTML — not just hidden — when the submission is `"complete"`.

**Task 3 — End-to-end walkthrough (automated substitute for human-verify checkpoint):**
Since this execution ran in a non-interactive YOLO-mode session with no human present to type "approved," the 4 verification steps from the plan's checkpoint were performed as automated equivalents instead of waiting indefinitely:

1. Started `npm run dev` (localhost:3000). POSTed two payloads with identical raw ratings/checklist selections but different `companyProfile.industry` ("Manufacturing" vs "SaaS / Technology"). Fetched both records via `GET /api/assessments/[id]`:
   - Manufacturing: `categoryScores.businessProcess = 14.12`, `technology = 7.06`, `totalScore = 44`
   - SaaS / Technology: `categoryScores.businessProcess = 9.41`, `technology = 10.20`, `totalScore = 43`
   Category scores and total score are visibly different between the two industries for identical inputs, proving ENG-02 is wired end-to-end (industry weighting is applied, not just unit-tested in isolation).
2. POSTed the same minimally-touched payload (20/68 optional checklist items) and fetched `/results/[id]`: HTML contained the fast-pass caption `"Based on a fast-pass assessment; scores refine with more detail"`.
3. POSTed a heavily-detailed payload (47/68 optional checklist items: 5 capabilities x 6 departments + 5 systems + 4 AI tools + 4 automation processes + 4 security items) and fetched `/results/[id]`: `GET` confirmed `dataCompleteness: "complete"`, and the results page HTML contained exactly 2 `kx-caption` paragraphs (whatThisMeans/whatsNext) with the fast-pass caption entirely absent.
4. Confirmed on both rendered pages that the stage badge (`Level 3 — AI Exploring`, `Level 4 — AI Automation`) is immediately followed by one distinct "what this means" sentence and one distinct "what's next" sentence, both brand-styled with the `kx-caption text-kx-grey` utility classes (Inter 14px, `#6B7280`), matching the project's brand-fidelity requirement.

All 3 verification-only assessment records created during this walkthrough were deleted from `prisma/dev.db` afterward via a one-off cleanup script (not committed — ephemeral, run from the OS temp scratchpad), and the dev server process was terminated. No test-created data was left behind.

## Verification

- `npx vitest run app/api/assessments/route.test.ts` — 6/6 tests pass (4 pre-existing + 2 new).
- `npm run test` (full project suite) — 8 test files, 41 tests, all passing.
- `npx tsc --noEmit` — clean, no type errors.
- `npm run build` — compiles successfully, all 6 routes generated (`/`, `/_not-found`, `/api/assessments`, `/api/assessments/[id]`, `/assessment`, `/results/[id]`).
- `grep -c "dataCompleteness: null" app/api/assessments/route.ts` → `0`.
- `grep -c 'dataCompleteness === "thin"' "app/results/[id]/page.tsx"` → `1`.
- `grep -c "stage.whatThisMeans" "app/results/[id]/page.tsx"` → `1`; `grep -c "stage.whatsNext" "app/results/[id]/page.tsx"` → `1`.
- Live automated walkthrough (see Task 3 above) substituting for the interactive human-verify checkpoint — all 4 steps confirmed via curl against a running dev server.

## TDD Gate Compliance

Task 1 followed strict RED → GREEN:
- `cfec4fa` (test) — RED: 2 new tests added, confirmed failing (`expected null to be 'thin'` / `'complete'`) against the pre-existing hardcoded `null`; all 4 pre-existing tests in the file still passed.
- `d420ac3` (feat) — GREEN: wired `computeDataCompleteness(scoringInput)`; all 6 tests pass.

No REFACTOR commit was needed.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written for Tasks 1 and 2.

### Checkpoint Substitution (not a deviation from correctness, but a process adaptation)

**Task 3 (checkpoint:human-verify)** was executed as an automated equivalent rather than an interactive human walkthrough, because this execution session is non-interactive (YOLO mode, no human present to type "approved" or describe issues). Per the orchestrator's explicit instruction for this run, all 4 `<how-to-verify>` steps were performed via automated curl POSTs against a locally-started dev server instead of waiting indefinitely for human input. This is documented here as **"automated verification substituted for interactive human-verify checkpoint (non-interactive session)."** A human reviewing this summary can re-run the same curl sequence (documented above) to independently confirm the same behavior interactively if desired.

## Known Stubs

None — both wiring points are fully implemented, tested by automated tests, and confirmed live against a running server. No hardcoded/mock data remains in either `route.ts` or the results page.

## Threat Flags

None — no new trust boundaries, I/O, or network/auth surface introduced beyond what the plan's own `<threat_model>` already assessed (both changes read only already-validated in-process values: `scoringInput` post-validation, and `assessment.totalScore`/`assessment.dataCompleteness` already persisted at submission time).

## Self-Check: PASSED

- FOUND: app/api/assessments/route.ts (`computeDataCompleteness(` present, `dataCompleteness: null` absent)
- FOUND: app/api/assessments/route.test.ts (6 tests, all passing)
- FOUND: app/results/[id]/page.tsx (`stage.whatThisMeans`, `stage.whatsNext`, `dataCompleteness === "thin"` all present)
- FOUND: commit cfec4fa
- FOUND: commit d420ac3
- FOUND: commit 227cb95

---
*Phase: 03-industry-size-adjusted-scoring-engine*
*Completed: 2026-07-17*

## Phase 3 Completion

This is the final plan (3 of 3) of Phase 03 — industry-size-adjusted-scoring-engine. All three plans (03-01 industry/size scoring logic, 03-02 stage guidance + completeness logic, 03-03 this plan's wiring) are complete. Phase 3's ROADMAP success criteria — industry-adjusted scoring, size-normalized coverage, 6-stage guidance text, and the fast-pass completeness caption — are now all implemented, tested, and confirmed working end-to-end via a running server.
