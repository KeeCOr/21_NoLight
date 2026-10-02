# InkWarrior 업데이트 내역서

## 2026-09-23 v0.12.2 강적 해금 수련 규칙

- 문제: 목표띠는 `첫 적중 → 붓길 성장 → 강적 처치`를 약속했지만 일반 적 한 명만 처치해도 완료됐고, 60초 시간 상태가 없었다.
- 예시 화면: `docs/design-references/2026-09-23_60초수련_강적해금_목표화면.png`.
- 컴포넌트 분해: 수련 상태 모델, 남은/초과 시간, 강적 해금 이벤트, 일반 적·강적 식별, 완료·초과 완료 피드백.
- 실제 적용: 공격·회피 합계 3회 뒤 가장 가까운 일반 적을 강적으로 승격한다. 적이 없으면 다음 생성 적을 강적으로 만든다. 일반 적 처치는 완료 수치에 포함되지 않으며 강적 처치만 수련을 끝낸다.
- 실행 확인 중 튜토리얼이 끝나기 전에 추격자에게 사망하는 차단 문제를 발견했다. 튜토리얼 동안 적 AI·추격·체력 감소·목표 집계뿐 아니라 캐릭터 중력과 이동도 멈추고, 안내 종료 시 플레이어와 추격자를 정상 시작점에 재배치한 뒤 전투와 타이머를 시작하도록 수정했다.
- UI 상태: 기본, 단련, 강적 해금, 시간 초과, 정시 완료, 초과 완료를 지원한다. 시간 초과 후에도 플레이를 막지 않고 강적 처치로 수련을 마무리할 수 있다.
- 변경 파일: `ActionFeedback.js`, `HUD.js`, `Enemy.js`, `GameScene.js`, 관련 테스트, package 버전과 문서.
- 검증: `npm test -- --runInBand` 42개 스위트·138개 테스트 통과. `npm run build`로 `release/21NL_v0.12.2_portable.exe` 생성 완료. 루트 사본과 SHA256 `D5A4850279FFBD6DD3C826724ED8F44A51D65ABFDA366C30ED7D6248472098EE` 일치.
- 수동 확인: 900×1600에서 시작 화면, 튜토리얼 중 HP 100·점수 0 유지, 목표띠 전환, `남은 시간 00:60`, 첫 적중 목표, 콘솔 오류 없음까지 확인했다.
- 알려진 문제: 강적 해금·강적 처치·시간 초과 화면은 순수 상태 테스트와 연결 테스트는 통과했지만 실제 플레이 육안 확인은 아직 필요하다. Electron 기본 아이콘 경고가 남아 있다.
- 다음 후보: 실제 60초 플레이에서 강적 승격 위치, 상단 목표띠 가독성, 60초 초과 전환을 확인한다.
## 2026-09-22 v0.12.1 60초 수묵 수련 목표띠
- 목표 화면: `docs/design-references/2026-09-22_60초수묵수련_목표화면.png`.
- 전투 이벤트를 첫 적중·단련·강적 처치 상태로 변환하는 순수 모델과 기존 비트맵 목표띠를 연결했다.
- 초기, 단련, 강적, 완료 상태를 지원하며 튜토리얼 중에는 숨긴다.
- 변경: `ActionFeedback.js`, `HUD.js`, 관련 테스트, package 버전, GDD·기획서·업데이트 문서.
- 검증: `npm test -- --runInBand` 41개 스위트·135개 테스트 통과, `npm run build` 통과, `release/21NL_v0.12.1_portable.exe`와 루트 사본 해시 일치.
- 수동 확인: 900×1600 시작·튜토리얼 화면 무겹침과 콘솔 오류 없음 확인. 목표띠 전환 후 화면은 추격자 사망으로 미검증.
- 알려진 문제: Electron 기본 아이콘 사용 경고, 기존 v0.12.0 루트 실행 파일 보존.
- 다음 후보: 실제 60초 플레이에서 목표 전환 속도와 강적 스폰 타이밍을 검증한다.

## 2026-06-26 v0.4.1 combat smoke path
- Added SharkCombat.runSmokeEncounter to cover combat entry, player hit, enemy retaliation, and encounter end with real HP changes.
- Added a Jest smoke test for the full path in tests/SharkCombat.test.js.

## 2026-06-24 v0.3.0 ?꾪닾 ?쇰뱶諛?洹쒖튃 ?듯빀
- 怨듦꺽, ?뚰뵾, ?쇨꺽, 寃쎌쭅, ?⑤같 ?쇰뱶諛깆쓣 `strike / evade / wound / finish` 洹쒖튃?쇰줈 ?뺣━?덈떎.
- `ActionFeedback`??`attack`, `dodge`, `stagger`, `defeat` ??낃낵 ?꾪닾 ?ㅻえ???쒗???⑥닔瑜?異붽??덈떎.
- GameScene??泥섏튂/?뚰뵾/?쇳빐/怨듦꺽 ?쇰뱶諛??몄텧????洹쒖튃 ?대쫫??留욎톬??
- 癒?李멸꺽??肄붾뱶 ????곗텧??`impact_brush_ring` bitmap VFX濡?援먯껜?덈떎.
- 湲고쉷?쒕? ?섎Ⅴ?뚮굹 ?놁씠 寃뚯엫 ?뚭컻, 二쇱슂 ?쒖뒪?? ?뚮젅???덉떆 以묒떖?쇰줈 ?ㅼ떆 ?뺣━?덈떎.
- 寃利??덉젙: `npm test`, `npm run build`, `npm run build` 湲곕컲 portable ?⑦궎吏?

## 2026-06-24 臾몄꽌 援ъ“ ?뺣━
- 湲고쉷?쒖? ?낅뜲?댄듃 ?댁뿭?쒕? 遺꾨━?덈떎.
- 蹂寃??대젰, 援ы쁽 濡쒓렇, 寃利?湲곕줉? ??臾몄꽌?먯꽌 愿由ы븳??

## v0.2.0 移대찓???寃??곗텧
- `CameraImpactProfile` ?쒖닔 洹쒖튃 異붽?.
- 李멸꺽 諛⑺뼢 湲곕컲 移대찓??follow offset ?쏆? 異붽?.
- UI ?붿옄?대꼫 ?묒뾽 紐⑸줉 臾몄꽌 異붽?: `docs/ui-designer-camera-impact-tasks.md`.

## 湲곗〈 ?대젰 ?꾨낫
- 2026-05-18 ?곸뼱 ?꾪닾 ?쒖뒪??議곗젙.
- v0.1.3 ?꾩껜 寃뚯엫 猷⑦봽, 罹먮┃??援먯껜, 臾댄븳 泥?겕 留? HUD, ?앹꽦 ?꾪듃 ?먯뀑, Windows portable 鍮뚮뱶 諛섏쁺.

## 2026-06-26 v0.5.0 image-generated combat VFX refresh
- Replaced the runtime combat VFX PNGs at the existing `assets/generated/` paths with image-generated sumi-e dieselpunk assets.
- Updated assets: `brush-slash.png`, `impact-brush-ring.png`, `impact-ink-burst.png`, `combo-brush-smear.png`, and `heavy-hit-flash.png`.
- The new assets keep the same runtime filenames and target canvas sizes, so `BootScene.js`, `GameScene.js`, `ActionFeedback`, and `ComboHitReaction` continue using the existing texture keys.
- Source imagegen/chroma-key working files and original backups are stored under `_temp/vfx_imagegen_20260626/`.

## 2026-06-29 v0.6.0 combo impact VFX runtime stack
- Added combo-specific `impactVfx` metadata to `ComboHitReaction`.
- Updated `GameScene` so enemy hit/kill feedback consumes the metadata-driven brush ring, combo smear, heavy-hit flash, and ink burst layers.
- Preserved existing generated PNG asset paths and texture keys.
## 2026-06-30 Verification Note
- Reverified the existing combat smoke path and planning consistency after the v0.7.0 package refresh.
- Validation: `npm test` passed 36 suites / 110 tests; current release artifact is `release/InkWarrior_v0.7.0_portable.exe`.
- Remaining follow-up is still visual-language breadth: scene-level attack/dodge/hit/stagger/defeat VFX rules and bitmap replacement for newly touched final-facing combat art.

## 2026-06-30 v0.9.0 grotesque monster variants
- Added MonsterVariantPlan for maw, spine, many-eyes, and crawler enemy silhouettes.
- Added generated Phaser texture keys for the new monster shapes while preserving the monochrome ink direction.
- Increased non-start chunk enemy spawns from 1~3 to 2~4 to raise combat density.

## 2026-07-02 v0.9.0 Package Metadata Compatibility
- Changed package distribution metadata to ASCII-safe `description` and `author` values so Node, Jest, and PowerShell audit scripts parse it consistently.
- Added `tests/PackageMetadata.test.js` to lock the package name, version, description, author, and ASCII compatibility.
- Validation: `npm test -- --runInBand` passed 39 suites / 122 tests.
- Build/release: `npm run build` produced `release/21NL_v0.9.0_portable.exe`; the same file was copied to the project root and Google Drive execution folder.

## 2026-07-15 / v0.10.0
- 전투 콜아웃에 density cue를 추가해 공격/회피/피격/처치의 60초 리듬을 명확히 분리했다.
- GameScene이 ActionFeedback의 anchor/layer/timeline/pulse scale을 소비하도록 정리했다.
- 검증: npm test 39 suites / 124 tests 통과.
