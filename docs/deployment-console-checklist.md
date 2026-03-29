# 部署控制台参数清单

## Vercel

### 导入设置

- 仓库：`supoju/webofinsight`
- 框架预设：`Next.js`
- 根目录：`game-engine`

### 构建与输出设置

- 安装命令：`npm install`
- 构建命令：`npm run build`
- 输出目录：留空，使用 Next.js 默认值

### Node / 环境说明

- 当前 MVP 不需要额外的生产环境密钥
- 如果构建时无法读取同级 `content-lab/`，需要在 Vercel 项目设置中开启“允许 Root Directory 之外的源码文件”

### 分支 / 路由说明

- 生产分支：`main`
- 默认首页路由：`/`

## Cloudflare Workers

### 仓库 / 根目录设置

- 仓库：`supoju/webofinsight`
- 根目录：`game-engine`

### 构建设置

- 安装命令：`npm install`
- 构建命令：`npm run cf:build`

### 部署设置

- 部署命令：`npm run deploy`

### Wrangler 配置

- 配置文件：`game-engine/wrangler.jsonc`
- Worker 名称：`webofinsight-game-engine`
- 主入口：`.open-next/worker.js`
- 静态资源目录：`.open-next/assets`
- Compatibility Date：`2026-03-27`
- Compatibility Flags：
  - `nodejs_compat`
  - `global_fetch_strictly_public`

### 重要选择

- 使用：`Cloudflare Workers`
- 不要使用：`Cloudflare Pages` 静态导出

### 首次认证

- 首次部署前先在本地执行：`npx wrangler login`

## 本地验证命令

```bash
npm --prefix game-engine run build
npm --prefix game-engine run cf:build
```
