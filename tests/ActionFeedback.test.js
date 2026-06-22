const { getActionFeedback } = require('../src/systems/ActionFeedback');

describe('ink action feedback', () => {
  test('basic hit feedback names combo step and uses brush slash texture', () => {
    expect(getActionFeedback({ type: 'hit', comboStep: 2, damage: 34 })).toEqual({
      label: '2연 참격 · 34',
      tone: 'hit',
      texture: 'brush_slash',
      intensity: 0.85,
    });
  });

  test('kill feedback uses stronger ink burst callout', () => {
    expect(getActionFeedback({ type: 'kill', damage: 60 })).toEqual({
      label: '먹물 폭쇄 · +50',
      tone: 'kill',
      texture: 'impact_ink_burst',
      intensity: 1.25,
    });
  });

  test('dash feedback reports spent stamina', () => {
    expect(getActionFeedback({ type: 'dash', staminaBefore: 80, staminaAfter: 50 })).toEqual({
      label: '대시 잔상 · -30 ST',
      tone: 'dash',
      texture: 'afterimage_glow',
      intensity: 0.7,
    });
  });
});
