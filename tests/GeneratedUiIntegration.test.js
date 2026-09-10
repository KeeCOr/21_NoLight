const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('generated UI asset integration', () => {
  test('BootScene loads sliced generated HUD buttons and frames from packaged assets', () => {
    const source = read('src/scenes/BootScene.js');

    expect(source).toContain("this.load.image('ui_hp_frame', 'assets/generated/ui-hp-frame.png')");
    expect(source).toContain("this.load.image('ui_stamina_frame', 'assets/generated/ui-stamina-frame.png')");
    expect(source).toContain("this.load.image('ui_portrait_frame', 'assets/generated/ui-portrait-frame.png')");
  });

  test('BootScene keeps ui_score_frame and ui_button_frame runtime keys but loads the wide-v002 generated art', () => {
    const source = read('src/scenes/BootScene.js');

    expect(source).toContain("this.load.image('ui_score_frame', 'assets/generated/ui-score-frame-wide-v002.png')");
    expect(source).toContain("this.load.image('ui_button_frame', 'assets/generated/ui-button-frame-wide-v002.png')");
  });

  test('HUD uses reference-style brush HUD art for bars, score, and bottom controls', () => {
    const bootSource = read('src/scenes/BootScene.js');
    const source = read('src/ui/HUD.js');

    expect(bootSource).toContain("this.load.image('iw_hud_surface', 'assets/generated/iw-hud-surface-9s.png')");
    expect(bootSource).toContain("this.load.image('iw_brush_gauge', 'assets/generated/iw-brush-gauge-9s.png')");
    expect(bootSource).toContain("this.load.image('iw_item_slot', 'assets/generated/iw-item-slot-9s.png')");
    expect(bootSource).toContain("this.load.image('iw_tutorial_paper', 'assets/generated/iw-tutorial-paper-9s.png')");
    expect(bootSource).toContain("this.load.spritesheet('iw_round_controls', 'assets/generated/iw-round-control-atlas.png', { frameWidth: 160, frameHeight: 160 })");

    expect(source).toContain("'iw_hud_surface'");
    expect(source).toContain("'iw_brush_gauge'");
    expect(source).toContain("'iw_item_slot'");
    expect(source).toContain("'iw_tutorial_paper'");
    expect(source).toContain("'iw_round_controls', 0");
    expect(source).toContain("'iw_round_controls', 1");
    expect(source).toContain('_buildBottomInkControls');
  });

  test('Main menu uses generated button and frame art for the start prompt', () => {
    const source = read('src/scenes/MainMenuScene.js');

    expect(source).toContain("'ui_button_frame'");
    expect(source).toContain("'ui_score_frame'");
  });

  test('HUD text falls back through Korean-safe fonts for Hangul labels', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain("fontFamily: 'Noto Sans KR, Malgun Gothic, Arial Black'");
  });
});
