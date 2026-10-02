const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('platform and jump tuning', () => {
  test('map generator uses platforms roughly three times longer than the prior tuning', () => {
    const source = read('src/systems/MapGenerator.js');

    expect(source).toContain('w: 375');
    expect(source).toContain('Phaser.Math.Between(180, 450)');
  });

  test('base character jump height is reduced from the old high arc', () => {
    const source = read('src/entities/BaseCharacter.js');

    expect(source).toContain('this.setVelocityY(-430)');
    expect(source).not.toContain('this.setVelocityY(-550)');
  });
});
