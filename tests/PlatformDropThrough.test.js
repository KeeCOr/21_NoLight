const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('platform traversal fixes', () => {
  test('platforms are marked one-way and the scene filters collisions from below or during drop-through', () => {
    const map = read('src/systems/MapGenerator.js');
    const scene = read('src/scenes/GameScene.js');

    expect(map).toContain('plat.isOneWayPlatform = true');
    expect(scene).toContain('_platformCollisionProcess(player, platform)');
    expect(scene).toContain('player.dropThroughTimer > 0');
    expect(scene).toContain('player.body.bottom <= platform.body.top + 14');
  });

  test('characters can intentionally drop through a platform with the down input', () => {
    const source = read('src/entities/BaseCharacter.js');

    expect(source).toContain('this.dropThroughTimer = 0');
    expect(source).toContain('cursors.down.isDown && this.body.blocked.down');
    expect(source).toContain('this.dropThroughTimer = 260');
  });

  test('blocked horizontal paths are shown with visible boundary markers', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('_createBoundaryMarkers()');
    expect(source).toContain("'ink_splatter'");
    expect(source).toContain('this.leftBoundaryMarker');
    expect(source).toContain('this.rightBoundaryMarker');
  });
});
