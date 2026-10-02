# Project Instructions

## Project Identity

`21_NL / InkWarrior`는 수묵풍 근접 전투 게임이다. 공격, 피격, 회피, 처치 순간의 피드백 규칙을 일관되게 고정하는 것이 핵심이다.

## Authoritative Stack

- Electron + Phaser + Jest 구조를 기준으로 한다.
- `package.json`, `main.js`, 게임 소스, `tests/`, `docs/`를 우선한다.
- 빌드는 Electron portable 산출물 기준을 따른다.

## Build And Verification

- 일반 테스트: `npm test`.
- 빌드: `npm run build`.
- Electron 빌드 후 실행파일명과 release/root artifact 최신성을 확인한다.
- 전투 피드백 변경은 화면 확인 또는 가장 가까운 수동 검증을 포함한다.

## Documentation Rules

- `docs/InkWarrior_기획서.md`와 `docs/InkWarrior_기획서.html`을 함께 유지한다.
- `docs/next_improvement_instruction.md`는 전투 피드백 개선 기준으로 유지한다.
- 리소스 목록과 카메라/임팩트 작업 문서는 실제 참조와 맞춘다.

## Resource And Preview Rules

- 대표 이미지는 `docs/InkWarrior_gameplay_preview.png`, `docs/21NL_gameplay_preview.png`, `_workspace_docs/project_previews/21_InkWarrior_21NL_gameplay_preview.png` 계열을 우선한다.
- 수묵풍 VFX/피격/처치 리소스는 실제 런타임 참조를 확인한다.
- 카메라 충격과 피드백은 과도하게 겹치지 않게 한다.

## AI-Assisted Workflow

1. Plan: 공격, 회피, 피격, 처치 중 어떤 순간을 강화할지 정한다.
2. Split: 전투 로직, VFX/카메라, 테스트, 문서 갱신을 분리한다.
3. Build: Phaser/Electron 구조를 유지하며 좁게 수정한다.
4. Verify: Jest, 빌드, 화면 피드백, GDD/HTML 동기화를 확인한다.
5. Reflect: 반복되는 전투 피드백 규칙을 이 파일이나 GDD에 남긴다.

## Do Not

- 수묵풍 정체성을 흐리는 범용 UI/이펙트로 바꾸지 않는다.
- 리소스를 추가만 하고 런타임 참조를 빠뜨리지 않는다.
- 빌드 실패 상태에서 portable 최신화를 주장하지 않는다.
