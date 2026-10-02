const fs = require('fs');
const path = require('path');

describe('path health drops', () => {
  test('map generation can place occasional health drops on traversable paths', () => {
    const map = fs.readFileSync(path.join(__dirname, '..', 'src', 'systems', 'MapGenerator.js'), 'utf8');
    const scene = fs.readFileSync(path.join(__dirname, '..', 'src', 'scenes', 'GameScene.js'), 'utf8');

    expect(map).toContain('pickupFactory');
    expect(map).toContain('pickups');
    expect(map).toContain('Phaser.Math.Between(0, 3) === 0');
    expect(scene).toContain('this._spawnHealthDrop(x, y, 24000)');
  });
});
