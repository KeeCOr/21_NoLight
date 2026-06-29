const { getComboHitReaction } = require('../src/systems/ComboHitReaction');

describe('ComboHitReaction', () => {
  test('combo steps escalate enemy knockback and stagger', () => {
    const first = getComboHitReaction({ comboStep: 1, facing: 1 });
    const second = getComboHitReaction({ comboStep: 2, facing: 1 });
    const third = getComboHitReaction({ comboStep: 3, facing: 1 });

    expect(first.knockbackX).toBe(8);
    expect(second.knockbackX).toBeGreaterThan(first.knockbackX);
    expect(third.knockbackX).toBeGreaterThan(second.knockbackX);
    expect(third.staggerMs).toBeGreaterThan(second.staggerMs);
    expect(third.isFinisher).toBe(true);
  });

  test('reaction respects attack direction and clamps unknown combo steps', () => {
    const left = getComboHitReaction({ comboStep: 2, facing: -1 });
    const overflow = getComboHitReaction({ comboStep: 99, facing: 1 });
    const missing = getComboHitReaction({});

    expect(left.knockbackX).toBeLessThan(0);
    expect(overflow.comboStep).toBe(3);
    expect(overflow.isFinisher).toBe(true);
    expect(missing.comboStep).toBe(1);
    expect(missing.knockbackX).toBe(8);
  });

  test('finisher reaction exposes VFX timing hints for scene orchestration', () => {
    const finisher = getComboHitReaction({ comboStep: 3, facing: 1 });

    expect(finisher.hitStopMs).toBeGreaterThanOrEqual(70);
    expect(finisher.flashTexture).toBe('heavy_hit_flash');
    expect(finisher.spawnDropDelayMs).toBeGreaterThanOrEqual(80);
    expect(finisher.smearScale).toBeGreaterThan(1);
  });

  test('combo impact VFX escalates from ring to smear, flash, and ink burst', () => {
    const first = getComboHitReaction({ comboStep: 1, facing: 1 });
    const second = getComboHitReaction({ comboStep: 2, facing: 1 });
    const third = getComboHitReaction({ comboStep: 3, facing: 1 });

    expect(first.impactVfx).toMatchObject({
      kind: 'hit',
      ringTexture: 'impact_brush_ring',
      burstTexture: null,
      flashTexture: null,
      smearTexture: null,
    });
    expect(second.impactVfx).toMatchObject({
      kind: 'combo',
      ringTexture: 'impact_brush_ring',
      burstTexture: null,
      flashTexture: null,
      smearTexture: 'combo_brush_smear',
    });
    expect(third.impactVfx).toMatchObject({
      kind: 'finisher',
      ringTexture: 'impact_brush_ring',
      burstTexture: 'impact_ink_burst',
      flashTexture: 'heavy_hit_flash',
      smearTexture: 'combo_brush_smear',
    });
    expect(third.impactVfx.power).toBeGreaterThan(second.impactVfx.power);
  });
});
