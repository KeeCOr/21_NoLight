const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('balance config', () => {
  test('electric basic attack has a tighter range', () => {
    const source = read('src/entities/ElectricCharacter.js');

    expect(source).toContain('this.ATTACK_RANGE = 125');
    expect(source).toContain('this.COMBO_RANGE_STEP = 14');
  });

  test('regular enemies require more basic hits to kill', () => {
    const source = read('src/entities/Enemy.js');

    expect(source).toContain('this.maxHp = 120');
    expect(source).toContain('this.hp = 120');
  });

  test('map generator uses fewer platforms per vertical chunk', () => {
    const source = read('src/systems/MapGenerator.js');

    expect(source).toContain('this.CHUNK_HEIGHT = 360');
    expect(source).toContain('Phaser.Math.Between(1, 2)');
  });

  test('base character movement is constrained to a centered play lane', () => {
    const source = read('src/entities/BaseCharacter.js');

    expect(source).toContain('this.PLAY_AREA_MARGIN = 120');
    expect(source).toContain('const minX = this.PLAY_AREA_MARGIN');
  });
});
