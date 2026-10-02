# InkWarrior Next Improvement Instruction

## Completed 2026-09-23 v0.12.2

- 일반 적 처치로 즉시 완료되던 60초 수련 판정을 수정했다.
- 공격·회피 3회 뒤 실제 적 하나를 강적으로 승격하고 강적 처치만 완료로 인정한다.
- 남은 시간, 초과 시간, 정시/초과 완료 상태를 기존 수묵 목표띠에 연결했다.
- 목표 화면: `docs/design-references/2026-09-23_60초수련_강적해금_목표화면.png`.
- 검증: Jest 42개 스위트·138개 테스트와 v0.12.2 포터블 빌드 통과. 900×1600에서 튜토리얼 보호와 목표띠 전환, 콘솔 오류 없음 확인. 강적 해금 이후 실제 플레이는 미검증이다.

## Next Candidate 2026-09-23

- 실제 플레이로 강적 승격 위치와 시간초과 전환을 확인하고, 필요하면 강적 등장 위치를 카메라 안쪽으로 제한한다.

Date: 2026-06-24

## Completed 2026-09-22 v0.12.1

- 튜토리얼 자리에서 이어지는 60초 전투 목표띠를 구현했다.
- 첫 적중, 공격·회피 단련, 강적 처치, 보상·다음 층 상태를 분리했다.
- 목표 화면: `docs/design-references/2026-09-22_60초수묵수련_목표화면.png`.
- 검증: Jest 135개와 포터블 패키징 통과. 목표띠 전환 후 실제 화면은 미검증.

## Next Candidate

- 실제 60초 수동 플레이로 목표 전환 시점과 강적 스폰 타이밍을 확인한다.

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
## 2026-06-30 Verification Note
- Reverified the existing combat smoke path and planning consistency after the v0.7.0 package refresh.
- Validation: `npm test` passed 36 suites / 110 tests; current release artifact is `release/InkWarrior_v0.7.0_portable.exe`.
- Remaining follow-up is still visual-language breadth: scene-level attack/dodge/hit/stagger/defeat VFX rules and bitmap replacement for newly touched final-facing combat art.

## 2026-07-02 Package Metadata Verification Note
- Fixed the audit-facing package metadata compatibility gap by making `package.json` description and author ASCII-safe.
- Added `tests/PackageMetadata.test.js` and verified `npm test -- --runInBand` passes 39 suites / 122 tests.
- Rebuilt and copied `21NL_v0.9.0_portable.exe` to the project root and Google Drive execution folder.


## 2026-09-18 전체 프로젝트 공통 완료 조건

1. **첫 5분 핵심 루프**: 시작 10초 안에 목표가 읽히고, 5분 안에 첫 판단→실행→결과→보상/손실→다음 목표가 한 번 완결되어야 한다.
2. **판단 전후 피드백**: 선택 전 예상 이득·위험·비용, 실행 직후 성공·실패·상태 변화, 결과 화면의 원인·변화·다음 점검 행동을 같은 흐름으로 제공한다. 정답을 자동 추천하지 않는다.
3. **출시 증거 패키지**: 테스트·빌드·첫 5분 수동 확인·대표 실행 화면·로딩/빈 상태/오류/저장 복귀·버전과 검증 날짜를 기록한다. 수행하지 않은 항목은 미검증으로 표시한다.

공통 기준 원문: `C:\Development\_workspace_docs\전체_프로젝트_공통_개선기준_2026-09-18.md`

## 2026-09-18 프로젝트별 고유 개선 3개
> 아래 세 항목은 이 프로젝트의 고유 우선순위다. 구현 후에만 완료로 표시한다.

1. 공격·회피·피격·처치를 400ms 내 다른 신호로 구분
2. 수묵 번짐과 붓질 방향이 실제 판정 정보를 전달
3. 60초 전투 데모에서 한 빌드 성장과 강적 처치 완결
