const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('boundary wall integration', () => {
  test('BaseCharacter clamps movement through shared play-area bounds', () => {
    const source = read('src/entities/BaseCharacter.js');

    expect(source).toContain('getPlayAreaBounds({');
    expect(source).toContain('bounds.minX');
    expect(source).toContain('bounds.maxX');
  });

  test('GameScene creates visible and physical left/right boundary walls', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('this.boundaryWallGroup = this.physics.add.staticGroup()');
    expect(source).toContain("_createBoundaryWallVisual(bounds, 'left')");
    expect(source).toContain("_createBoundaryWallVisual(bounds, 'right')");
    expect(source).toContain('this.physics.add.collider(electric, this.boundaryWallGroup)');
    expect(source).toContain('this.physics.add.collider(mecha, this.boundaryWallGroup)');
  });

  test('index loads PlayAreaBounds before entities and scenes use it', () => {
    const source = read('index.html');
    const boundsIndex = source.indexOf('src/systems/PlayAreaBounds.js');
    const entityIndex = source.indexOf('src/entities/BaseCharacter.js');
    const sceneIndex = source.indexOf('src/scenes/GameScene.js');

    expect(boundsIndex).toBeGreaterThan(-1);
    expect(entityIndex).toBeGreaterThan(boundsIndex);
    expect(sceneIndex).toBeGreaterThan(boundsIndex);
  });
});
