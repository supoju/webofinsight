# Dual Platform Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add explicit deployment support for Vercel and Cloudflare Workers without splitting application logic.

**Architecture:** Keep the existing Next.js 16 app unchanged at the business-logic layer. Add a Cloudflare Workers adapter layer in `game-engine/` using the official OpenNext adapter, preserve the current Vercel build path, and document the distinct deployment commands and root-directory requirements.

**Tech Stack:** Next.js 16, TypeScript, Vercel, Cloudflare Workers, OpenNext Cloudflare adapter, Wrangler

---

### Task 1: Define deployment shape and files

**Files:**
- Create: `docs/plans/2026-03-27-dual-platform-deployment.md`
- Modify: `game-engine/package.json`
- Create: `game-engine/open-next.config.ts`
- Create: `game-engine/wrangler.jsonc`

**Step 1: Inspect current build and content sync path**

Run: `Get-Content game-engine\package.json`
Expected: Existing `prebuild` and `build` scripts confirm Vercel build flow.

**Step 2: Add Cloudflare adapter dependencies and scripts**

Update `game-engine/package.json` with:
- `preview` for local Workers-runtime preview
- `deploy` for Cloudflare deployment
- `cf-typegen` for Wrangler env typings
- adapter dependencies required by Cloudflare Workers

**Step 3: Add minimal adapter configuration**

Create `game-engine/open-next.config.ts` using the Cloudflare adapter helper.

**Step 4: Add Wrangler project configuration**

Create `game-engine/wrangler.jsonc` with schema, Worker entrypoint, assets directory, Node compatibility, and observability enabled.

### Task 2: Document platform-specific deployment behavior

**Files:**
- Modify: `README.md`
- Modify: `game-engine/README.md`

**Step 1: Clarify Vercel deployment settings**

Document:
- Root directory must be `game-engine`
- Build runs from `game-engine`
- If Vercel blocks access to sibling content, enable including files outside root or use repo-root deployment commands

**Step 2: Add Cloudflare Workers deployment instructions**

Document:
- Cloudflare target is Workers, not Pages static export
- Project root is `game-engine`
- Use `npm run preview` to validate Workers runtime
- Use `npm run deploy` to publish

### Task 3: Verify the deployment paths

**Files:**
- Modify if needed: `.gitignore`

**Step 1: Install new dependencies**

Run: `npm install` in `game-engine`
Expected: lockfile updated with Cloudflare adapter packages.

**Step 2: Verify Vercel-oriented build still succeeds**

Run: `npm --prefix game-engine run build`
Expected: Next.js production build succeeds.

**Step 3: Verify Cloudflare adapter build path is available**

Run: `npm --prefix game-engine run preview`
Expected: OpenNext Cloudflare build completes and launches local preview, or at minimum reaches adapter build stage without configuration errors.

**Step 4: Ignore generated adapter artifacts if necessary**

If `.open-next/` or similar generated folders appear, add them to `.gitignore`.
