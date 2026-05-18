const SharkCombat = require('../src/systems/SharkCombat');

describe('SharkCombat', () => {
  test('front contest deals the exact power difference to the weaker shark', () => {
    const attacker = { x: 100, flipX: false, sharkPower: 34, stat: { takeDamage: jest.fn() } };
    const defender = { x: 140, flipX: true, sharkPower: 22, stat: { takeDamage: jest.fn() } };

    const result = SharkCombat.resolveFrontContest(attacker, defender);

    expect(result.winner).toBe(attacker);
    expect(result.loser).toBe(defender);
    expect(result.damage).toBe(12);
    expect(defender.stat.takeDamage).toHaveBeenCalledWith(12);
    expect(attacker.stat.takeDamage).not.toHaveBeenCalled();
  });

  test('a weaker shark can win from behind with ambush damage scaled to health', () => {
    const attacker = { x: 90, flipX: false, sharkPower: 18, stat: { takeDamage: jest.fn() } };
    const defender = { x: 120, flipX: false, sharkPower: 34, stat: { takeDamage: jest.fn() } };

    const result = SharkCombat.resolveAttack(attacker, defender);

    expect(result.isBehind).toBe(true);
    expect(result.winner).toBe(attacker);
    expect(result.damage).toBe(27);
    expect(defender.stat.takeDamage).toHaveBeenCalledWith(27);
  });

  test('fish growth raises power in small readable steps', () => {
    const shark = { sharkPower: 24, fishEaten: 0 };

    SharkCombat.eatFish(shark);
    SharkCombat.eatFish(shark, 2);

    expect(shark.fishEaten).toBe(3);
    expect(shark.sharkPower).toBe(33);
  });
});
