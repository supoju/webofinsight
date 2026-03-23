# Worktree Topology

## Roles

- `main/orchestrator`: owns review, interface freeze, merge decisions
- `content-lab`: owns `content-lab/data` and `content-lab/copy`
- `game-engine`: owns app code, UI, gameplay logic, deployment

## Shared contract

- `content-lab/data/questions.json`
- `content-lab/copy/home.md`
- `content-lab/copy/results.md`
- `content-lab/copy/share.md`
- `content-lab/pacing/sequence.md`

Only `main/orchestrator` approves contract changes.
