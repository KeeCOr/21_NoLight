const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('monochrome ink art direction', () => {
  test('BootScene loads generated monochrome landscape support assets', () => {
    const source = read('src/scenes/BootScene.js');

    expect(source).toContain("this.load.image('bg_mountain_generated', 'assets/generated/bg-mountain.png')");
    expect(source).toContain("this.load.image('ink_wall', 'assets/generated/ink-wall.png')");
  });

  test('GameScene applies dense monochrome ink landscape and foreground grading', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('_createInkLandscape()');
    expect(source).toContain('_applyMonochromeTint');
    expect(source).toContain("'bg_mountain_generated'");
    expect(source).toContain("'ink_wall'");
    expect(source).toContain('this.inkGrade');
  });

  test('combat feedback favors black ink over neon accent colors', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain("this._impactBurst(enemy.x, enemy.y, 0x05070b");
    expect(source).toContain("this._dashTrail(char, 0x05070b)");
    expect(source).toContain("this._slashArc(current, 0x05070b");
    expect(source).toContain('bolt.lineStyle(8 - Math.min(comboStep, 2), 0x05070b');
  });

  test('characters and enemies are toned toward ink silhouettes', () => {
    const base = read('src/entities/BaseCharacter.js');
    const enemy = read('src/entities/Enemy.js');
    const pursuer = read('src/entities/Pursuer.js');

    expect(base).toContain('this.setTint(0x2a2823)');
    expect(enemy).toContain('this.setTint(0x1d1b18)');
    expect(pursuer).toContain('this.setTint(0x1a1714)');
  });
});
