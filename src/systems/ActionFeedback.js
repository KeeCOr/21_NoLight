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
      visualCue: { kind: 'slash', scaleX: 1.12, scaleY: 0.58, alpha: 0.34, angle: -12, durationMs: 220 },
    },
    hit: {
      action: 'hit',
      intensity: 0.9,
      anchor: { point: 'target', offsetY: -48 },
      layer: { depth: 21, lane: 'impact' },
      timeline: { delay: 60, rise: 42, duration: 560 },
      densityCue: { beat: 'contact', urgency: 0.86, responseWindowMs: 260, pulseScale: 1.15 },
      visualCue: { kind: 'impact', scaleX: 0.92, scaleY: 0.92, alpha: 0.42, angle: 0, durationMs: 210 },
    },
    dodge: {
      action: 'dodge',
      intensity: 0.7,
      anchor: { point: 'actor', offsetY: -78 },
      layer: { depth: 22, lane: 'evade' },
      timeline: { delay: 0, rise: 36, duration: 500 },
      densityCue: { beat: 'escape', urgency: 0.72, responseWindowMs: 300, pulseScale: 1.1 },
      visualCue: { kind: 'afterimage', scaleX: 1.3, scaleY: 0.82, alpha: 0.32, angle: 0, durationMs: 260 },
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
      visualCue: { kind: 'wound', scaleX: 1.04, scaleY: 0.9, alpha: 0.46, angle: 0, durationMs: 240 },
    },
    defeat: {
      action: 'defeat',
      intensity: 1.25,
      anchor: { point: 'target', offsetY: -54 },
      layer: { depth: 24, lane: 'finish' },
      timeline: { delay: 90, rise: 50, duration: 760 },
      densityCue: { beat: 'payoff', urgency: 1, responseWindowMs: 420, pulseScale: 1.24 },
      visualCue: { kind: 'burst', scaleX: 1.52, scaleY: 1.38, alpha: 0.58, angle: 0, durationMs: 360 },
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
      visualCue: { ...rule.visualCue },
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

  function buildCombatDemoSummary(events, elapsedMs = 60000) {
    const list = Array.isArray(events) ? events : [];
    const kills = list.filter(event => event.type === 'kill' || event.type === 'defeat').length;
    const hits = list.filter(event => event.type === 'hit').length;
    const dodges = list.filter(event => event.type === 'dodge' || event.type === 'dash').length;
    const growth = Math.max(1, Math.floor((hits + dodges + kills * 2) / 4));
    return { elapsedMs, kills, growth, completed: elapsedMs <= 60000 && kills >= 1, headline: `붓길 ${growth}단계 · 강적 ${kills}명 처치` };
  }

  function buildCombatObjectiveProgress(input) {
    const data = input || {};
    const hits = Math.max(0, Math.floor(data.hits || 0));
    const dodges = Math.max(0, Math.floor(data.dodges || 0));
    const kills = Math.max(0, Math.floor(data.kills || 0));
    const eliteKills = Math.max(0, Math.floor(data.eliteKills || 0));
    const elapsedMs = Math.max(0, Math.floor(data.elapsedMs || 0));
    const durationMs = Math.max(1000, Math.floor(data.durationMs || 60000));
    const training = Math.min(3, hits + dodges);
    const remainingSeconds = Math.max(0, Math.ceil((durationMs - elapsedMs) / 1000));
    const overtimeSeconds = Math.max(0, Math.floor((elapsedMs - durationMs) / 1000));
    const timeLabel = elapsedMs <= durationMs
      ? `남은 시간 00:${String(remainingSeconds).padStart(2, '0')}`
      : `초과 시간 +00:${String(overtimeSeconds).padStart(2, '0')}`;

    if (eliteKills >= 1 && training >= 3) {
      const onTime = elapsedMs <= durationMs;
      return {
        stage: onTime ? 'complete' : 'late-complete',
        current: onTime ? '완료 · 강적 처치' : '완료 · 60초 초과',
        next: onTime ? '다음 · 더 높은 층으로' : '다음 · 더 빠르게 도전',
        trail: '첫 적중  →  붓길 성장  →  강적 처치', reward: onTime ? '+50' : '+0',
        timeLabel, status: onTime ? '60초 수련 완수' : '수련은 완수했지만 시간 보상은 놓쳤다',
        eliteUnlocked: true, complete: true, onTime,
      };
    }
    if (training >= 3) {
      return {
        stage: elapsedMs <= durationMs ? 'boss' : 'overtime',
        current: elapsedMs <= durationMs ? '현재 · 강적 해금' : '시간 초과 · 강적 추적',
        next: elapsedMs <= durationMs ? '다음 · 강적 처치 +50' : '다음 · 강적 처치로 마무리',
        trail: '첫 적중  →  붓길 성장  →  강적 처치', reward: elapsedMs <= durationMs ? '+50' : '+0',
        timeLabel, status: '일반 적 처치는 완료로 계산되지 않는다',
        eliteUnlocked: true, complete: false, onTime: elapsedMs <= durationMs,
      };
    }
    if (hits >= 1) {
      return {
        stage: 'train', current: `현재 · 붓길 단련 ${training}/3`, next: '다음 · 강적 처치 +50',
        trail: '첫 적중  →  붓길 성장  →  강적 처치', reward: '+50',
        timeLabel, status: `${kills}명 처치 · 공격과 회피로 강적을 해금하라`,
        eliteUnlocked: false, complete: false, onTime: elapsedMs <= durationMs,
      };
    }
    return {
      stage: 'first-hit', current: '현재 · 첫 공격 적중', next: '다음 · 붓길 성장',
      trail: '첫 적중  →  붓길 성장  →  강적 처치', reward: '+50',
      timeLabel, status: '첫 공격을 적중시키면 수련이 시작된다',
      eliteUnlocked: false, complete: false, onTime: elapsedMs <= durationMs,
    };
  }

  root.getActionFeedback = getActionFeedback;
  root.getCombatFeedbackSequence = getCombatFeedbackSequence;
  root.buildCombatDemoSummary = buildCombatDemoSummary;
  root.buildCombatObjectiveProgress = buildCombatObjectiveProgress;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getActionFeedback, getCombatFeedbackSequence, buildCombatDemoSummary, buildCombatObjectiveProgress };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
