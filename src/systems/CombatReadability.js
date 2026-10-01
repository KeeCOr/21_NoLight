function combatCue(action, intensity = 1) {
  const cues = {
    attack: { ink: 'slash', freezeMs: 35, shake: 0.002 },
    hit: { ink: 'burst', freezeMs: 65, shake: 0.006 },
    dodge: { ink: 'trail', freezeMs: 0, shake: 0 },
    kill: { ink: 'bloom', freezeMs: 95, shake: 0.01 },
  };
  const cue = cues[action] ?? cues.attack;
  return { ...cue, shake: Math.min(0.018, cue.shake * Math.max(0, intensity)), label: action.toUpperCase() };
}

if (typeof module !== 'undefined') module.exports = { combatCue };
if (typeof window !== 'undefined') window.CombatReadability = { combatCue };
