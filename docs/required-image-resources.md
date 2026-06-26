# Required Image Resources

This list tracks the bitmap resources needed to move the game from procedural placeholder art toward the sumi-e dieselpunk direction shown in the gameplay reference.

## Generated Sheets

| File | Purpose | Contents |
| --- | --- | --- |
| `public/assets/generated/sumi-character-sheet.png` | Character and enemy source art | Electric fighter, mechanical arm fighter, small ink spirit enemy, large hunter pursuer |
| `public/assets/generated/sumi-world-sheet.png` | Stage and background source art | Long dark platforms, floating cliffs, distant mountains, banners, lanterns, pagodas, ink drips |
| `public/assets/generated/sumi-vfx-sheet.png` | Combat feedback source art | Brush slashes, electric bolts, impact sparks, ink splatters, blood ink, life orbs, smoke wisps |
| `public/assets/generated/sumi-hud-sheet.png` | HUD and icon source art | HP frame, stamina frame, score panel, portrait frame, skill frames, gold corners, medallions, item icons |

## Extraction Targets

These sheets should be sliced into individual runtime sprites before replacing the current procedural `ArtFactory` textures.

### Characters

- `electric_char`
- `mecha_char`
- `enemy`
- `pursuer`
- `portrait_electric`
- `portrait_mecha`

### World

- `platform_long_01` through `platform_long_06`
- `floating_cliff_01` through `floating_cliff_03`
- `bg_mountain_01` through `bg_mountain_03`
- `banner_01`, `banner_02`
- `lantern_01`, `lantern_02`
- `pagoda_01`, `pagoda_02`
- `ink_drip_01` through `ink_drip_06`

### VFX

- `brush_slash_01` through `brush_slash_04`
- `electric_bolt_01` through `electric_bolt_04`
- `impact_spark_01` through `impact_spark_04`
- `ink_splatter_01` through `ink_splatter_04`
- `blood_ink_01` through `blood_ink_03`
- `life_orb_01` through `life_orb_03`
- `smoke_wisp_01`, `smoke_wisp_02`

### UI

- `hp_bar_frame`
- `stamina_bar_frame`
- `score_panel_frame`
- `portrait_frame`
- `skill_icon_frame`
- `pause_button_frame`
- `ui_gold_corner_01` through `ui_gold_corner_04`
- `brass_medallion_01`, `brass_medallion_02`
- `item_scroll`
- `item_compass_gear`
- `item_red_potion`
- `item_green_potion`

## Notes

- The generated assets use paper-colored backgrounds. For runtime sprites, slice the sheets and remove the paper background or use multiply/blend modes where appropriate.
- The platform and VFX sheets are the easiest first replacement targets because they already align closely with the current procedural texture keys.
- Character sprites are concept-quality source art. They may need manual cleanup, scale normalization, and transparent background extraction before direct gameplay use.

## 2026-06-26 Applied Runtime VFX Refresh

The following existing runtime PNG paths were refreshed with image-generated sumi-e dieselpunk VFX while preserving the filenames used by `BootScene.js` and combat feedback systems:

| Runtime file | Target canvas | Runtime texture key |
| --- | ---: | --- |
| `assets/generated/brush-slash.png` | 295x160 | `brush_slash` |
| `assets/generated/impact-brush-ring.png` | 256x256 | `impact_brush_ring` |
| `assets/generated/impact-ink-burst.png` | 256x256 | `impact_ink_burst` |
| `assets/generated/combo-brush-smear.png` | 320x192 | `combo_brush_smear` |
| `assets/generated/heavy-hit-flash.png` | 256x256 | `heavy_hit_flash` |

Generation note: source images were generated on a flat chroma-key background, alpha-extracted locally, resized onto transparent runtime canvases, and saved over the existing referenced PNG paths.
