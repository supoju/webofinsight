# Deployment Console Checklist

## Vercel

### Import Settings

- Repository: `supoju/webofinsight`
- Framework Preset: `Next.js`
- Root Directory: `game-engine`

### Build And Output Settings

- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave empty and use Next.js default

### Node / Environment Notes

- No required production secrets for the current MVP
- If build cannot access sibling `content-lab/`, enable source files outside the Root Directory in Vercel project settings

### Domain / Runtime Notes

- Production branch: `main`
- Default route should serve `/`

## Cloudflare Workers

### Repository / Root Settings

- Repository: `supoju/webofinsight`
- Root Directory: `game-engine`

### Build Settings

- Install Command: `npm install`
- Build Command: `npm run cf:build`

### Deploy Settings

- Deploy Command: `npm run deploy`

### Wrangler Config

- Config file: `game-engine/wrangler.jsonc`
- Worker Name: `webofinsight-game-engine`
- Main Entry: `.open-next/worker.js`
- Assets Directory: `.open-next/assets`
- Compatibility Date: `2026-03-27`
- Compatibility Flags:
  - `nodejs_compat`
  - `global_fetch_strictly_public`

### Important Choice

- Use `Cloudflare Workers`
- Do not use `Cloudflare Pages` static export for the current project

### First-Time Auth

- Run locally before first deploy: `npx wrangler login`

## Local Verification Commands

```bash
npm --prefix game-engine run build
npm --prefix game-engine run cf:build
```
