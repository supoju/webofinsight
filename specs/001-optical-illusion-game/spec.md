# Feature Specification: Optical Illusion Game

**Feature Branch**: `001-optical-illusion-game`  
**Created**: 2026-03-23  
**Status**: Draft  

## Summary

Build a deployable, pure-frontend web game named `optical-illusion-game` for Vercel Hobby. The game delivers a 10-question visual illusion challenge with fast rounds, strong reversal moments, local score persistence, and a results screen that explains what kind of illusion the player is most vulnerable to.

The delivery model is worktree-driven:

- `main/orchestrator` owns review, interface freeze, merge approval
- `content-lab` owns question content, copywriting, pacing, share language
- `game-engine` owns app code, rendering, state, scoring, storage, deployment

## Problem

Many simple browser quiz games feel disposable because they lack pacing, surprise, and post-game interpretation. This feature must turn visual illusion content into a compact challenge that feels fast, surprising, and shareable while staying lightweight enough for free frontend hosting.

## Goals

- Deliver a playable 10-question challenge that runs with no backend
- Create a clear separation between content authoring and engine implementation
- Preserve “first instinct vs reality” as the core emotional loop
- Make results interpretable and shareable through score tier, illusion weakness type, and light personality framing
- Keep the bundle lightweight and suitable for Vercel Hobby deployment

## Out Of Scope

- Multiplayer
- Server-side user accounts
- Database storage
- Live analytics backend
- AI-generated question content inside the app
- Content editing UI
- Content-lab editing engine code directly
- Game-engine rewriting content files without orchestrator approval

## Actors

- Player: visits, starts a run, answers 10 questions, views results, reviews mistakes, shares score
- Content Author: edits question bank, pacing notes, and copy in content worktree
- Engine Developer: implements UI and logic in engine worktree
- Orchestrator: reviews interface changes and merges worktree outputs

## User Scenarios

### US1: Start a quick challenge

A player lands on the homepage, sees the title, short pitch, instructions, and saved high score, then starts a new 10-question run with one tap.

### US2: Complete a timed illusion round

A player sees one illusion prompt at a time with progress, time pressure, large touch-friendly options, and immediate transition to the next question when answering or timing out.

### US3: Understand the result

A player finishes the run and sees total score, correct answers, average reaction time, title tier, vulnerable illusion type, personality-style analysis, and an option to replay or inspect mistakes.

### US4: Consume authored content safely

The engine loads content from fixed JSON and Markdown interface files without inventing or mutating content locally.

## Functional Requirements

### Gameplay

1. The homepage must show title, subtitle, start button, best score, recent result summary, and brief gameplay instructions.
2. Starting a run must create a 10-question challenge from the local question bank.
3. Each run must include only standard scoring questions in the 10 playable slots unless orchestrator explicitly changes the selection policy.
4. Each question screen must show question index, progress indicator, countdown timer, illusion graphic, and answer buttons.
5. Default time limit per playable question must be 5 seconds.
6. If the player does not answer before time expires, the question must be marked wrong and the game must advance automatically.
7. The game must record whether the answer was correct, reaction time, timeout status, and category.
8. The game must end after 10 playable questions.

### Results

9. The result screen must show total score, correct count, average reaction time, title tier, and replay action.
10. The result screen must identify the player’s “most easily fooled” illusion category using run data.
11. The result screen must show a short personality-style analysis derived from score band and vulnerable category.
12. The result screen must support reviewing missed questions with the correct explanation.
13. The result screen should support generating a frontend share card image or downloadable poster.

### Content Contract

14. The repository must store question data in `content-lab/data/questions.json`.
15. The repository must store authored copy and pacing notes in Markdown files under `content-lab/`.
16. Each question entry must include:
    `id`, `category`, `mode`, `title`, `prompt`, `assetType`, `generator` or `asset`, `options`, `answer`, `explanation`, `difficulty`, `timeLimitSec`, `score`, `uiCopy`, `psychologyGoal`.
17. The question bank must include between 84 and 88 entries total.
18. The question bank must include exactly 80 standard scoring questions.
19. The question bank must include between 4 and 8 analysis questions reserved for result interpretation rather than core score.
20. Categories must cover length, size, parallel-or-direction, color-or-brightness, and ambiguous image illusions.
21. The engine must treat content files as external authored input and must not silently regenerate or overwrite them.
22. Generator-backed questions may reuse the same illusion family only when authored with distinct visual variants that create materially different judgments for the player.

### Rendering

23. The app must implement dynamic illusion renderers for:
    `MullerLyer`, `Ponzo`, `Ebbinghaus`, `VerticalHorizontal`, `Zollner`, `CafeWall`, `CheckerShadow`, `Delboeuf`.
24. Ambiguous image illusions such as duck-rabbit and old-young may use lightweight placeholder SVG or public assets.
25. Visual assets must remain lightweight and suitable for mobile loading.
26. The rendering contract must support authored generator variants so content authors can expand the bank without introducing a brand-new renderer for every new question.

### Persistence

27. The app must persist best score and most recent result using `localStorage`.
28. The app must restore persisted result data on the homepage and results page where relevant.

### Deployment

29. The project must be runnable with `npm install` and `npm run dev`.
30. The app must be deployable to Vercel without backend configuration.

## Non-Functional Requirements

- Mobile-first layout with large tap targets
- Modern, minimal, experimental tone without decorative excess
- Dark mode support
- Bundle stays lightweight by preferring SVG/Canvas over large raster images
- No database and no mandatory server API
- Clear module boundaries so worktrees can operate independently

## Data Concepts

- Question: authored illusion prompt with rendering reference and explanation
- Challenge Run: one 10-question attempt by a player
- Answer Record: per-question outcome with correctness, duration, category, and timeout
- Score Summary: total score, correct count, average response time, tier, vulnerable category
- Content Copy: homepage, results, pacing, and share text authored outside engine code

## Edge Cases

- Missing or malformed question content should fail gracefully with a fallback message instead of a broken screen
- If there are fewer than 10 scoring questions, the run must not start
- If `localStorage` is unavailable, gameplay must still run without persistence
- If a specific generator name is unknown, the app should show a safe fallback visual state
- Analysis questions must not accidentally count toward core score unless the orchestrator changes rules

## Worktree Governance

### `content-lab` ownership

- `content-lab/data/questions.json`
- `content-lab/copy/home.md`
- `content-lab/copy/results.md`
- `content-lab/copy/share.md`
- `content-lab/pacing/sequence.md`

### `game-engine` ownership

- Next.js app structure
- SVG/Canvas illusion components
- state machine and timers
- scoring and selection utilities
- localStorage utilities
- share-card generation
- Vercel deployment configuration

### Cross-boundary rules

- `content-lab` must not edit UI components, state, scoring logic, or deployment files
- `game-engine` must not author or alter question copy or pacing content
- Contract changes require orchestrator review before merge

## Success Criteria

1. A new player can start a run from the homepage and finish 10 questions without backend dependencies.
2. The finished run always produces score, accuracy, average reaction time, title tier, and vulnerable illusion type.
3. The content interface can be updated in `content-lab` without requiring direct edits to engine logic for ordinary copy changes.
4. The app runs locally with `npm install` and `npm run dev` and is structured for Vercel deployment.
5. The experience preserves a clear reversal rhythm through authored content rather than random generic quiz phrasing.
6. The scoring bank is large enough that repeat play sessions usually surface meaningfully different question mixes instead of the same few prompts.
