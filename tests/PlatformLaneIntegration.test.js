const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('platform lane integration', () => {
  test('MapGenerator uses side-biased platform placement for extra platforms', () => {
    const source = read('src/systems/MapGenerator.js');

    expect(source).toContain('chooseSidePlatformX({');
    expect(source).toContain('sideRoll: Phaser.Math.FloatBetween(0, 1)');
    expect(source).not.toContain('Phaser.Math.Between(Math.max(margin, halfW), Math.min(worldWidth - margin, worldWidth - halfW))');
  });

  test('index loads PlatformLanePlan before MapGenerator uses it', () => {
    const source = read('index.html');
    const planIndex = source.indexOf('src/systems/PlatformLanePlan.js');
    const mapIndex = source.indexOf('src/systems/MapGenerator.js');

    expect(planIndex).toBeGreaterThan(-1);
    expect(mapIndex).toBeGreaterThan(planIndex);
  });
});
