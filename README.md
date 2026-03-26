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

## Local Run

Install dependencies in the engine worktree:

```bash
cd game-engine
npm install
```

Start the local development server:

```bash
npm run dev
```

Useful verification commands from the repository root:

```bash
npm --prefix game-engine run test
npm --prefix game-engine run build
```

The production build pulls authored content from `content-lab/` into `game-engine/.generated/content-lab` via `npm run content:sync`.

## Vercel Deployment

Deploy the `game-engine` app as the Vercel project root.

Recommended settings:

- Framework Preset: `Next.js`
- Root Directory: `game-engine`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave default for Next.js

No backend services or secret configuration are required for the current frontend-only MVP.
