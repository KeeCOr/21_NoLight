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
    expect(source).toContain("this.load.image('ui_score_frame', 'assets/generated/ui-score-frame.png')");
    expect(source).toContain("this.load.image('ui_portrait_frame', 'assets/generated/ui-portrait-frame.png')");
    expect(source).toContain("this.load.image('ui_button_frame', 'assets/generated/ui-button-frame.png')");
  });

  test('HUD uses reference-style brush HUD art for bars, score, and bottom controls', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain("'hud_logo_panel'");
    expect(source).toContain("'hud_brush_bar'");
    expect(source).toContain("'hud_score_box'");
    expect(source).toContain('_buildBottomInkControls');
    expect(source).toContain("'hud_skill_button'");
  });

  test('Main menu uses generated button and frame art for the start prompt', () => {
    const source = read('src/scenes/MainMenuScene.js');

    expect(source).toContain("'ui_button_frame'");
    expect(source).toContain("'ui_score_frame'");
  });
});
