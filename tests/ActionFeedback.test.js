const { getActionFeedback, getCombatFeedbackSequence } = require('../src/systems/ActionFeedback');

describe('ink action feedback', () => {
  test('basic hit feedback names combo step and uses brush slash texture', () => {
    expect(getActionFeedback({ type: 'hit', comboStep: 2, damage: 34 })).toEqual({
      label: '2연 참격 · 34',
      tone: 'hit',
      texture: 'brush_slash',
      intensity: 0.85,
      rule: 'strike',
    });
  });

  test('defeat feedback uses stronger ink burst callout', () => {
    expect(getActionFeedback({ type: 'defeat', damage: 60 })).toEqual({
      label: '먹물 폭쇄 · +50',
      tone: 'defeat',
      texture: 'impact_ink_burst',
      intensity: 1.25,
      rule: 'finish',
    });
  });

  test('dodge feedback reports spent stamina', () => {
    expect(getActionFeedback({ type: 'dodge', staminaBefore: 80, staminaAfter: 50 })).toEqual({
      label: '대시 잔상 · -30 ST',
      tone: 'dodge',
      texture: 'afterimage_glow',
      intensity: 0.7,
      rule: 'evade',
    });
  });

  test('attack, hit, stagger, and defeat share one ink-combat language', () => {
    expect(getActionFeedback({ type: 'attack', comboStep: 1 })).toMatchObject({
      label: '붓길 예고 · 1식',
      tone: 'attack',
      texture: 'brush_slash',
      rule: 'strike',
    });
    expect(getActionFeedback({ type: 'stagger', damage: 12 })).toMatchObject({
      label: '먹번짐 경직 · 12',
      tone: 'stagger',
      texture: 'blood_ink',
      rule: 'wound',
    });
  });

  test('combat smoke path covers entering combat, landing a hit, taking damage, and ending an encounter', () => {
    const path = getCombatFeedbackSequence([
      { type: 'attack', comboStep: 1 },
      { type: 'hit', comboStep: 2, damage: 34 },
      { type: 'stagger', damage: 18 },
      { type: 'defeat', damage: 60 },
    ]);

    expect(path.map(step => step.rule)).toEqual(['strike', 'strike', 'wound', 'finish']);
    expect(path.map(step => step.texture)).toEqual(['brush_slash', 'brush_slash', 'blood_ink', 'impact_ink_burst']);
    expect(path.every(step => step.label.length > 0 && step.intensity >= 0.6)).toBe(true);
  });
});
