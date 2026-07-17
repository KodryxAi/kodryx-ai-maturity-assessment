<!-- GSD:project-start source:PROJECT.md -->
## Project

**KODRYX AI Maturity Assessment™ (KAMA)**

A simple, elegant web application that lets a small/medium business complete
a ~15-step (compressed to ~10-screen, 5-8 minute) AI-readiness assessment and
instantly receive an executive-credible report: a maturity score, SWOT,
opportunity matrix, ranged ROI estimate, and a phased transformation
roadmap. It serves two purposes equally: a genuine self-serve deliverable
for the SMB, and a qualified lead-capture funnel for KODRYX AI.

**Core Value:** An SMB decision-maker fills out the assessment and walks away with a
polished, benchmarked, prioritized AI report that feels like it came from a
real consulting engagement — in minutes, not weeks — while KODRYX captures
their contact details as a sales lead.

### Constraints

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
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
