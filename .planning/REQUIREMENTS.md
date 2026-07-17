# Requirements: KODRYX AI Maturity Assessment™ (KAMA)

**Defined:** 2026-07-16
**Core Value:** An SMB decision-maker fills out the assessment and walks away with a polished, benchmarked, prioritized AI report in minutes, while KODRYX captures their contact details as a sales lead.

Source: derived directly from the approved design spec at
`docs/superpowers/specs/2026-07-16-kodryx-ai-maturity-assessment-design.md`
(v1.1) — no separate research pass, per user direction to build directly
from the already-approved spec.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Next.js 14 (App Router) + TypeScript project scaffolded with Tailwind CSS
- [x] **FOUND-02**: KODRYX brand tokens (colors, type, spacing, radii from `colors_and_type.css`) wired into the Tailwind theme, available project-wide
- [x] **FOUND-03**: Prisma + SQLite configured with the `Assessment` model from the design spec, migrations run

### Registration & Wizard Input

- [x] **WIZ-01**: User can enter contact info (name, email, company, optional phone) as the first step
- [x] **WIZ-02**: User can complete Company Profile (industry, employee band, revenue band, business model, leadership goals multi-select, blended hourly cost with industry-default prefill)
- [x] **WIZ-03**: User can rate each of 6 departments (Sales, Marketing, HR, Finance, Operations, Support) with a 0-5 maturity slider and a capability checklist
- [x] **WIZ-04**: User can select current systems-in-use and API maturity level
- [x] **WIZ-05**: User can rate 4 data-readiness dimensions (Quality, Security, Accessibility, Knowledge Management)
- [x] **WIZ-06**: User can select AI tools in use and usage frequency
- [x] **WIZ-07**: User can select which business processes are automated
- [x] **WIZ-08**: User can select which AI agent types would be valuable (feeds Opportunity Matrix)
- [x] **WIZ-09**: User can check off security/governance controls in place
- [x] **WIZ-10**: User can rate 5 employee-readiness dimensions (AI Skills, Training, Change Readiness, Leadership Support, Innovation Culture)
- [x] **WIZ-11**: Wizard shows a persistent progress bar and transitions between steps with a subtle (200ms) fade/slide, no jank
- [x] **WIZ-12**: Wizard state persists across steps (no data loss going back/forward) and submits once at the end via `POST /api/assessments`

### Scoring Engine

- [x] **ENG-01**: Total maturity score (0-100) computed from the 10 weighted categories per the spec's formulas
- [x] **ENG-02**: Category weights adjusted by industry multiplier table, then renormalized to 100
- [x] **ENG-03**: Technology/Automation expectations normalized by company employee-count band
- [x] **ENG-04**: Stage (1 of 6 levels) assigned from total score, each with a static "what this means" + "what's next" description
- [x] **ENG-05**: Data-completeness caption shown when fewer than half of optional checklist items were touched

### Auto-Generated Report Content

- [x] **GEN-01**: SWOT generated with gap-specific bullets (naming the actual missing capability/rating, not a generic per-category sentence), capped at 4-5 bullets per quadrant, ranked by adjusted weight × score-gap
- [x] **GEN-02**: Opportunity Matrix generated from `agentInterest` selections cross-referenced with detected gaps, each item scored Impact/Effort/ROI/Priority
- [x] **GEN-03**: Risk Assessment generated for all 7 risk types (Technical, Business, Security, Operational, Compliance, Adoption, Budget) as Low/Medium/High
- [x] **GEN-04**: ROI estimate generated per department with Conservative/Expected/Optimistic ranges, using the user's blended hourly cost input, with an explicit assumptions block shown in the report
- [x] **GEN-05**: 30/90/180/365-day roadmap generated from a base template with 1-2 items swapped per bucket based on lowest-scoring categories
- [x] **GEN-06**: Benchmark comparison (score vs. industry average vs. top quartile) computed from a static per-industry benchmark table
- [x] **GEN-07**: "Recommended First Moves" — top 3 Opportunity Matrix items ranked by (Impact + ROI) / Effort
- [x] **GEN-08**: Executive Summary paragraph generated from a template with slots filled by stage, top strength, top risk, First Moves, and headline ROI

### Results Experience

- [x] **RES-01**: "Analyzing your AI maturity..." transition shown between wizard completion and results page mount
- [x] **RES-02**: Total score shown as an animated radial/arc gauge (navy track, gold fill) that counts up on mount
- [x] **RES-03**: All 10 category scores shown as a radar/spider chart
- [x] **RES-04**: 6 departments shown as a colored heatmap grid
- [x] **RES-05**: Opportunity Matrix shown as an Impact-vs-Effort quadrant plot with ROI-sized bubbles, First Moves visually highlighted
- [x] **RES-06**: ROI ranges shown per department as horizontal range bars
- [x] **RES-07**: Roadmap shown as a horizontal timeline strip across the 4 phases
- [x] **RES-08**: Benchmark bar and Executive Summary + First Moves callout appear at the top of the results page, above the gauge
- [x] **RES-09**: Results page reachable and shareable via a stable `/results/[id]` URL

### PDF Export

- [x] **PDF-01**: User can download a client-side-generated PDF of the full results page (gauge, radar, heatmap, quadrant plot, ROI ranges, timeline, executive summary, First Moves) with KODRYX branding intact

### Admin

- [x] **ADMIN-01**: `/admin` lists all submissions (company, industry, contact, score, stage, submitted date), newest first, no authentication
- [x] **ADMIN-02**: Each admin row links to that submission's `/results/[id]` page

## v2 Requirements

Deferred to future release, per source spec's "Phase 2/3" vision.

### Consulting Workflow

- **V2-01**: Internal consultant dashboard to review/refine/approve AI-generated insights before sharing with the client
- **V2-02**: One-click branded PowerPoint export alongside the PDF

## Out of Scope

| Feature | Reason |
|---------|--------|
| AI/LLM-generated narrative commentary | All generation is rule-based/deterministic for this build — no API cost, latency, or failure mode |
| Multi-tenant auth / user accounts | Single-user/internal tool, local deployment only for v1 |
| Hosted/cloud deployment | Runs on the local machine via `npm run dev` for v1; SQLite file lives on disk |
| Precise ROI calculator with real time-tracking input | Uses industry-benchmark estimates plus one editable hourly-cost input instead |
| Admin review/approval workflow | Deferred to v2 (consultant dashboard) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| WIZ-01 | Phase 1 | Complete |
| WIZ-02 | Phase 1 | Complete |
| WIZ-12 | Phase 1 | Complete |
| ENG-01 | Phase 1 | Complete |
| RES-09 | Phase 1 | Complete |
| WIZ-03 | Phase 2 | Complete |
| WIZ-04 | Phase 2 | Complete |
| WIZ-05 | Phase 2 | Complete |
| WIZ-06 | Phase 2 | Complete |
| WIZ-07 | Phase 2 | Complete |
| WIZ-08 | Phase 2 | Complete |
| WIZ-09 | Phase 2 | Complete |
| WIZ-10 | Phase 2 | Complete |
| WIZ-11 | Phase 2 | Complete |
| ENG-02 | Phase 3 | Complete |
| ENG-03 | Phase 3 | Complete |
| ENG-04 | Phase 3 | Complete |
| ENG-05 | Phase 3 | Complete |
| GEN-01 | Phase 4 | Complete |
| GEN-02 | Phase 4 | Complete |
| GEN-03 | Phase 4 | Complete |
| GEN-04 | Phase 4 | Complete |
| GEN-05 | Phase 4 | Complete |
| GEN-06 | Phase 4 | Complete |
| GEN-07 | Phase 4 | Complete |
| GEN-08 | Phase 4 | Complete |
| RES-01 | Phase 5 | Complete |
| RES-02 | Phase 5 | Complete |
| RES-03 | Phase 5 | Complete |
| RES-04 | Phase 5 | Complete |
| RES-05 | Phase 5 | Complete |
| RES-06 | Phase 5 | Complete |
| RES-07 | Phase 5 | Complete |
| RES-08 | Phase 5 | Complete |
| PDF-01 | Phase 6 | Complete |
| ADMIN-01 | Phase 6 | Complete |
| ADMIN-02 | Phase 6 | Complete |

**Coverage:**
- v1 requirements: 40 total
- Mapped to phases: 40/40
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-16*
*Last updated: 2026-07-16 after roadmap creation (6 phases, full coverage)*
