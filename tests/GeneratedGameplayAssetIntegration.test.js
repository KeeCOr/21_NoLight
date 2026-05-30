const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('generated gameplay art integration', () => {
  test('BootScene loads generated character, world, and VFX sprites over procedural fallbacks', () => {
    const source = read('src/scenes/BootScene.js');

    expect(source).toContain("this.load.image('electric_char', 'assets/generated/electric-char.png')");
    expect(source).toContain("this.load.image('mecha_char', 'assets/generated/mecha-char.png')");
    expect(source).toContain("this.load.image('enemy', 'assets/generated/enemy.png')");
    expect(source).toContain("this.load.image('pursuer', 'assets/generated/pursuer.png')");
    expect(source).toContain("this.load.image('platform', 'assets/generated/platform.png')");
    expect(source).toContain("this.load.image('brush_slash', 'assets/generated/brush-slash.png')");
    expect(source).toContain("this.load.image('ink_splatter', 'assets/generated/ink-splatter.png')");
    expect(source).toContain("this.load.image('blood_ink', 'assets/generated/blood-ink.png')");
    expect(source).toContain("this.load.image('life_orb', 'assets/generated/life-orb.png')");
  });

  test('sliced generated gameplay assets exist in the packaged assets directory', () => {
    [
      'electric-char.png',
      'mecha-char.png',
      'enemy.png',
      'pursuer.png',
      'platform.png',
      'brush-slash.png',
      'ink-splatter.png',
      'blood-ink.png',
      'life-orb.png',
    ].forEach((name) => {
      const file = path.join(__dirname, '..', 'assets', 'generated', name);
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeGreaterThan(1000);
    });
  });
});
