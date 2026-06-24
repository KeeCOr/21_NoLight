const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('combat feedback integration', () => {
  test('GameScene routes attack, dodge, hit, stagger, and defeat through unified feedback names', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain("getActionFeedback({ type: 'defeat'");
    expect(source).toContain("getActionFeedback({ type: 'stagger'");
    expect(source).toMatch(/getActionFeedback\(\{\s*type: 'dodge'/);
    expect(source).toContain("getActionFeedback({ type: 'attack'");
    expect(source).toMatch(/getActionFeedback\(\{\s*type: 'hit'/);
  });

  test('slash combat feedback uses bitmap VFX instead of code-drawn ellipse arcs', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).not.toContain('this.add.ellipse(char.x + facing * offset');
    expect(source).toContain("this.add.image(char.x + facing * offset, char.y, 'impact_brush_ring')");
  });
});
