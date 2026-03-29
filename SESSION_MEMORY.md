# Session Memory

Last updated: 2026-03-25
Project: `webofinsight`
Feature: `optical-illusion-game`

## 当前状态

- 已完成 worktree 规划、spec / plan / tasks 文档。
- 已有内容接口：
  - `content-lab/data/questions.json`
  - `content-lab/copy/home.md`
  - `content-lab/copy/results.md`
  - `content-lab/copy/share.md`
  - `content-lab/pacing/sequence.md`
- 已有前端工程：
  - `game-engine/` 下 Next.js + TypeScript + Tailwind + App Router
  - 支持首页、游戏页、结果页、localStorage、分享卡、深色模式、错题回顾

## 今天完成的关键修复

### 1. 内容与消费契约

- 修正了 `analysis` 题允许 `score: 0` 的 schema 问题。
- 接通了 `share.md` 模板消费，而不是只用硬编码分享文案。
- 保留并消费这些 asset 标识：
  - `duck-rabbit`
  - `old-young-woman`
  - `simultaneous-contrast-bars`
  - `identical-grays-context`

### 2. 首页与游戏页稳定性

- 首页去掉了开发态接口预览区，改成产品态文案与说明区。
- 修复了首页 CTA 按钮文字颜色异常。
- 抽题改成确定性抽题，避免 hydration mismatch。
- 修复了 `/play` 首屏 `0s`、不能答题的问题。
- 根因是 `localStorage` 的 `useSyncExternalStore` snapshot 不稳定：
  - `readRecentResult()` 每次 `JSON.parse()` 生成新对象
  - 导致 React 无限重渲染
  - 已在 `game-engine/src/lib/storage/local.ts` 中加缓存修复

### 3. 结果页重设计

- 结果页不再展示 Markdown 接口原文。
- 已重做为“实验室诊断海报”风格：
  - 超大分数主视觉
  - 行为标签
  - 心理读数
  - 易错类型诊断
  - 分享战报区
  - 编号错题证据卡
- 下载的 SVG 分享卡也同步改成相近视觉语言。

## 当前重要文件

- 规划文档：
  - `specs/001-optical-illusion-game/spec.md`
  - `specs/001-optical-illusion-game/plan.md`
  - `specs/001-optical-illusion-game/tasks.md`
- 关键实现：
  - `game-engine/src/components/home-client.tsx`
  - `game-engine/src/components/game-client.tsx`
  - `game-engine/src/components/result-client.tsx`
  - `game-engine/src/lib/storage/local.ts`
  - `game-engine/src/lib/share/card.ts`
  - `game-engine/src/lib/content/schema.ts`

## 当前未提交改动

- 本次会话中，`game-engine` 下仍有一批未提交修改。
- `git status --short` 显示当前主要变更包括：
  - `game-engine/src/components/home-client.tsx`
  - `game-engine/src/components/game-client.tsx`
  - `game-engine/src/components/result-client.tsx`
  - `game-engine/src/lib/storage/local.ts`
  - `game-engine/src/lib/share/card.ts`
  - `game-engine/src/lib/content/schema.ts`
  - `game-engine/src/lib/game/categories.ts`
  - `game-engine/src/lib/game/selection.ts`
  - `game-engine/src/app/layout.tsx`
  - `game-engine/src/app/globals.css`
  - `ai-log/2026-03-23-runtime-debug-home-play.md`

## 下次进入建议先做的事

1. 先运行：
   - `npm --prefix game-engine run test`
   - `npm --prefix game-engine run build`
2. 再检查：
   - `git status --short`
3. 如果页面效果确认无误，整理并提交本次未提交改动。
4. 下一阶段推荐工作：
   - 统一首页与结果页视觉系统
   - 继续优化分享卡表现
   - 做最终交付前的验收和部署收口

## 相关归档

- `ai-log/2026-03-23-optical-illusion-game-planning.md`
- `ai-log/2026-03-23-content-lab-content-assets.md`
- `ai-log/2026-03-23-game-engine-implementation.md`
- `ai-log/2026-03-23-runtime-debug-home-play.md`
- `ai-log/2026-03-23-result-page-poster-redesign.md`
- `ai-log/2026-03-25-optical-illusion-game-verification-handoff.md`

## 2026-03-25 Follow-up

- Verified:
  - `npm --prefix game-engine run test`
  - `npm --prefix game-engine run build`
- Results:
  - Vitest passed `3` test files and `8` tests
  - Next.js production build succeeded for `/`, `/play`, and `/result`
- Documentation synced:
  - `specs/001-optical-illusion-game/tasks.md`
  - `README.md`
  - `specs/001-optical-illusion-game/acceptance/acceptance-20260325.md`
- T038 update:
  - Added `game-engine/src/components/gameplay-smoke.test.ts`
  - Smoke flow covers `HomeClient -> GameClient -> ResultClient`
  - Fresh verification: `npm --prefix game-engine run test` => `4` files / `9` tests passed
  - Fresh verification: `npm --prefix game-engine run build` => passed
- T039 update:
  - Added `game-engine/src/components/ui-verification.test.ts`
  - Verified dark mode, graceful fallback states, and mobile-first wrapper classes
  - Fresh verification: `npm --prefix game-engine run test` => `5` files / `12` tests passed
- T041 update:
  - `npm --prefix game-engine install` succeeded
  - Fresh `npm --prefix game-engine run dev` reached `Ready in 1141ms`
  - Existing same-directory dev server on `localhost:3000` responded `200`
- T042 update:
  - Added orchestrator review: `specs/001-optical-illusion-game/acceptance/orchestrator-review-20260325.md`
  - Acceptance status updated to `PASS WITH CONDITIONS`
- Current status:
  - All tasks in `specs/001-optical-illusion-game/tasks.md` are now checked complete
  - Remaining non-blocking condition is repository hygiene: unrelated untracked root files should be excluded from the final changeset

## 2026-03-26 Follow-up

- Local dev status:
  - `game-engine` dev server was repeatedly verified on `http://localhost:3000`
  - Core gameplay flow remains functional after UI refactors
- Gameplay ergonomics updates:
  - Reworked `play` page from side-by-side question/image layout to vertical flow
  - New order is: top status -> illusion stage -> answer controls
  - Reduced illusion stage footprint to better fit common laptop viewports
  - Added semantic regions and verification coverage for play-flow structure
- UI system foundation:
  - Added reusable UI primitives in `game-engine/src/components/ui/`
    - `button.tsx`
    - `card.tsx`
    - `badge.tsx`
    - `progress.tsx`
    - `typography.tsx`
  - Added shared utility:
    - `game-engine/src/lib/utils.ts`
  - Expanded design tokens in:
    - `game-engine/src/app/globals.css`
  - Added `next/font` typography setup in:
    - `game-engine/src/app/layout.tsx`
- Homepage and results page updates:
  - `home-client.tsx`, `result-client.tsx`, `metric-card.tsx`, and `content-status.tsx` were migrated into the same token/component system
  - Unified heading hierarchy across home, play, and result views
  - Further reduced result-page one-off styling by extracting repeated presentation patterns
- Verification completed today:
  - `npm --prefix game-engine run test`
  - `npm --prefix game-engine run build`
  - Latest verified state: `5` test files / `14` tests passed
- Git status:
  - Relevant web changes were committed locally as:
    - commit `2e562fc`
    - message: `feat: finalize optical illusion game ui system`
  - Push attempts to `origin main` failed due to network connectivity to GitHub:
    - `Recv failure: Connection was reset`
    - `Failed to connect to github.com port 443`
  - User later indicated the repo had already been submitted from their side
- Deployment status:
  - Vercel auto-deploy reported success
  - But visiting the site returned a Vercel platform-level `404: NOT_FOUND`
  - This does **not** look like an in-app Next.js route error
  - Most likely cause is incorrect Vercel project configuration, especially:
    - `Root Directory` should be `game-engine`
    - Framework should be `Next.js`
    - Install command should be `npm install`
    - Build command should be `npm run build`
    - Output directory should remain default/blank for Next.js
- Highest-priority task for next session:
  1. Inspect Vercel project settings
  2. Confirm whether deployment root is incorrectly set to repo root instead of `game-engine`
  3. Compare `*.vercel.app` preview URL behavior vs custom domain behavior
  4. If needed, add deployment-specific config only after confirming settings are correct
- Related new archives created today:
  - `ai-log/2026-03-26-play-layout-ergonomics.md`
  - `ai-log/2026-03-26-play-compact-shadcn-foundation.md`
  - `ai-log/2026-03-26-home-result-unified-ui-foundation.md`
  - `ai-log/2026-03-26-typography-and-result-componentization.md`
