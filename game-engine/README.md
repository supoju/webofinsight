# Optical Illusion Game Engine

`game-engine` 只负责前端实现，消费 `content-lab` 提供的题库和文案接口，不在本目录内生成或改写内容资产。

## Stack

- Next.js 16
- App Router
- TypeScript
- Tailwind CSS v4
- localStorage persistence
- SVG illusion renderers

## Required Content Interfaces

The app consumes these frozen content files:

- `content-lab/data/questions.json`
- `content-lab/copy/home.md`
- `content-lab/copy/results.md`
- `content-lab/copy/share.md`
- `content-lab/pacing/sequence.md`

If they are missing, the app still runs, but the challenge start action is disabled and the UI shows content status instead of fabricating final content.

Engine lookup order:

1. `CONTENT_ROOT` environment variable, if provided
2. repository-root `content-lab/`
3. `game-engine/.generated/content-lab/` synced copy
4. sibling `../content-lab/` for local worktree usage

## Local Run

```bash
cd game-engine
npm install
npm run dev
```

Open `http://localhost:3000`.

Optional verification:

```bash
npm run lint
npm run test
npm run build
```

## Gameplay Features

- Home page with start CTA, best score, recent result, and authored-copy slots
- 10-question random challenge from `mode: "score"` questions only
- 5-second countdown per question
- Auto-fail and auto-advance on timeout
- Results page with title tier, weakest-category analysis, and wrong-answer review
- localStorage for best score, recent result, and theme
- Light/dark theme toggle
- Frontend-generated SVG share card download

## Vercel Hobby Deployment

### Preferred: Deploy From Repository Root

Use repository root as the deployment context so `content-lab/` is present at build time.

Recommended Vercel settings:

1. Root Directory: repository root
2. Install Command: `npm install --prefix game-engine`
3. Build Command: `npm run build --prefix game-engine`
4. Output handling: Next.js default

In this mode, engine resolves `content-lab/` directly from the repository root without copying files.

### Fallback: Deploy With `game-engine` As Root Directory

If Vercel must use `game-engine/` as the root directory, the build now includes a prebuild sync step:

```bash
npm run content:sync
npm run build
```

`npm run build` already triggers `prebuild`, which copies `../content-lab` into `game-engine/.generated/content-lab/`.

This keeps the worktree boundary intact while making production builds deterministic inside the engine root.

## Contract Note

Share text generation now prefers `content-lab/copy/share.md` and replaces these frozen variables:

- `{{score}}`
- `{{tier}}`
- `{{weakestCategory}}`
- `{{averageReaction}}`

If `share.md` is missing or contains no template line, engine falls back to a built-in default string.
