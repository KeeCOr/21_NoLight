(function (root) {
  const SFX_CUES = {
    attack: { key: 'sfx_attack_slash', source: 'Kenney CC0', fallback: 'synth-slash', volume: 0.42, rate: 1.05 },
    hit: { key: 'sfx_hit_impact', source: 'Kenney CC0', fallback: 'synth-hit', volume: 0.48, rate: 1 },
    dodge: { key: 'sfx_dodge_guard', source: 'Kenney CC0', fallback: 'synth-evade', volume: 0.34, rate: 1.18 },
    guard: { key: 'sfx_dodge_guard', source: 'Kenney CC0', fallback: 'synth-guard', volume: 0.38, rate: 0.92 },
    stagger: { key: 'sfx_player_hurt', source: 'Kenney CC0', fallback: 'synth-hurt', volume: 0.46, rate: 0.96 },
    defeat: { key: 'sfx_enemy_defeat', source: 'Kenney CC0', fallback: 'synth-defeat', volume: 0.55, rate: 0.88 },
    kill: { key: 'sfx_enemy_defeat', source: 'Kenney CC0', fallback: 'synth-defeat', volume: 0.55, rate: 0.88 },
    fail: { key: 'sfx_stage_fail', source: 'Kenney CC0', fallback: 'synth-fail', volume: 0.5, rate: 0.86 },
  };

  const FEEDBACK_PROFILES = {
    attack: {
      action: 'attack',
      intensity: 0.78,
      anchor: { point: 'actor', offsetY: -76 },
      layer: { depth: 20, lane: 'intent' },
      timeline: { delay: 0, rise: 34, duration: 520 },
      densityCue: { beat: 'windup', urgency: 0.64, responseWindowMs: 360, pulseScale: 1.08 },
    },
    hit: {
      action: 'hit',
      intensity: 0.9,
      anchor: { point: 'target', offsetY: -48 },
      layer: { depth: 21, lane: 'impact' },
      timeline: { delay: 60, rise: 42, duration: 560 },
      densityCue: { beat: 'contact', urgency: 0.86, responseWindowMs: 260, pulseScale: 1.15 },
    },
    dodge: {
      action: 'dodge',
      intensity: 0.7,
      anchor: { point: 'actor', offsetY: -78 },
      layer: { depth: 22, lane: 'evade' },
      timeline: { delay: 0, rise: 36, duration: 500 },
      densityCue: { beat: 'escape', urgency: 0.72, responseWindowMs: 300, pulseScale: 1.1 },
    },
    guard: {
      action: 'guard',
      intensity: 0.76,
      anchor: { point: 'actor', offsetY: -74 },
      layer: { depth: 22, lane: 'evade' },
      timeline: { delay: 0, rise: 28, duration: 460 },
      densityCue: { beat: 'guard', urgency: 0.7, responseWindowMs: 280, pulseScale: 1.08 },
    },
    stagger: {
      action: 'stagger',
      intensity: 0.95,
      anchor: { point: 'target', offsetY: -68 },
      layer: { depth: 21, lane: 'wound' },
      timeline: { delay: 40, rise: 38, duration: 560 },
      densityCue: { beat: 'wound', urgency: 0.82, responseWindowMs: 320, pulseScale: 1.14 },
    },
    defeat: {
      action: 'defeat',
      intensity: 1.25,
      anchor: { point: 'target', offsetY: -54 },
      layer: { depth: 24, lane: 'finish' },
      timeline: { delay: 90, rise: 50, duration: 760 },
      densityCue: { beat: 'payoff', urgency: 1, responseWindowMs: 420, pulseScale: 1.24 },
    },
    kill: {
      action: 'kill',
      intensity: 1.25,
      anchor: { point: 'target', offsetY: -54 },
      layer: { depth: 24, lane: 'finish' },
      timeline: { delay: 90, rise: 50, duration: 760 },
      densityCue: { beat: 'payoff', urgency: 1, responseWindowMs: 420, pulseScale: 1.24 },
    },
    fail: {
      action: 'fail',
      intensity: 1.05,
      anchor: { point: 'screen', offsetY: -40 },
      layer: { depth: 25, lane: 'failure' },
      timeline: { delay: 0, rise: 22, duration: 680 },
      densityCue: { beat: 'failure', urgency: 1, responseWindowMs: 420, pulseScale: 1.18 },
    },
  };

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

  function cloneRule(rule) {
    return {
      action: rule.action,
      intensity: rule.intensity,
      anchor: { ...rule.anchor },
      layer: { ...rule.layer },
      timeline: { ...rule.timeline },
      densityCue: { ...rule.densityCue },
    };
  }

  function cloneSfx(action) {
    const cue = SFX_CUES[action] || SFX_CUES.hit;
    return { ...cue };
  }

  function feedback(label, tone, texture, ruleName, profileName) {
    const action = profileName || tone;
    const profile = cloneRule(FEEDBACK_PROFILES[action] || FEEDBACK_PROFILES.hit);
    return { label, tone, texture, intensity: profile.intensity, rule: ruleName, ...profile, sfx: cloneSfx(action) };
  }

  function getActionFeedback(input) {
    const data = input || {};
    const type = data.type || 'hit';

    if (type === 'attack') {
      const combo = getCombo(data);
      return feedback(`붓길 예고 · ${combo}식`, 'attack', 'brush_slash', 'strike', 'attack');
    }

    if (type === 'dodge' || type === 'dash') {
      const spent = getSpentStamina(data);
      return feedback(`대시 잔상 · -${spent} ST`, type === 'dash' ? 'dash' : 'dodge', 'afterimage_glow', 'evade', 'dodge');
    }

    if (type === 'guard') {
      const spent = getSpentStamina(data);
      return feedback(`먹선 가드 · -${spent} ST`, 'guard', 'afterimage_glow', 'evade', 'guard');
    }

    if (type === 'stagger') {
      const damage = getDamage(data);
      return feedback(`먹번짐 경직 · ${damage}`, 'stagger', 'blood_ink', 'wound', 'stagger');
    }

    if (type === 'defeat' || type === 'kill') {
      return feedback('먹물 폭쇄 · +50', type === 'kill' ? 'kill' : 'defeat', 'impact_ink_burst', 'finish', type);
    }

    if (type === 'fail') {
      return feedback('먹물 소진 · RETRY', 'fail', 'impact_ink_burst', 'failure', 'fail');
    }

    const combo = getCombo(data);
    const damage = getDamage(data);
    return feedback(`${combo}연 참격 · ${damage}`, 'hit', 'brush_slash', 'strike', 'hit');
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
