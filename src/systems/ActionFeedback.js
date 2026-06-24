(function (root) {
  function numberOrZero(value) {
    return Number.isFinite(value) ? value : 0;
  }

  function getSpentStamina(input) {
    const before = numberOrZero(input.staminaBefore);
    const after = Number.isFinite(input.staminaAfter) ? input.staminaAfter : before;
    return Math.max(0, Math.round(before - after));
  }

  function getCombo(input) {
    return Math.max(1, Math.round(input.comboStep || 1));
  }

  function getDamage(input) {
    return Math.max(0, Math.round(input.damage || 0));
  }

  function feedback(label, tone, texture, intensity, rule) {
    return { label, tone, texture, intensity, rule };
  }

  function getActionFeedback(input) {
    const data = input || {};
    const type = data.type || 'hit';

    if (type === 'attack') {
      const combo = getCombo(data);
      return feedback(`붓길 예고 · ${combo}식`, 'attack', 'brush_slash', combo >= 3 ? 0.92 : 0.72, 'strike');
    }

    if (type === 'dodge' || type === 'dash') {
      const spent = getSpentStamina(data);
      return feedback(`대시 잔상 · -${spent} ST`, type === 'dash' ? 'dash' : 'dodge', 'afterimage_glow', 0.7, 'evade');
    }

    if (type === 'stagger') {
      const damage = getDamage(data);
      return feedback(`먹번짐 경직 · ${damage}`, 'stagger', 'blood_ink', 0.95, 'wound');
    }

    if (type === 'defeat' || type === 'kill') {
      return feedback('먹물 폭쇄 · +50', type === 'kill' ? 'kill' : 'defeat', 'impact_ink_burst', 1.25, 'finish');
    }

    const combo = getCombo(data);
    const damage = getDamage(data);
    return feedback(`${combo}연 참격 · ${damage}`, 'hit', 'brush_slash', combo >= 3 ? 1.05 : 0.85, 'strike');
  }

  function getCombatFeedbackSequence(events) {
    return (Array.isArray(events) ? events : []).map(getActionFeedback);
  }

  root.getActionFeedback = getActionFeedback;
  root.getCombatFeedbackSequence = getCombatFeedbackSequence;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getActionFeedback, getCombatFeedbackSequence };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
