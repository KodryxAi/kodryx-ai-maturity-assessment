# KODRYX AI Maturity Assessment™ (KAMA) — Design Spec

Date: 2026-07-16
Status: Approved for planning (v1.1 — executive-grade refinements)

## Revision note (v1.1)

After reviewing v1.0, the user rated the MVP 9.2/10 overall but flagged four
areas that read as generic/simplistic for an executive audience: Scoring
Engine, SWOT Generation, ROI Calculation, and Executive Value. Root cause:
v1.0 scored and reported every company identically regardless of size or
industry, and presented single-point estimates without context. v1.1 adds:
industry/size-adjusted scoring, gap-specific (not generic) SWOT bullets, a
department-level ROI breakdown with Conservative/Expected/Optimistic
ranges instead of one number, and an executive-summary layer (benchmark
comparison + prioritized "Recommended First Moves") at the top of the
report. All additions stay rule-based/deterministic — no AI/LLM calls, no
new external dependencies.

## Purpose

A simple, fast, SMB-friendly web assessment that scores an organization's AI
readiness, generates SWOT / opportunity matrix / ROI estimate / roadmap, and
serves two goals equally: (1) lead generation for KODRYX (captures contact
info), and (2) genuine self-serve value for the SMB (a real, usable report).

Source spec: `../../../KODRYX AI Maturity Assessment™.txt` (the full 15-step,
120-150 question enterprise version). This build keeps all 15 conceptual
steps but compresses each to 1-2 interactions so the whole thing takes
5-8 minutes, not 30+.

## Tech stack

- **Next.js 14** (App Router), TypeScript
- **Tailwind CSS**, wired to KODRYX brand tokens from
  `C:\Vibe Code\00 Kodryx AI Design System\colors_and_type.css`
  (Kodryx Navy `#0E2A3A`, Kodryx Gold `#C9A24D`, white background,
  Poppins display / Inter body, hairline borders, no shadows/gradients,
  minimal motion — see that repo's `README.md` for full rules)
- **Prisma + SQLite** (file-based `dev.db`) — no external services, runs
  entirely on the local machine via `npm run dev`
- **Recharts** (or similarly lightweight React chart lib) for the radar
  chart, opportunity-matrix quadrant plot, and department heatmap
- **react-to-print** (or `html2pdf.js`) for client-side PDF export of the
  results page — no server-side rendering dependency
- No authentication anywhere (single-user/internal-only, local deployment)

## Pages & routes

| Route | Purpose |
|---|---|
| `/` | Landing/start screen — brief pitch, "Start Assessment" CTA |
| `/assessment` | Multi-step wizard (client component, local state), submits once at the end |
| `/results/[id]` | Full results: score gauge, radar chart, heatmap, SWOT, opportunity matrix, ROI, roadmap, "Download PDF" button |
| `/admin` | Plain table of all submissions (company, industry, score, stage, date) → links to `/results/[id]`. No auth. |

API routes:

- `POST /api/assessments` — receives full wizard answers, runs the scoring
  engine, persists the row, returns `{ id }`
- `GET /api/assessments` — list for `/admin`
- `GET /api/assessments/[id]` — full record for `/results/[id]`

## Data model (Prisma)

```prisma
model Assessment {
  id                String   @id @default(cuid())
  createdAt         DateTime @default(now())

  // Lead capture
  contactName       String
  contactEmail      String
  contactPhone      String?
  companyName       String

  // Raw answers per section (kept as JSON — flexible, avoids 100+ columns)
  companyProfile    Json   // industry, employees, revenue, businessModel, leadershipGoals[], blendedHourlyCost
  departments       Json   // { sales: {rating, capabilities[]}, marketing: {...}, hr, finance, operations, support }
  techStack         Json   // systems[], apiMaturity
  dataReadiness     Json   // { quality, security, accessibility, knowledgeMgmt } 0-5 each
  aiAdoption        Json   // toolsInUse[], frequency
  automation        Json   // processesAutomated[]
  agentInterest     Json   // agentTypes[] the SMB is interested in
  security          Json   // checklist[] of items in place
  employeeReadiness Json   // { aiSkills, training, changeReadiness, leadershipSupport, innovationCulture } 0-5 each

  // Computed outputs
  categoryScores    Json   // { businessProcess, technology, data, aiAdoption, automation, aiAgents, security, people, leadership, innovation } — post industry/size adjustment
  totalScore        Int
  stage             String
  dataCompleteness  String // "fast-pass" | "detailed" — drives the confidence caption
  benchmark         Json   // { industryAverage, topQuartile }
  swot              Json   // { strengths[], weaknesses[], opportunities[], threats[] } — each bullet includes the specific gap it references
  opportunityMatrix Json   // [{ initiative, impact, effort, roi, priority, isFirstMove }]
  risk              Json   // { technical, business, security, operational, compliance, adoption, budget } each Low/Medium/High
  roadmap           Json   // { quickWins[], phase2[], phase3[], phase4[] }
  roi               Json   // { assumptions: {...}, byDepartment: [{ department, hoursSavedLow/Mid/High, costSavingsLow/Mid/High }], total: { hoursSavedLow/Mid/High, costSavingsLow/Mid/High, investment, roiPercentLow/Mid/High, paybackMonthsMid } }
  executiveSummary  String // templated paragraph built from the above fields
}
```

## Assessment flow content

All 15 conceptual steps from the source spec are preserved as distinct
moments in the flow. Steps 0-9 are user input; steps 10-15 are
auto-generated on the results page from rules applied to steps 0-9.

| # | Step | Weight | User input |
|---|---|---|---|
| 0 | Registration | — | Name, email, company name, phone (optional) |
| 1 | Company Profile | 5% | Industry (select), employee-count range, revenue range, business model (select: B2B/B2C/SaaS/Manufacturing/Healthcare/Education/Retail/Services), leadership goals (multi-select), blended hourly team cost (number, prefilled with an industry+region default the user can edit or accept) |
| 2 | Business Process | 20% | For each of 6 departments (Sales, Marketing, HR, Finance, Operations, Customer Support): one 0-5 maturity slider + one capability checklist (3-5 items drawn from the source spec's per-department question list, used to sanity-check the slider and to feed opportunity detection) |
| 3 | Technology | 15% | Systems-in-use multi-select (CRM, ERP, HRMS, Accounting, Cloud, Document Storage, Communication, Automation Tools) + API maturity single-select (Legacy / Basic / Modern / Enterprise) |
| 4 | Data Readiness | 10% | Four 0-5 ratings: Data Quality, Data Security, Data Accessibility, Knowledge Management (covers duplicate data / doc mgmt / KB / structured-vs-unstructured from the source spec in condensed form) |
| 5 | AI Adoption | 10% | Tools-in-use multi-select (ChatGPT, Claude, Gemini, Copilot, Perplexity, Cursor, GitHub Copilot, AI Meeting Assistant, AI Chatbot, AI Coding) + frequency single-select (Never/Weekly/Daily/Company-wide) |
| 6 | Automation | 10% | Multi-select which processes are automated (Email, Lead routing, Invoices, Purchase approvals, Onboarding, Reporting, Notifications, Scheduling, Customer comms) |
| 7 | AI Agent Interest | 10% | Multi-select which agent types would be valuable (Sales, Marketing, HR, Finance, Legal, Knowledge, Support, Operations, Voice AI, Document AI, Vision AI) — feeds the Opportunity Matrix directly, not a maturity input |
| 8 | Security & Governance | 5% | Checklist (MFA, SSO, Backups, Data Encryption, GDPR, HIPAA, ISO, Audit Logs, AI Governance, Prompt Security, Data Privacy) |
| 9 | Employee Readiness | 5%+10%+5% | Five 0-5 ratings: AI Skills, Training, Change Readiness, Leadership Support, Innovation Culture |
| 10 | SWOT Analysis | — | Auto-generated (results page) |
| 11 | AI Opportunity Matrix | — | Auto-generated (results page) |
| 12 | Risk Assessment | — | Auto-generated (results page) |
| 13 | ROI Estimate | — | Auto-generated (results page) |
| 14 | Maturity Score | — | Computed (results page) |
| 15 | Transformation Roadmap | — | Auto-generated (results page) |

Estimated total fill time: 5-8 minutes across ~10 screens. No free-text
fields beyond company name / contact info — everything else is
select/multi-select/slider for speed and clean scoring.

## Scoring engine (rule-based, deterministic, industry- and size-adjusted)

Base category weights match the source spec exactly (sum to 100):

| Category | Base weight | Formula (raw ratio, 0-1, before adjustment) |
|---|---|---|
| Business Process | 20 | `avg of 6 department ratings / 5` |
| Technology | 15 | `0.5 × systems-selected coverage + 0.5 × API maturity level/3` |
| Data | 10 | `avg of 4 data ratings / 5` |
| AI Adoption | 10 | `0.5 × tools-selected coverage + 0.5 × frequency level/3` |
| Automation | 10 | `processes-selected / total processes` |
| AI Agents | 10 | `0.5 × Automation ratio + 0.5 × AI-Adoption ratio` — composite proxy, since step 7 captures interest/opportunity rather than current agent usage |
| Security | 5 | `checklist-selected / total checklist items` |
| People | 5 | `avg of AI Skills, Training, Change Readiness / 5` |
| Leadership | 10 | `0.5 × leadership-goals-selected-ratio + 0.5 × Leadership-Support rating/5` |
| Innovation | 5 | `Innovation Culture rating / 5` |

### Industry weight adjustment

A static per-industry multiplier table nudges base weights so the score
reflects what actually matters for that business type, then renormalizes
back to a 100-point total. Example multipliers (illustrative, tunable):

| Industry | Operations | Technology | Data | Security |
|---|---|---|---|---|
| Manufacturing | ×1.2 | ×0.9 | ×1.0 | ×0.9 |
| SaaS | ×0.8 | ×1.3 | ×1.1 | ×1.1 |
| Healthcare | ×0.9 | ×1.0 | ×1.1 | ×1.3 |
| Retail | ×1.1 | ×1.0 | ×1.0 | ×0.9 |
| (default/other) | ×1.0 | ×1.0 | ×1.0 | ×1.0 |

`adjustedWeight_i = baseWeight_i × industryMultiplier_i`, then all 10
adjusted weights are renormalized so they sum to exactly 100 before being
applied to the raw ratios. This is what actually addresses "too
simplistic for executives" — the same raw answers produce a different,
context-appropriate score for a manufacturer vs. a SaaS company.

### Company-size normalization

Expectations for Technology and Automation scores are scaled by
employee-count band before scoring, so a 10-person company isn't judged
against enterprise-ERP benchmarks: each band (1-10, 11-50, 51-200, 200+)
has a "typical systems count" and "typical automation ceiling" baseline;
the raw coverage ratio is divided by that band's baseline (capped at 1.0)
rather than by the full absolute checklist. A small company with 3 of 8
systems selected can therefore score comparably to a large company with
6 of 8, if 3 is at/above what's typical for its size band.

### Data-completeness note

If fewer than half the optional capability-checklist items across all
sections were touched, the results page shows a small caption — "Based on
a fast-pass assessment; scores refine with more detail" — an honest
confidence signal rather than presenting a thin-data score as equally
authoritative as a fully-detailed one.

`totalScore = sum of all 10 adjusted category scores` (0-100).

Stage ladder (5 bands):

| Score | Stage |
|---|---|
| 0-20 | Level 1 — AI Unaware |
| 21-40 | Level 2 — AI Curious |
| 41-60 | Level 3 — AI Exploring |
| 61-75 | Level 4 — AI Automation |
| 76-90 | Level 5 — AI Optimized |
| 91-100 | Level 6 — AI Native |

Each stage also carries a 1-sentence "what this means" description and a
1-sentence "what moves you to the next level" hint, both shown on the
results page next to the stage label (static per-stage text, not
generated).

### SWOT / Opportunity Matrix / Risk / ROI generation rules

All derived deterministically from the category scores and raw answers via
a lookup-rule table (no AI/LLM call, no network dependency):

- **Strengths/Weaknesses (gap-specific, not generic)**: instead of a
  single phrase per category, each strength/weakness bullet is built from
  the *specific* checklist items or ratings that drove the category score
  — e.g., a low Business Process score for Sales with "CRM" unchecked and
  a 1/5 rating produces "No CRM system — sales tracked manually," not a
  generic "Business Process needs improvement." Each category has a
  phrase-bank keyed by which specific sub-signals were missing/present,
  so two companies with the same category score but different missing
  items get different, accurate bullets. Categories scoring ≥80% of their
  (adjusted) max surface as strengths; <40% surface as weaknesses.
  Capped at 4-5 bullets each, ranked by adjusted weight × score-gap so the
  bullets that matter most for *this* company/industry surface first.
- **Opportunities**: driven by `agentInterest` selections cross-referenced
  with the specific gaps that produced them (e.g., "no CRM" in Technology
  + "Sales Agent" interest → surfaces "AI Sales Agent" opportunity, with
  the bullet naming the gap it closes). Each gets Impact/Effort/ROI from a
  static lookup table per initiative type, and Priority as a 1-5 star
  rating derived from Impact+ROI vs Effort.
- **Threats**: a mix of 1-2 static generic threats (competitors adopting
  AI, rising operational costs) plus 1-2 conditional ones triggered by low
  Security score (data privacy risk) or low People score (employee
  resistance).
- **Risk Assessment**: each of the 7 risk types (Technical, Business,
  Security, Operational, Compliance, Adoption, Budget) mapped to
  Low/Medium/High via simple thresholds against the relevant *adjusted*
  category score (e.g., Security category <40% → Security Risk = High).
- **ROI Estimate (department-level, ranged)** — the previous flat
  single-number estimate is replaced with:
  - **One user input**: blended hourly team cost (Step 1, prefilled from
    an industry+region default, editable in one field) — removes the
    "black box" feel without adding a real time-tracking calculator.
  - **Per-department breakdown**: for each of the 6 departments from
    Step 2, hours-saved is estimated from that department's specific
    automation gap `(5 − rating)/5`, an industry-benchmark
    hours-per-employee-per-week figure for that department, and the
    company's employee-count band (department headcount estimated via a
    static per-business-model proportion table, e.g. Sales/Marketing
    ~25% of headcount for B2B). This directly answers "which department
    should we fix first" instead of one opaque total.
  - **Conservative / Expected / Optimistic range**: each department
    figure (and the aggregate) is shown as three scenarios using 60% /
    100% / 140% of the estimated automatable-hours figure, rather than a
    single point estimate presented as fact.
  - **Explicit assumptions block**: the report states, in plain language,
    the hours/week benchmark used, the automatable-% assumption, the
    hourly cost used, and the headcount split — so an executive can
    sanity-check the number instead of trusting it blindly.
  - Output shape: annual hours saved (low/mid/high) per department + total,
    cost savings (low/mid/high), a flat investment-estimate tier (by
    employee-count band), ROI % (low/mid/high), and payback period in
    months (mid case). Still labeled "Estimated using stated assumptions
    and industry benchmarks" — honest about being an estimate, not a
    substitute for the source spec's full ROI calculator, while being far
    more credible and actionable than one flat number.
- **Roadmap**: Quick Wins (30 days) / Phase 2 (90 days) / Phase 3 (180
  days) / Phase 4 (12 months) buckets populated from a static base
  template (matching the source spec's example items), with 1-2 items
  swapped per bucket based on which categories scored lowest (e.g., if
  Security scores low, "AI Policy" quick win is prioritized to the top).

## Executive report layer (v1.1 addition)

Two additions sit at the very top of `/results/[id]` and the PDF, above
the gauge/radar/etc., addressing "Executive Value needs benchmarking and
prioritization":

- **Benchmark comparison bar**: "Your score: 67 · Industry average: 54 ·
  Top quartile: 82" as a single horizontal bar with three markers. Backed
  by a static per-industry benchmark table (illustrative placeholder
  values for v1, explicitly labeled "KODRYX benchmark — refined as more
  assessments are completed"; the table lives in one place so it's a
  1-line change to update once real submission data accumulates).
- **Recommended First Moves**: the top 3 items from the Opportunity
  Matrix ranked by (Impact + ROI) / Effort, pulled out into a distinct
  callout card ("Start here") before the detailed sections — mirrors how
  a real consulting deck leads with the punchline instead of burying it
  in a table.
- **Executive Summary paragraph**: a single templated paragraph (not
  free-form AI text) with slots filled from computed data: stage, top
  strength, top risk, the 3 First Moves, and the headline ROI number
  (mid-case, total). This is the source spec's "Executive Summary (2
  pages)" deliverable, generated deterministically from the same data
  that drives every other section — no new dependency, no inconsistency
  risk between the summary and the details.

## "Wow factor" — results experience

Brand rules stay intact (no bounces, no gradients, no big motion — subtle
200-250ms fades/slides only per the Kodryx design system), but the reveal
is designed to feel premium and impressive:

1. **Analyzing transition**: after the last question, a brief (~2-3s)
   full-screen transition — "Analyzing your AI maturity..." with the 10
   category names ticking past — before the results page mounts. Builds
   anticipation, masks the (near-instant) scoring computation.
2. **Animated score gauge**: total score displayed as a radial/arc gauge
   (navy track, gold fill) that counts up from 0 to the final score on
   mount, with the stage label and benchmark bar (score vs. industry
   average vs. top quartile) fading in underneath.
3. **Radar chart**: all 10 category scores as a radar/spider chart (navy
   fill at low opacity, gold outline) — the single most "wow" visual,
   showing the maturity shape at a glance.
4. **Department heatmap**: the 6 departments from Step 2 shown as a
   colored grid (navy → gold intensity by score) instead of a plain list.
5. **Opportunity Matrix as a real quadrant plot**: Impact (y) vs Effort
   (x) scatter, bubble size = ROI, gold bubbles on a navy-hairline grid —
   replaces the source spec's plain table, doubles as the visual pitch
   for KODRYX's agent/automation services. The top-3 "Recommended First
   Moves" are visually highlighted (filled vs. outline bubbles).
6. **ROI range visual**: each department's Conservative/Expected/Optimistic
   savings shown as a small horizontal range bar rather than one number,
   stacked per department so the reader can see at a glance which
   department has the largest opportunity.
7. **Roadmap timeline**: the 4 phases shown as a horizontal timeline
   strip (30/90/180/365 days) rather than plain bullet lists.
8. Wizard itself: a slim progress bar (navy track, gold fill) across the
   top of every step, with 200ms fade/slide between steps.
9. **PDF export** mirrors the same visuals (gauge, radar, heatmap,
   quadrant plot, ROI ranges, timeline) plus the Executive Summary
   paragraph and Recommended First Moves card at the top — generated
   client-side via `react-to-print` so the branded, chart-rich version is
   what leadership actually keeps.

## Admin view

`/admin` — plain HTML table (no auth): Company, Industry, Contact,
Score, Stage, Submitted date, sorted newest-first, each row linking to
`/results/[id]`. No review/approval workflow (out of scope — noted as a
future phase per the source spec's "Phase 2: consultant dashboard").

## Explicitly out of scope (future phases, per source spec)

- Consultant review/approval workflow before sharing with client
- One-click PowerPoint export
- AI/LLM-generated narrative commentary (all generation is rule-based for
  this build)
- Multi-tenant auth, user accounts, or hosted deployment (local machine
  only for now)
- Precise ROI calculator with real manual-hours input collection
