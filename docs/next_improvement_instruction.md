# InkWarrior Next Improvement Instruction

Date: 2026-06-24

## Goal
Turn the current biggest project issue into a small, executable improvement batch. This file is intentionally scoped so the next worker can start without rereading the whole workspace audit.

## Instructions
1. Lock a consistent feedback rule for attack, dodge, hit, stagger, and defeat so the ink-combat language stays coherent.
2. Replace any touched final-facing code-drawn combat artwork with bitmap sprites/VFX resources.
3. Add one smoke-test path for entering combat, landing a hit, taking damage, and ending an encounter.

## Completion Rules
- Do not include discarded projects in this batch.
- If gameplay, UI, systems, content, controls, build behavior, or project scope changes, update the project planning document and update log before build/release.
- If runtime source changes, run the nearest available validation and then perform the required build/package step from the project instructions.
- If a folder or asset looks ambiguous, document the decision instead of deleting it.

## Completed 2026-06-26 v0.4.1

- Added `SharkCombat.runSmokeEncounter()` to cover combat entry, player hit, enemy retaliation, and encounter end with real HP mutation.
- Added a Jest smoke test for the complete enter -> hit -> damage -> end path.
- Updated InkWarrior planning and update-history documents for v0.4.1.
- Verified with `npm test` and release packaging.

## Remaining Follow-up

- Lock a broader shared visual feedback rule for attack, dodge, hit, stagger, and defeat across scene-level VFX.
- Replace any newly touched final-facing code-drawn combat artwork with bitmap sprites/VFX resources.