# InkWarrior ?낅뜲?댄듃 ?댁뿭??
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
