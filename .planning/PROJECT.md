# KODRYX AI Maturity Assessment™ (KAMA)

## What This Is

A simple, elegant web application that lets a small/medium business complete
a ~15-step (compressed to ~10-screen, 5-8 minute) AI-readiness assessment and
instantly receive an executive-credible report: a maturity score, SWOT,
opportunity matrix, ranged ROI estimate, and a phased transformation
roadmap. It serves two purposes equally: a genuine self-serve deliverable
for the SMB, and a qualified lead-capture funnel for KODRYX AI.

## Core Value

An SMB decision-maker fills out the assessment and walks away with a
polished, benchmarked, prioritized AI report that feels like it came from a
real consulting engagement — in minutes, not weeks — while KODRYX captures
their contact details as a sales lead.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Registration + lead capture (name, email, company, phone)
- [ ] Company Profile step (industry, size, revenue, business model, goals, blended hourly cost)
- [ ] Business Process step — 6 departments, maturity rating + capability checklist each
- [ ] Technology, Data Readiness, AI Adoption, Automation, AI Agent Interest, Security, Employee Readiness steps
- [ ] Rule-based scoring engine — industry-adjusted + size-normalized, weighted to 100
- [ ] Auto-generated SWOT with gap-specific (not generic) bullets
- [ ] Auto-generated Opportunity Matrix (quadrant plot) with Impact/Effort/ROI/Priority
- [ ] Auto-generated Risk Assessment (7 risk types, Low/Medium/High)
- [ ] Department-level ROI estimate with Conservative/Expected/Optimistic ranges and stated assumptions
- [ ] Auto-generated 30/90/180/365-day roadmap
- [ ] Executive report layer — benchmark comparison bar, "Recommended First Moves" callout, templated executive summary
- [ ] Results page with "wow factor" visuals — animated score gauge, radar chart, department heatmap, quadrant plot, roadmap timeline
- [ ] Client-side PDF export of the full branded report
- [ ] Admin list view (`/admin`, no auth) of all submissions
- [ ] Full KODRYX brand system applied throughout (Navy/Gold/white, Poppins/Inter, hairline borders, minimal motion)

### Out of Scope

- Consultant review/approval workflow before sharing with client — future phase per source spec
- One-click PowerPoint export — future phase
- AI/LLM-generated narrative commentary — this build is 100% rule-based/deterministic, no API cost or latency
- Multi-tenant auth, user accounts, hosted/cloud deployment — local machine only for v1
- Precise ROI calculator with real time-tracking input — uses benchmark-based estimates with one editable cost input instead

## Context

- Source spec: `../KODRYX AI Maturity Assessment™.txt` — the original 15-step,
  120-150 question enterprise consulting version this product compresses.
- Design spec (approved, v1.1): `docs/superpowers/specs/2026-07-16-kodryx-ai-maturity-assessment-design.md`
  — full architecture, data model, scoring formulas, SWOT/ROI generation
  rules, and "wow factor" results experience. This is the authoritative
  source for phase planning; do not re-derive these decisions.
- Brand design system: `C:\Vibe Code\00 Kodryx AI Design System\` — canonical
  colors/type/spacing tokens (`colors_and_type.css`), logo assets, and brand
  rules (`README.md`). All UI must follow this system exactly — Kodryx Navy
  `#0E2A3A`, Kodryx Gold `#C9A24D`, white background, Poppins/Inter, hairline
  borders, no shadows/gradients, minimal (200-250ms) motion only.
- Company context: KODRYX AI is a DPIIT-certified India-based enterprise AI
  company; this tool is both a product and a lead-generation asset for their
  consulting pipeline.

## Constraints

- **Tech stack**: Next.js 14 (App Router) + TypeScript, Prisma + SQLite
  (file-based, no external services), Recharts for data viz, client-side
  PDF export (react-to-print/html2pdf) — locked in by the approved design
  spec, do not substitute.
- **No authentication**: single-user/internal-only tool, local deployment
  only for v1 — admin view has no login.
- **Scoring**: 100% rule-based/deterministic — no AI/LLM calls anywhere in
  the scoring, SWOT, ROI, or roadmap generation.
- **Brand fidelity**: every screen must match the KODRYX design system
  exactly (see Context above) — this is a hard requirement, not a
  suggestion, since the app doubles as a KODRYX marketing surface.
- **UI/UX bar**: "simple, very elegant, smooth touch and feel" — explicit
  user requirement for this build. Subtle transitions, no jank, no visual
  clutter, premium/institutional feel (per brand rules: no bounces, no
  gradients, no big motion).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep all 15 conceptual steps, compress each to 1-2 interactions | User wanted the full structure preserved but fast completion for SMBs | — Pending |
| Next.js + Prisma + SQLite, no external services | Simplicity, zero hosting cost, runs entirely locally for v1 | — Pending |
| Rule-based scoring/SWOT/ROI, no AI calls | Predictable, free, no latency/failure mode; sufficient given the level of detail collected | — Pending |
| Client-side PDF export | Avoids server-side rendering dependency, fastest to build | — Pending |
| Industry + size-adjusted scoring (v1.1) | User feedback: flat scoring read as generic for executives | — Pending |
| Department-level ranged ROI instead of one number (v1.1) | User feedback: ROI was "biggest weakness," felt like a black box | — Pending |
| Executive summary + benchmark + First Moves layer (v1.1) | User feedback: needed more prioritization/benchmarking for executive audience | — Pending |
| GSD workflow config: YOLO mode, standard granularity, research skipped | Spec already fully decided during brainstorming; user said "go ahead and build" — skip redundant process | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-16 after initialization*
