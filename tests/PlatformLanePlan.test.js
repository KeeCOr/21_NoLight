const { getPlatformSpawnBands, chooseSidePlatformX } = require('../src/systems/PlatformLanePlan');

describe('PlatformLanePlan', () => {
  test('defines side spawn bands that leave the middle lane open', () => {
    const bands = getPlatformSpawnBands({ width: 900, margin: 81, centerRatio: 0.32 });

    expect(bands.centerLeft).toBeLessThan(450);
    expect(bands.centerRight).toBeGreaterThan(450);
    expect(bands.left.max).toBeLessThanOrEqual(bands.centerLeft);
    expect(bands.right.min).toBeGreaterThanOrEqual(bands.centerRight);
  });

  test('chooses extra platform centers from left or right bands, not the center lane', () => {
    const left = chooseSidePlatformX({ width: 900, margin: 81, platformWidth: 220, sideRoll: 0.1, positionRoll: 0.5 });
    const right = chooseSidePlatformX({ width: 900, margin: 81, platformWidth: 220, sideRoll: 0.9, positionRoll: 0.5 });
    const bands = getPlatformSpawnBands({ width: 900, margin: 81 });

    expect(left).toBeLessThan(bands.centerLeft);
    expect(right).toBeGreaterThan(bands.centerRight);
  });

  test('keeps narrow layouts valid by clamping side bands to usable edges', () => {
    const x = chooseSidePlatformX({ width: 480, margin: 70, platformWidth: 260, sideRoll: 0.1, positionRoll: 0.5 });

    expect(Number.isFinite(x)).toBe(true);
    expect(x).toBeGreaterThanOrEqual(130);
    expect(x).toBeLessThanOrEqual(350);
  });
});
