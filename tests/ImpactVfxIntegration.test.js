const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('impact VFX integration', () => {
  test('BootScene loads dedicated impact VFX assets', () => {
    const source = read('src/scenes/BootScene.js');

    expect(source).toContain("this.load.image('impact_ink_burst', 'assets/generated/impact-ink-burst.png')");
    expect(source).toContain("this.load.image('impact_brush_ring', 'assets/generated/impact-brush-ring.png')");
    expect(source).toContain("this.load.image('combo_brush_smear', 'assets/generated/combo-brush-smear.png')");
    expect(source).toContain("this.load.image('heavy_hit_flash', 'assets/generated/heavy-hit-flash.png')");
  });

  test('impact VFX assets exist in the generated asset directory', () => {
    [
      'impact-ink-burst.png',
      'impact-brush-ring.png',
      'combo-brush-smear.png',
      'heavy-hit-flash.png',
    ].forEach((name) => {
      const file = path.join(__dirname, '..', 'assets', 'generated', name);
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeGreaterThan(1000);
    });
  });

  test('GameScene layers impact burst, brush ring, combo smear, and flash on hits', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('_impactInkBurst');
    expect(source).toContain("'impact_ink_burst'");
    expect(source).toContain("'impact_brush_ring'");
    expect(source).toContain("'combo_brush_smear'");
    expect(source).toContain("'heavy_hit_flash'");
    expect(source).toContain("this._impactInkBurst(enemy.x, enemy.y, 'kill'");
    expect(source).toContain("this._impactInkBurst(enemy.x, enemy.y, 'hit'");
    expect(source).toContain("this._comboBrushSmear(char, comboStep)");
  });
});
