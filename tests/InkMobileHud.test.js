const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('ink mobile HUD direction', () => {
  test('BootScene preloads ink-styled HUD nineslice and spritesheet assets', () => {
    const source = read('src/scenes/BootScene.js');

    expect(source).toContain("'iw_hud_surface'");
    expect(source).toContain("'iw_brush_gauge'");
    expect(source).toContain("'iw_item_slot'");
    expect(source).toContain("'iw_tutorial_paper'");
    expect(source).toContain("'iw_round_controls'");
    expect(source).toContain('frameWidth: 160');
  });

  test('HUD builds the reference-style top layout: logo, HP/ST brush bars, and score box', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain('_buildTopInkHud');
    expect(source).toContain("'iw_hud_surface'");
    expect(source).toContain("'21NL'");
    expect(source).toContain("'iw_brush_gauge'");
    expect(source).toContain('this.hpValueText');
    expect(source).toContain('this.staminaValueText');
  });

  test('HUD builds bottom mobile controls with a joystick, three skill buttons, and right item slots', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain('_buildBottomInkControls');
    expect(source).toContain("'iw_round_controls', 0");
    expect(source).toContain("'iw_round_controls', 1");
    expect(source).toContain("'iw_item_slot'");
    expect(source).toContain("'참격'");
    expect(source).toContain("'대시'");
    expect(source).toContain("'필살'");
  });

  test('HUD builds the tutorial paper panel', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain('_buildTutorialPanel');
    expect(source).toContain("'iw_tutorial_paper'");
  });
});
