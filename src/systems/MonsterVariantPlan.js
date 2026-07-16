(function (root) {
  const MONSTER_VARIANTS = [
    {
      texture: 'enemy',
      tone: 'grotesque-base',
      tint: 0x1d1b18,
      display: { width: 52, height: 52 },
      body: { width: 28, height: 34, offsetX: 9, offsetY: 12 },
      speedMultiplier: 1,
      powerBonus: 0,
    },
    {
      texture: 'enemy_maw',
      tone: 'maw-horror',
      tint: 0x17130f,
      display: { width: 62, height: 56 },
      body: { width: 34, height: 34, offsetX: 10, offsetY: 14 },
      speedMultiplier: 0.92,
      powerBonus: 4,
    },
    {
      texture: 'enemy_spine',
      tone: 'spine-grotesque',
      tint: 0x1a1714,
      display: { width: 56, height: 70 },
      body: { width: 28, height: 46, offsetX: 12, offsetY: 15 },
      speedMultiplier: 0.86,
      powerBonus: 6,
    },
    {
      texture: 'enemy_many_eyes',
      tone: 'many-eyes-horror',
      tint: 0x14120f,
      display: { width: 60, height: 58 },
      body: { width: 32, height: 36, offsetX: 11, offsetY: 13 },
      speedMultiplier: 1.06,
      powerBonus: 2,
    },
    {
      texture: 'enemy_crawler',
      tone: 'crawler-grotesque',
      tint: 0x11100d,
      display: { width: 72, height: 44 },
      body: { width: 46, height: 26, offsetX: 13, offsetY: 15 },
      speedMultiplier: 1.16,
      powerBonus: 1,
    },
  ];

  function getMonsterVariantForSpawn(input = {}) {
    const x = Math.round(input.x || 0);
    const y = Math.round(input.y || 0);
    const hash = Math.abs((x * 31) ^ (y * 17) ^ Math.floor((x + y) / 53));
    return MONSTER_VARIANTS[hash % MONSTER_VARIANTS.length];
  }

  root.MONSTER_VARIANTS = MONSTER_VARIANTS;
  root.getMonsterVariantForSpawn = getMonsterVariantForSpawn;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MONSTER_VARIANTS, getMonsterVariantForSpawn };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
