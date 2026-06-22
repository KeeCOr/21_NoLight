(function (root) {
  function getActionFeedback(input) {
    if (!input || !input.type) {
      return {
        label: '먹물 흔적',
        tone: 'hit',
        texture: 'ink_splatter',
        intensity: 0.6,
      };
    }

    if (input.type === 'kill') {
      return {
        label: '먹물 폭쇄 · +50',
        tone: 'kill',
        texture: 'impact_ink_burst',
        intensity: 1.25,
      };
    }

    if (input.type === 'dash') {
      const before = Number.isFinite(input.staminaBefore) ? input.staminaBefore : 0;
      const after = Number.isFinite(input.staminaAfter) ? input.staminaAfter : before;
      const spent = Math.max(0, Math.round(before - after));
      return {
        label: `대시 잔상 · -${spent} ST`,
        tone: 'dash',
        texture: 'afterimage_glow',
        intensity: 0.7,
      };
    }

    const combo = Math.max(1, Math.round(input.comboStep || 1));
    const damage = Math.max(0, Math.round(input.damage || 0));
    return {
      label: `${combo}연 참격 · ${damage}`,
      tone: 'hit',
      texture: 'brush_slash',
      intensity: combo >= 3 ? 1.05 : 0.85,
    };
  }

  root.getActionFeedback = getActionFeedback;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getActionFeedback };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
