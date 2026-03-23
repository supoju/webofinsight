# Implementation Plan: Optical Illusion Game

**Feature**: `001-optical-illusion-game`  
**Date**: 2026-03-23  

## Technical Context

- Framework: Next.js with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Runtime model: frontend-first, Vercel-ready
- Storage: browser `localStorage`
- Content source: local JSON and Markdown files committed in repo
- Rendering: React + SVG/Canvas generators, plus lightweight public assets where needed
- Testing focus: schema validation, selection/scoring utilities, core UI flow smoke coverage

## Constitution Check

- Spec-first requirement satisfied: `spec.md` created before implementation
- Worktree separation is explicit and enforceable through ownership rules
- No database or secret-bearing backend is required
- Scope is constrained to MVP + requested polish items only

## Architecture

### 1. Repository roles

- `main/orchestrator`: owns spec, plan, tasks, contract review, merge approval
- `content-lab`: produces content assets and pacing notes
- `game-engine`: implements the app that consumes frozen content contracts

### 2. App structure

- `app/`: homepage, gameplay route, result route, layout, theme setup
- `components/`: UI shells, progress/timer, question renderer switch, result widgets, share card
- `components/illusions/`: SVG/Canvas illusion generator components
- `lib/content/`: load and validate question/copy content
- `lib/game/`: selection, scoring, tiering, analysis, state helpers
- `lib/storage/`: `localStorage` read/write guards
- `public/`: lightweight placeholder ambiguous-image assets if needed

### 3. Content contract

- `content-lab/data/questions.json`: full question bank
- `content-lab/copy/home.md`: home page instructional copy
- `content-lab/copy/results.md`: result interpretation copy blocks
- `content-lab/copy/share.md`: share message templates
- `content-lab/pacing/sequence.md`: question rhythm and reversal notes

### 4. Gameplay model

- On start, engine loads validated question bank
- Engine filters `mode=score`, shuffles with stable utility, selects 10
- Each question starts a 5-second timer from authored `timeLimitSec`
- Answer submission records correctness and reaction time
- Timeout yields incorrect status and auto-advance
- Result summary derives:
  - total score
  - correct count
  - average reaction time
  - title tier
  - most vulnerable category
  - personality analysis text

## Data Model

### Question

- Content identity and authored metadata
- Rendering target via `generator` or `asset`
- Player-facing copy via `title`, `prompt`, `options`, `uiCopy`
- Explanation and psychology hook for results/review

### Run Record

- selected question ids
- answer records
- timestamps
- computed summary

### Derived Summary

- `scoreTotal`
- `correctCount`
- `averageReactionMs`
- `tier`
- `weakestCategory`
- `personaKey`

## Implementation Phases

### Phase 1: Orchestrator contract setup

- Create feature docs and interface ownership docs
- Freeze JSON schema and Markdown interface locations
- Define question sequencing policy and result derivation rules

### Phase 2: Content-lab delivery

- Author 20-question bank with 18 scoring entries and 2 analysis entries
- Write homepage, result, and share copy
- Document pacing rhythm and psychological goals
- Ensure no engine-owned files are touched

### Phase 3: Game-engine foundation

- Scaffold Next.js + TypeScript + Tailwind app
- Set up theme, layout, route skeletons, and content loading
- Add schema validation and error-safe fallbacks
- Build storage utilities and game session model

### Phase 4: Illusion rendering and gameplay

- Implement required illusion generator components
- Build question view, timer, progress, answer handling, and transitions
- Implement selection and scoring utilities
- Persist best score and recent result

### Phase 5: Results and polish

- Implement result tiering, weak-category analysis, and persona copy mapping
- Add wrong-answer review
- Add share card generation
- Tune mobile UX, dark mode, and deployment readiness

## Testing Strategy

- Validate question schema and required fields
- Test question selection excludes analysis mode from main run
- Test timeout and scoring logic deterministically
- Smoke test home -> game -> result flow
- Verify storage fallback when `localStorage` is blocked
- Verify unknown generator fallback does not crash the app

## Risks And Mitigations

- Risk: content contract drift between worktrees
  - Mitigation: freeze schema in orchestrator docs and review contract changes centrally
- Risk: visual generators become too complex for mobile
  - Mitigation: use simplified SVG-first implementations and avoid heavy raster assets
- Risk: result interpretation feels arbitrary
  - Mitigation: base analysis on authored category mapping plus explicit scoring rules
- Risk: content files use copy the engine cannot consume
  - Mitigation: validate all structured content on load and fail with readable fallback UI

## Deliverables

- `specs/001-optical-illusion-game/spec.md`
- `specs/001-optical-illusion-game/plan.md`
- `specs/001-optical-illusion-game/tasks.md`
- content contract files in `content-lab/`
- deployable Next.js frontend in engine worktree
