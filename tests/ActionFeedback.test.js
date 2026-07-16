const { getActionFeedback, getCombatFeedbackSequence } = require('../src/systems/ActionFeedback');

describe('ink action feedback', () => {
  test('basic hit feedback names combo step and uses brush slash texture', () => {
    expect(getActionFeedback({ type: 'hit', comboStep: 2, damage: 34 })).toMatchObject({
      label: '2연 참격 · 34',
      tone: 'hit',
      texture: 'brush_slash',
      intensity: 0.9,
      rule: 'strike',
    });
  });

  test('defeat feedback uses stronger ink burst callout', () => {
    expect(getActionFeedback({ type: 'defeat', damage: 60 })).toMatchObject({
      label: '먹물 폭쇄 · +50',
      tone: 'defeat',
      texture: 'impact_ink_burst',
      intensity: 1.25,
      rule: 'finish',
    });
  });

  test('dodge feedback reports spent stamina', () => {
    expect(getActionFeedback({ type: 'dodge', staminaBefore: 80, staminaAfter: 50 })).toMatchObject({
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

  test('attack, hit, dodge, and defeat expose fixed anchor, layer, and timeline rules', () => {
    expect(getActionFeedback({ type: 'attack', comboStep: 1 })).toMatchObject({
      action: 'attack',
      anchor: { point: 'actor', offsetY: -76 },
      layer: { depth: 20, lane: 'intent' },
      timeline: { delay: 0, rise: 34, duration: 520 },
    });
    expect(getActionFeedback({ type: 'hit', comboStep: 2, damage: 34 })).toMatchObject({
      action: 'hit',
      anchor: { point: 'target', offsetY: -48 },
      layer: { depth: 21, lane: 'impact' },
      timeline: { delay: 60, rise: 42, duration: 560 },
    });
    expect(getActionFeedback({ type: 'dodge', staminaBefore: 80, staminaAfter: 50 })).toMatchObject({
      action: 'dodge',
      anchor: { point: 'actor', offsetY: -78 },
      layer: { depth: 22, lane: 'evade' },
      timeline: { delay: 0, rise: 36, duration: 500 },
    });
    expect(getActionFeedback({ type: 'defeat', damage: 60 })).toMatchObject({
      action: 'defeat',
      anchor: { point: 'target', offsetY: -54 },
      layer: { depth: 24, lane: 'finish' },
      timeline: { delay: 90, rise: 50, duration: 760 },
    });
  });

  test('same action keeps the same position and strength regardless of variable numbers', () => {
    const weakHit = getActionFeedback({ type: 'hit', comboStep: 1, damage: 8 });
    const strongHit = getActionFeedback({ type: 'hit', comboStep: 3, damage: 91 });
    expect(strongHit.anchor).toEqual(weakHit.anchor);
    expect(strongHit.layer).toEqual(weakHit.layer);
    expect(strongHit.timeline).toEqual(weakHit.timeline);
    expect(strongHit.intensity).toBe(weakHit.intensity);

    const shortDodge = getActionFeedback({ type: 'dodge', staminaBefore: 40, staminaAfter: 30 });
    const longDodge = getActionFeedback({ type: 'dodge', staminaBefore: 90, staminaAfter: 20 });
    expect(longDodge.anchor).toEqual(shortDodge.anchor);
    expect(longDodge.layer).toEqual(shortDodge.layer);
    expect(longDodge.timeline).toEqual(shortDodge.timeline);
    expect(longDodge.intensity).toBe(shortDodge.intensity);
  });

  test('combat feedback sequence preserves the fixed reaction lanes in event order', () => {
    const sequence = getCombatFeedbackSequence([
      { type: 'attack', comboStep: 3 },
      { type: 'hit', comboStep: 1, damage: 12 },
      { type: 'dodge', staminaBefore: 70, staminaAfter: 45 },
      { type: 'kill', damage: 80 },
    ]);

    expect(sequence.map(step => step.action)).toEqual(['attack', 'hit', 'dodge', 'kill']);
    expect(sequence.map(step => step.layer.lane)).toEqual(['intent', 'impact', 'evade', 'finish']);
    expect(sequence.map(step => step.timeline.delay)).toEqual([0, 60, 0, 90]);
    expect(sequence.map(step => step.anchor.offsetY)).toEqual([-76, -48, -78, -54]);
  });

  test('attack, dodge, hit, and defeat expose compact density cues for 60-second combat readability', () => {
    const sequence = getCombatFeedbackSequence([
      { type: 'attack', comboStep: 1 },
      { type: 'dodge', staminaBefore: 70, staminaAfter: 45 },
      { type: 'hit', comboStep: 2, damage: 24 },
      { type: 'defeat', damage: 80 },
    ]);

    expect(sequence.map(step => step.densityCue)).toEqual([
      { beat: 'windup', urgency: 0.64, responseWindowMs: 360, pulseScale: 1.08 },
      { beat: 'escape', urgency: 0.72, responseWindowMs: 300, pulseScale: 1.1 },
      { beat: 'contact', urgency: 0.86, responseWindowMs: 260, pulseScale: 1.15 },
      { beat: 'payoff', urgency: 1, responseWindowMs: 420, pulseScale: 1.24 },
    ]);
    expect(sequence.every(step => step.densityCue.responseWindowMs <= 420)).toBe(true);
  });
});
