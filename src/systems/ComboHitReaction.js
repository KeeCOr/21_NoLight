(function (root) {
  const REACTIONS = {
    1: {
      knockback: 8,
      staggerMs: 90,
      hitStopMs: 42,
      popY: 0,
      travelMs: 82,
      smearTexture: null,
      smearScale: 0,
      flashTexture: null,
      spawnDropDelayMs: 0,
    },
    2: {
      knockback: 18,
      staggerMs: 130,
      hitStopMs: 56,
      popY: -4,
      travelMs: 105,
      smearTexture: 'combo_brush_smear',
      smearScale: 1.08,
      flashTexture: null,
      spawnDropDelayMs: 0,
    },
    3: {
      knockback: 34,
      staggerMs: 210,
      hitStopMs: 72,
      popY: -18,
      travelMs: 135,
      smearTexture: 'combo_brush_smear',
      smearScale: 1.28,
      flashTexture: 'heavy_hit_flash',
      spawnDropDelayMs: 100,
    },
  };

  function clampStep(value) {
    return Math.max(1, Math.min(3, Math.round(value || 1)));
  }

  function getComboHitReaction(input = {}) {
    const comboStep = clampStep(input.comboStep);
    const facing = input.facing === -1 ? -1 : 1;
    const base = REACTIONS[comboStep];

    return {
      comboStep,
      facing,
      knockbackX: base.knockback * facing,
      knockbackVelocityX: base.knockback * 18 * facing,
      staggerMs: base.staggerMs,
      hitStopMs: base.hitStopMs,
      popY: base.popY,
      travelMs: base.travelMs,
      smearTexture: base.smearTexture,
      smearScale: base.smearScale,
      flashTexture: base.flashTexture,
      spawnDropDelayMs: base.spawnDropDelayMs,
      isFinisher: comboStep >= 3,
    };
  }

  root.getComboHitReaction = getComboHitReaction;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getComboHitReaction };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
