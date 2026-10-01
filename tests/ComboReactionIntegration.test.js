const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('combo reaction integration', () => {
  test('Enemy emits combo hit reaction payload for scene feedback', () => {
    const source = read('src/entities/Enemy.js');

    expect(source).toContain('getComboHitReaction({');
    expect(source).toContain('reaction: this.lastHitReaction');
    expect(source).toContain('this.applyStun(this.lastHitReaction.staggerMs)');
  });

  test('GameScene uses combo reaction to separate smear, finisher, and delayed drop feedback', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('payload.reaction');
    expect(source).toContain("reaction.impactVfx");
    expect(source).toContain("reaction.smearTexture");
    expect(source).toContain("reaction.flashTexture");
    expect(source).toContain("reaction.spawnDropDelayMs");
    expect(source).toContain("this._comboImpactVfx(enemy, reaction.impactVfx, reaction)");
    expect(source).toContain("this._enemyComboSmear(enemy, reaction)");
    expect(source).toContain("this._enemyFinisherPop(enemy, reaction)");
  });

  test('index loads ComboHitReaction before entities use it', () => {
    const source = read('index.html');
    const comboIndex = source.indexOf('src/systems/ComboHitReaction.js');
    const enemyIndex = source.indexOf('src/entities/Enemy.js');

    expect(comboIndex).toBeGreaterThan(-1);
    expect(enemyIndex).toBeGreaterThan(comboIndex);
  });
});
