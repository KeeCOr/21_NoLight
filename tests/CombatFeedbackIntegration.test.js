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

  test('GameScene consumes ActionFeedback anchors, layers, and timelines instead of per-call offsets', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('feedback?.anchor?.offsetY');
    expect(source).toContain('feedback?.layer?.depth');
    expect(source).toContain('feedback?.timeline || {}');
    expect(source).toContain('delay,');
    expect(source).toContain('this._showActionFeedback(enemy.x, enemy.y, feedback);');
    expect(source).toContain('this._showActionFeedback(char.x, char.y, feedback);');
    expect(source).toContain('this._showActionFeedback(current.x, current.y, feedback);');
    expect(source).not.toContain('this._showActionFeedback(enemy.x, enemy.y - 48, feedback);');
    expect(source).not.toContain('this._showActionFeedback(current.x, current.y - 76, feedback);');
  });
  test('GameScene applies density cue pulse scale when drawing action feedback', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('feedback?.densityCue || {}');
    expect(source).toContain('densityCue.pulseScale');
  });
  test('GameScene draws the action visual cue behind its readable feedback label', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('feedback?.visualCue || {}');
    expect(source).toContain("this.add.image(x, anchorY, feedback.texture)");
    expect(source).toContain('visualCue.durationMs');
  });

});

