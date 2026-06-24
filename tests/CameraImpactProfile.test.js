const { getCameraImpactProfile } = require('../src/systems/CameraImpactProfile');

describe('CameraImpactProfile', () => {
  test('hit impact nudges in attack direction without over-zooming', () => {
    const right = getCameraImpactProfile({ kind: 'hit', facing: 1, power: 1, comboStep: 1 });
    const left = getCameraImpactProfile({ kind: 'hit', facing: -1, power: 1, comboStep: 1 });

    expect(right.nudgeX).toBeGreaterThan(0);
    expect(left.nudgeX).toBeLessThan(0);
    expect(right.zoom).toBeLessThanOrEqual(1.02);
    expect(right.hitStop).toBe(42);
  });

  test('combo finisher has stronger nudge, longer recovery, and stronger hit-stop than a basic hit', () => {
    const basic = getCameraImpactProfile({ kind: 'hit', facing: 1, power: 1, comboStep: 1 });
    const finisher = getCameraImpactProfile({ kind: 'combo', facing: 1, power: 1, comboStep: 3 });

    expect(finisher.nudgeX).toBeGreaterThan(basic.nudgeX);
    expect(finisher.recoverDuration).toBeGreaterThan(basic.recoverDuration);
    expect(finisher.hitStop).toBeGreaterThan(basic.hitStop);
    expect(finisher.zoom).toBeLessThanOrEqual(1.035);
  });

  test('kill and skill profiles are dramatic but capped for readability', () => {
    const kill = getCameraImpactProfile({ kind: 'kill', facing: -1, power: 1.25, comboStep: 3 });
    const skill = getCameraImpactProfile({ kind: 'skill', facing: 1, power: 1.15, comboStep: 1 });

    expect(kill.nudgeX).toBeLessThan(0);
    expect(kill.flash).toBeGreaterThan(skill.flash - 30);
    expect(skill.zoom).toBeLessThanOrEqual(1.055);
    expect(kill.recoverDuration).toBeGreaterThan(180);
  });
});
