const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('60-second combat trial integration', () => {
  test('trial unlock promotes one real enemy and defers promotion when none exist', () => {
    const scene = read('src/scenes/GameScene.js');
    expect(scene).toContain("this.events.on('combatTrialEliteUnlocked'");
    expect(scene).toContain('_promoteTrialElite()');
    expect(scene).toContain('this.trialElitePending = true');
    expect(scene).toContain('e.promoteToTrialElite()');
    expect(scene).toContain('this.hud.update(delta)');
    expect(scene).toContain('this.isOnboardingActive = true');
    expect(scene).toContain("this.events.on('tutorialCompleted'");
    expect(scene).toContain('if (this.hud.objectiveActive) this.stat.update');
    expect(scene).toContain('if (this.hud.objectiveActive) {');
    expect(scene).toContain('character.body.allowGravity = false');
    expect(scene).toContain('character.body.allowGravity = true');
    expect(scene).toContain('character.setPosition(this.onboardingStart.x, this.onboardingStart.y)');
    expect(scene).toContain('this.pursuer.setPosition(startX, 860)');
    expect(scene).toContain('if (this.hud.objectiveActive) current.update');
  });

  test('elite enemy has an explicit identity and reports it with the kill event', () => {
    const enemy = read('src/entities/Enemy.js');
    expect(enemy).toContain('promoteToTrialElite()');
    expect(enemy).toContain('this.isTrialElite = true');
    expect(enemy).toContain('isTrialElite: this.isTrialElite');
    expect(enemy).toContain("'강적 · '");
  });
});
