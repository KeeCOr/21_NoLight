const fs = require('fs');
const path = require('path');

describe('Phaser scale config', () => {
  test('fits the portrait canvas inside the Electron window', () => {
    const game = fs.readFileSync(path.join(__dirname, '..', 'src', 'game.js'), 'utf8');

    expect(game).toContain('width: 900');
    expect(game).toContain('height: 1600');
    expect(game).toContain('mode: Phaser.Scale.FIT');
    expect(game).toContain('autoCenter: Phaser.Scale.CENTER_BOTH');
  });
});
