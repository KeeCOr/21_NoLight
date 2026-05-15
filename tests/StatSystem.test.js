const StatSystem = require('../src/systems/StatSystem.js');

describe('StatSystem', () => {
  let stat;
  beforeEach(() => { stat = new StatSystem(); });

  test('초기 HP는 100', () => {
    expect(stat.hp).toBe(100);
  });

  test('isLowHp: HP 30 이하일 때 true', () => {
    stat.hp = 30;
    expect(stat.isLowHp()).toBe(true);
    stat.hp = 31;
    expect(stat.isLowHp()).toBe(false);
  });

  test('getAttackMultiplier: 저체력 시 1.5x', () => {
    stat.hp = 30;
    expect(stat.getAttackMultiplier()).toBe(1.5);
    stat.hp = 100;
    expect(stat.getAttackMultiplier()).toBe(1.0);
  });

  test('update: 킬 후 3초 이내엔 HP 감소 없음', () => {
    stat.onKill();
    stat.update(1000, false);
    expect(stat.hp).toBe(100);
  });

  test('update: 킬 없이 3초 초과 시 HP 감소', () => {
    stat.update(4000, false);
    expect(stat.hp).toBeLessThan(100);
  });

  test('update: 가드 중 스태미나 감소', () => {
    stat.update(1000, true);
    expect(stat.stamina).toBeLessThan(100);
  });

  test('update: 비가드 시 스태미나 회복', () => {
    stat.stamina = 50;
    stat.update(1000, false);
    expect(stat.stamina).toBeGreaterThan(50);
  });

  test('takeDamage: HP 감소, 0 미만 안됨', () => {
    stat.takeDamage(30);
    expect(stat.hp).toBe(70);
    stat.takeDamage(200);
    expect(stat.hp).toBe(0);
  });

  test('useStamina: 스태미나 부족 시 false, 차감 없음', () => {
    stat.stamina = 20;
    expect(stat.useStamina(30)).toBe(false);
    expect(stat.stamina).toBe(20);
  });

  test('useStamina: 스태미나 충분 시 true, 차감', () => {
    stat.stamina = 50;
    expect(stat.useStamina(30)).toBe(true);
    expect(stat.stamina).toBe(20);
  });

  test('addStamina: 최대치 초과 안됨', () => {
    stat.stamina = 90;
    stat.addStamina(20);
    expect(stat.stamina).toBe(100);
  });

  test('onKill: kills 증가, score 반영', () => {
    stat.onKill();
    expect(stat.kills).toBe(1);
    stat.update(0, false);
    expect(stat.score).toBe(50);
  });

  test('restoreHp: healing pickups restore HP without exceeding max', () => {
    stat.hp = 70;
    stat.restoreHp(12);
    expect(stat.hp).toBe(82);

    stat.hp = 96;
    stat.restoreHp(12);
    expect(stat.hp).toBe(100);
  });

  test('onKill: kills do not restore HP until the player collects a drop', () => {
    stat.hp = 70;
    stat.onKill();
    expect(stat.hp).toBe(70);
  });

  test('isDead: HP 0일 때 true', () => {
    stat.hp = 0;
    expect(stat.isDead()).toBe(true);
    stat.hp = 1;
    expect(stat.isDead()).toBe(false);
  });
});
