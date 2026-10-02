const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('light-devouring monochrome visual direction', () => {
  test('BootScene loads the absorber character and light-devour VFX assets', () => {
    const source = read('src/scenes/BootScene.js');

    expect(source).toContain("this.load.image('absorber_char', 'assets/generated/absorber-char.png')");
    expect(source).toContain("this.load.image('light_shard_top', 'assets/generated/light-shard-top.png')");
    expect(source).toContain("this.load.image('light_shard_bottom', 'assets/generated/light-shard-bottom.png')");
    expect(source).toContain("this.load.image('absorb_trail', 'assets/generated/absorb-trail.png')");
    expect(source).toContain("this.load.image('absorb_aura', 'assets/generated/absorb-aura.png')");
  });

  test('generated light-devour assets exist for packaging', () => {
    [
      'absorber-char.png',
      'light-shard-top.png',
      'light-shard-bottom.png',
      'absorb-trail.png',
      'absorb-aura.png',
    ].forEach((name) => {
      const file = path.join(__dirname, '..', 'assets', 'generated', name);
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeGreaterThan(1000);
    });
  });

  test('GameScene creates top and bottom light guides and absorption feedback', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('_createLightGuides()');
    expect(source).toContain('_syncLightGuides');
    expect(source).toContain('_absorbLightFeedback');
    expect(source).toContain("'light_shard_top'");
    expect(source).toContain("'light_shard_bottom'");
    expect(source).toContain("'absorb_trail'");
    expect(source).toContain("'absorb_aura'");
  });

  test('ElectricCharacter uses the new absorber silhouette as the primary ally design', () => {
    const source = read('src/entities/ElectricCharacter.js');

    expect(source).toContain("super(scene, x, y, 'absorber_char', stat)");
  });
});
