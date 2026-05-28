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

  test('HUD uses generated frames for bars, score, portraits, and bottom command buttons', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain("'ui_hp_frame'");
    expect(source).toContain("'ui_stamina_frame'");
    expect(source).toContain("'ui_score_frame'");
    expect(source).toContain("'ui_portrait_frame'");
    expect(source).toContain('_buildCommandButtons');
    expect(source).toContain("'ui_button_frame'");
  });

  test('Main menu uses generated button and frame art for the start prompt', () => {
    const source = read('src/scenes/MainMenuScene.js');

    expect(source).toContain("'ui_button_frame'");
    expect(source).toContain("'ui_score_frame'");
  });
});
