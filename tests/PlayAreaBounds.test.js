const { getPlayAreaBounds } = require('../src/systems/PlayAreaBounds');

describe('PlayAreaBounds', () => {
  test('returns clamp points and wall positions from screen width and margin', () => {
    const bounds = getPlayAreaBounds({ width: 900, margin: 120 });

    expect(bounds.minX).toBe(120);
    expect(bounds.maxX).toBe(780);
    expect(bounds.wallWidth).toBeGreaterThanOrEqual(64);
    expect(bounds.leftWallX).toBeLessThan(bounds.minX);
    expect(bounds.rightWallX).toBeGreaterThan(bounds.maxX);
    expect(bounds.physicsHeight).toBeGreaterThanOrEqual(100000);
  });

  test('keeps walls readable on narrow screens without collapsing the play area', () => {
    const bounds = getPlayAreaBounds({ width: 480, margin: 120 });

    expect(bounds.minX).toBeLessThan(bounds.maxX);
    expect(bounds.wallVisualWidth).toBeGreaterThanOrEqual(72);
    expect(bounds.innerLineLeftX).toBe(bounds.minX);
    expect(bounds.innerLineRightX).toBe(bounds.maxX);
  });
});
