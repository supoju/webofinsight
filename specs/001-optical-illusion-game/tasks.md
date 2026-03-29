# Tasks: Optical Illusion Game

## Phase 1: Orchestrator Setup

- [x] T001 Create and freeze feature docs in `specs/001-optical-illusion-game/spec.md`, `specs/001-optical-illusion-game/plan.md`, and `specs/001-optical-illusion-game/tasks.md`
- [x] T002 Define shared contract ownership in [docs/worktrees.md](/D:/codexproject/poju/webofinsight/docs/worktrees.md)
- [x] T003 Create interface placeholder paths in `content-lab/data/`, `content-lab/copy/`, and `content-lab/pacing/`

## Phase 2: Content-Lab Delivery

- [x] T004 [US4] Author `content-lab/data/questions.json` with 20 entries and required schema
- [x] T005 [P] [US4] Write homepage authored copy in `content-lab/copy/home.md`
- [x] T006 [P] [US3] Write result interpretation copy in `content-lab/copy/results.md`
- [x] T007 [P] [US3] Write share copy templates in `content-lab/copy/share.md`
- [x] T008 [US4] Document pacing rhythm and reversal sequence in `content-lab/pacing/sequence.md`
- [x] T009 [US4] Review content files for boundary compliance so no engine-owned code is modified

## Phase 3: Game-Engine Foundation

- [x] T010 Initialize Next.js App Router project with TypeScript and Tailwind in the engine worktree root
- [x] T011 Create application shell and route structure for home, play, and result pages
- [x] T012 [P] Implement content-loading and schema-validation utilities in `lib/content/`
- [x] T013 [P] Implement browser-safe persistence helpers in `lib/storage/`
- [x] T014 Implement challenge session model and navigation guards in `lib/game/`
- [x] T015 Add theme support for light and dark mode

## Phase 4: Illusion Rendering And Gameplay

- [x] T016 [US2] Implement `MullerLyer` renderer in `components/illusions/`
- [x] T017 [US2] Implement `Ponzo` renderer in `components/illusions/`
- [x] T018 [US2] Implement `Ebbinghaus` renderer in `components/illusions/`
- [x] T019 [US2] Implement `VerticalHorizontal` renderer in `components/illusions/`
- [x] T020 [US2] Implement `Zollner` renderer in `components/illusions/`
- [x] T021 [US2] Implement `CafeWall` renderer in `components/illusions/`
- [x] T022 [US2] Implement `CheckerShadow` renderer in `components/illusions/`
- [x] T023 [US2] Implement `Delboeuf` renderer in `components/illusions/`
- [x] T024 [US2] Add ambiguous-image placeholder assets or SVG fallbacks in `public/` or `components/illusions/`
- [x] T025 [US1] Implement homepage UI with title, subtitle, start action, best score, recent result, and instructions
- [x] T026 [US2] Implement question screen with progress, timer, illusion display, and large answer buttons
- [x] T027 [P] [US2] Implement timer and timeout auto-fail behavior
- [x] T028 [P] [US2] Implement question selection utility for 10 random scoring questions
- [x] T029 [P] [US2] Implement unified scoring and reaction-time calculation utilities
- [x] T030 [US2] Connect answer submission, timeout flow, and automatic advance

## Phase 5: Results, Review, And Share

- [x] T031 [US3] Implement result summary screen with score, accuracy, average reaction time, title tier, and replay
- [x] T032 [P] [US3] Implement weakest-category analysis and personality-style interpretation
- [x] T033 [P] [US3] Implement wrong-answer review with explanations
- [x] T034 [P] [US3] Implement share card generation on the frontend
- [x] T035 [US1] Persist best score and recent result to `localStorage`
- [x] T036 [US3] Load persisted high score and recent result on return visits

## Phase 6: Verification And Deployment

- [x] T037 Add utility tests for content validation, selection rules, and scoring logic
- [x] T038 Add gameplay smoke coverage for home -> play -> result
- [x] T039 Verify mobile layout, dark mode, and graceful fallback behavior
- [x] T040 Write local run and Vercel deployment instructions in `README.md`
- [x] T041 Verify `npm install` and `npm run dev` succeed in the engine worktree
- [x] T042 Orchestrator review for contract compliance and merge readiness

## Phase 7: Content Bank Expansion

- [x] T043 Update content contract docs for the expanded mixed bank in `spec.md`, `plan.md`, and `tasks.md`
- [x] T044 [P] Extend question typing and schema validation for generator-authored variants in `game-engine/src/types/content.ts` and `game-engine/src/lib/content/schema.ts`
- [x] T045 [P] Extend illusion rendering to consume authored generator variants in `game-engine/src/components/illusions/`
- [x] T046 [US4] Expand `content-lab/data/questions.json` to 80 score questions plus 4-8 analysis questions
- [x] T047 [P] [US4] Update `content-lab/pacing/sequence.md` so the larger bank preserves progression and category balance
- [x] T048 Add validation coverage for expanded bank counts and generator variants
- [x] T049 Verify `npm --prefix game-engine run test` and `npm --prefix game-engine run build` after the bank expansion
