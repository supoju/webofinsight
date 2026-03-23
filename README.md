# optical-illusion-game

Main orchestrator repository for a worktree-driven optical illusion web game.

## Branch ownership

- `main`: orchestration, review, merge
- `game-engine`: Next.js app, UI, state, scoring, storage, deployment
- `content-lab`: question bank, copywriting, pacing, share copy

## Worktree rule

`content-lab` only edits content interface files.

`game-engine` only consumes content interface files and must not rewrite them.

All cross-boundary changes are reviewed and merged from `main`.
