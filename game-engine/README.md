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

## Deployment

### Vercel

Recommended Vercel settings:

1. Framework Preset: `Next.js`
2. Root Directory: `game-engine`
3. Install Command: `npm install`
4. Build Command: `npm run build`
5. Output handling: Next.js default

`npm run build` already triggers `prebuild`, which copies `../content-lab` into `game-engine/.generated/content-lab/` when the sibling directory is available.

If your Vercel project blocks access to `../content-lab`, enable source files outside Root Directory in Vercel project settings.

### Cloudflare Workers

Use Cloudflare Workers for this project. Do not use Cloudflare Pages static export unless the app is explicitly converted to `output: "export"`.

Required files:

- `open-next.config.ts`
- `wrangler.jsonc`

Available commands:

```bash
npm run cf:build
npm run preview
npm run deploy
```

What they do:

- `npm run cf:build` syncs `content-lab/` and builds the OpenNext Cloudflare worker output into `.open-next/`
- `npm run preview` builds and starts local Wrangler preview
- `npm run deploy` builds and deploys to Cloudflare Workers

Before the first deploy, authenticate Wrangler:

```bash
npx wrangler login
```

## Contract Note

Share text generation now prefers `content-lab/copy/share.md` and replaces these frozen variables:

- `{{score}}`
- `{{tier}}`
- `{{weakestCategory}}`
- `{{averageReaction}}`

If `share.md` is missing or contains no template line, engine falls back to a built-in default string.
