const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('ink mobile HUD direction', () => {
  test('ArtFactory creates brush-styled HUD textures matching the vertical reference', () => {
    const source = read('src/systems/ArtFactory.js');

    expect(source).toContain("'hud_logo_panel'");
    expect(source).toContain("'hud_brush_bar'");
    expect(source).toContain("'hud_score_box'");
    expect(source).toContain("'hud_joystick_ring'");
    expect(source).toContain("'hud_skill_button'");
    expect(source).toContain("'hud_item_slot'");
  });

  test('HUD builds the reference-style top layout: logo, HP/ST brush bars, and score box', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain('_buildTopInkHud');
    expect(source).toContain("'hud_logo_panel'");
    expect(source).toContain("'21NL'");
    expect(source).toContain("'hud_brush_bar'");
    expect(source).toContain("'hud_score_box'");
    expect(source).toContain('this.hpValueText');
    expect(source).toContain('this.staminaValueText');
  });

  test('HUD builds bottom mobile controls with a joystick, three skill buttons, and right item slots', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain('_buildBottomInkControls');
    expect(source).toContain("'hud_joystick_ring'");
    expect(source).toContain("'hud_skill_button'");
    expect(source).toContain("'hud_item_slot'");
    expect(source).toContain("'참격'");
    expect(source).toContain("'대시'");
    expect(source).toContain("'필살'");
  });
});
