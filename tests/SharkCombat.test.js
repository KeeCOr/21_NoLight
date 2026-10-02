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

  test('combat smoke path enters, trades damage, and ends the encounter', () => {
    const player = { x: 80, flipX: false, sharkPower: 30, stat: { hp: 100, takeDamage(amount) { this.hp = Math.max(0, this.hp - amount); } } };
    const enemy = { x: 124, flipX: true, sharkPower: 18, hp: 42 };

    const path = SharkCombat.runSmokeEncounter(player, enemy, {
      openingDamage: 26,
      retaliationDamage: 14,
      finisherDamage: 20,
    });

    expect(path.map(step => step.phase)).toEqual(['enter', 'player-hit', 'enemy-hit', 'encounter-end']);
    expect(path.map(step => step.ended)).toEqual([false, false, false, true]);
    expect(enemy.hp).toBe(0);
    expect(player.stat.hp).toBe(86);
    expect(path[1]).toMatchObject({ attacker: player, defender: enemy, damage: 26, defenderHp: 16 });
    expect(path[2]).toMatchObject({ attacker: enemy, defender: player, damage: 14, defenderHp: 86 });
    expect(path[3]).toMatchObject({ attacker: player, defender: enemy, damage: 20, defenderHp: 0 });
  });
});
