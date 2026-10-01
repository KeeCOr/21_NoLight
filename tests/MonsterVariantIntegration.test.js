const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('monster variant integration', () => {
  test('ArtFactory builds grotesque enemy variant textures', () => {
    const source = read('src/systems/ArtFactory.js');

    expect(source).toContain("this._texture(scene, 'enemy_maw'");
    expect(source).toContain("this._texture(scene, 'enemy_spine'");
    expect(source).toContain("this._texture(scene, 'enemy_many_eyes'");
    expect(source).toContain("this._texture(scene, 'enemy_crawler'");
  });

  test('Enemy selects a monster variant texture and applies its silhouette tuning', () => {
    const source = read('src/entities/Enemy.js');

    expect(source).toContain('getMonsterVariantForSpawn({ x, y })');
    expect(source).toContain('super(scene, x, y, variant.texture)');
    expect(source).toContain('this.monsterVariant = variant');
    expect(source).toContain('this.setDisplaySize(variant.display.width, variant.display.height)');
    expect(source).toContain('this.body.setSize(variant.body.width, variant.body.height)');
  });

  test('MapGenerator spawns more monsters per non-start chunk', () => {
    const source = read('src/systems/MapGenerator.js');

    expect(source).toContain('const count = Phaser.Math.Between(2, 4)');
  });

  test('index loads MonsterVariantPlan before Enemy uses it', () => {
    const source = read('index.html');
    const planIndex = source.indexOf('src/systems/MonsterVariantPlan.js');
    const enemyIndex = source.indexOf('src/entities/Enemy.js');

    expect(planIndex).toBeGreaterThan(-1);
    expect(enemyIndex).toBeGreaterThan(planIndex);
  });
});
