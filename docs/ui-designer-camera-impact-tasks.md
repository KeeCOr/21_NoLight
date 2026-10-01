# UI Designer Task List - Camera Impact

## Goal
Improve InkWarrior's action feel by making camera movement, hit-stop, and ink VFX read as one intentional strike.

## Must Review
- `docs/21NL_gameplay_preview.png`
- `src/scenes/GameScene.js` camera impact timings
- `src/systems/CameraImpactProfile.js` impact profile values

## Task Checklist
- [ ] Tune basic hit camera nudge so it follows slash direction without making HUD text hard to read.
- [ ] Compare combo 2 and combo 3 profiles; combo 3 should feel like a finisher, not just a larger shake.
- [ ] Check kill impact: black ink flash should feel decisive but not hide enemy drops.
- [ ] Check skill impact: zoom must stay readable around the player and not clip bottom controls.
- [ ] Verify rush warning camera does not fight the pursuer alert text.
- [ ] Record desktop and tall-window captures for basic hit, combo finisher, kill, skill, and pursuer rush.
- [ ] Note any HUD elements that should be isolated from camera shake in a later UI pass.

## Suggested Tuning Ranges
- Basic hit nudge: 4-7 px, recovery 110-140 ms.
- Combo finisher nudge: 13-18 px, recovery 160-210 ms.
- Kill nudge: 16-24 px, recovery 220-280 ms.
- Skill zoom cap: 1.055.
- Repeated hit-stop should stay under 75 ms except for finishers.

## Acceptance Notes
- The player should understand strike direction within 400 ms.
- Camera motion should enhance the brush slash, not replace it.
- Bottom skill buttons and top HP/ST bars must remain readable during impact.
