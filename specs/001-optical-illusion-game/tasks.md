# Tasks: Optical Illusion Game

## Phase 1: Orchestrator Setup

- [ ] T001 Create and freeze feature docs in `specs/001-optical-illusion-game/spec.md`, `specs/001-optical-illusion-game/plan.md`, and `specs/001-optical-illusion-game/tasks.md`
- [ ] T002 Define shared contract ownership in [docs/worktrees.md](/D:/codexproject/poju/webofinsight/docs/worktrees.md)
- [ ] T003 Create interface placeholder paths in `content-lab/data/`, `content-lab/copy/`, and `content-lab/pacing/`

## Phase 2: Content-Lab Delivery

- [ ] T004 [US4] Author `content-lab/data/questions.json` with 20 entries and required schema
- [ ] T005 [P] [US4] Write homepage authored copy in `content-lab/copy/home.md`
- [ ] T006 [P] [US3] Write result interpretation copy in `content-lab/copy/results.md`
- [ ] T007 [P] [US3] Write share copy templates in `content-lab/copy/share.md`
- [ ] T008 [US4] Document pacing rhythm and reversal sequence in `content-lab/pacing/sequence.md`
- [ ] T009 [US4] Review content files for boundary compliance so no engine-owned code is modified

## Phase 3: Game-Engine Foundation

- [ ] T010 Initialize Next.js App Router project with TypeScript and Tailwind in the engine worktree root
- [ ] T011 Create application shell and route structure for home, play, and result pages
- [ ] T012 [P] Implement content-loading and schema-validation utilities in `lib/content/`
- [ ] T013 [P] Implement browser-safe persistence helpers in `lib/storage/`
- [ ] T014 Implement challenge session model and navigation guards in `lib/game/`
- [ ] T015 Add theme support for light and dark mode

## Phase 4: Illusion Rendering And Gameplay

- [ ] T016 [US2] Implement `MullerLyer` renderer in `components/illusions/`
- [ ] T017 [US2] Implement `Ponzo` renderer in `components/illusions/`
- [ ] T018 [US2] Implement `Ebbinghaus` renderer in `components/illusions/`
- [ ] T019 [US2] Implement `VerticalHorizontal` renderer in `components/illusions/`
- [ ] T020 [US2] Implement `Zollner` renderer in `components/illusions/`
- [ ] T021 [US2] Implement `CafeWall` renderer in `components/illusions/`
- [ ] T022 [US2] Implement `CheckerShadow` renderer in `components/illusions/`
- [ ] T023 [US2] Implement `Delboeuf` renderer in `components/illusions/`
- [ ] T024 [US2] Add ambiguous-image placeholder assets or SVG fallbacks in `public/` or `components/illusions/`
- [ ] T025 [US1] Implement homepage UI with title, subtitle, start action, best score, recent result, and instructions
- [ ] T026 [US2] Implement question screen with progress, timer, illusion display, and large answer buttons
- [ ] T027 [P] [US2] Implement timer and timeout auto-fail behavior
- [ ] T028 [P] [US2] Implement question selection utility for 10 random scoring questions
- [ ] T029 [P] [US2] Implement unified scoring and reaction-time calculation utilities
- [ ] T030 [US2] Connect answer submission, timeout flow, and automatic advance

## Phase 5: Results, Review, And Share

- [ ] T031 [US3] Implement result summary screen with score, accuracy, average reaction time, title tier, and replay
- [ ] T032 [P] [US3] Implement weakest-category analysis and personality-style interpretation
- [ ] T033 [P] [US3] Implement wrong-answer review with explanations
- [ ] T034 [P] [US3] Implement share card generation on the frontend
- [ ] T035 [US1] Persist best score and recent result to `localStorage`
- [ ] T036 [US3] Load persisted high score and recent result on return visits

## Phase 6: Verification And Deployment

- [ ] T037 Add utility tests for content validation, selection rules, and scoring logic
- [ ] T038 Add gameplay smoke coverage for home -> play -> result
- [ ] T039 Verify mobile layout, dark mode, and graceful fallback behavior
- [ ] T040 Write local run and Vercel deployment instructions in `README.md`
- [ ] T041 Verify `npm install` and `npm run dev` succeed in the engine worktree
- [ ] T042 Orchestrator review for contract compliance and merge readiness
