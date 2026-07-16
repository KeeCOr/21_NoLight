const { MONSTER_VARIANTS, getMonsterVariantForSpawn } = require('../src/systems/MonsterVariantPlan');

describe('MonsterVariantPlan', () => {
  test('defines multiple grotesque monster silhouettes beyond the base enemy', () => {
    const textures = MONSTER_VARIANTS.map(v => v.texture);

    expect(MONSTER_VARIANTS.length).toBeGreaterThanOrEqual(5);
    expect(textures).toContain('enemy');
    expect(textures).toContain('enemy_maw');
    expect(textures).toContain('enemy_spine');
    expect(textures).toContain('enemy_many_eyes');
    expect(textures).toContain('enemy_crawler');
  });

  test('selects varied monster variants from spawn position without requiring randomness', () => {
    const seen = new Set();
    for (let i = 0; i < 12; i++) {
      seen.add(getMonsterVariantForSpawn({ x: 90 + i * 73, y: i * 181 }).texture);
    }

    expect(seen.size).toBeGreaterThanOrEqual(4);
  });

  test('variant data carries display and body tuning for readable silhouettes', () => {
    const variant = getMonsterVariantForSpawn({ x: 300, y: 720 });

    expect(variant.display.width).toBeGreaterThanOrEqual(48);
    expect(variant.display.height).toBeGreaterThanOrEqual(48);
    expect(variant.body.width).toBeGreaterThan(20);
    expect(variant.body.height).toBeGreaterThan(24);
    expect(variant.tone).toMatch(/grotesque|horror|crawler|maw|spine|eyes/);
  });
});
