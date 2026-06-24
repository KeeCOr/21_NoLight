(function (root) {
  const PROFILE_BASE = {
    hit: { duration: 86, intensity: 0.0035, zoom: 1.014, flash: 26, color: 0xffffff, nudge: 5, nudgeY: -1, recoverDuration: 125, hitStop: 42 },
    combo: { duration: 112, intensity: 0.0048, zoom: 1.026, flash: 42, color: 0xf4efe3, nudge: 9, nudgeY: -3, recoverDuration: 170, hitStop: 58 },
    kill: { duration: 152, intensity: 0.0062, zoom: 1.04, flash: 70, color: 0x05070b, nudge: 15, nudgeY: -5, recoverDuration: 225, hitStop: 72 },
    skill: { duration: 190, intensity: 0.0065, zoom: 1.045, flash: 76, color: 0xffffff, nudge: 10, nudgeY: -6, recoverDuration: 230, hitStop: 64 },
    rush: { duration: 320, intensity: 0.009, zoom: 1.055, flash: 95, color: 0x05070b, nudge: 0, nudgeY: -10, recoverDuration: 300, hitStop: 0 },
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getCameraImpactProfile(input = {}) {
    const kind = PROFILE_BASE[input.kind] ? input.kind : 'hit';
    const base = PROFILE_BASE[kind];
    const power = Number.isFinite(input.power) ? clamp(input.power, 0.5, 1.45) : 1;
    const facing = input.facing === -1 ? -1 : 1;
    const comboStep = Math.max(1, Math.min(3, Math.round(input.comboStep || 1)));
    const comboBonus = kind === 'combo' || kind === 'hit' ? (comboStep - 1) * 3 : 0;
    const nudge = Math.round((base.nudge + comboBonus) * power);

    return {
      kind,
      duration: Math.round(base.duration * power),
      intensity: Number((base.intensity * power).toFixed(5)),
      zoom: Number(Math.min(1.055, 1 + (base.zoom - 1) * power).toFixed(3)),
      flash: Math.round(base.flash * power),
      color: base.color,
      nudgeX: nudge * facing,
      nudgeY: Math.round(base.nudgeY * power),
      recoverDuration: Math.round(base.recoverDuration * power),
      hitStop: Math.round(base.hitStop * power),
    };
  }

  root.getCameraImpactProfile = getCameraImpactProfile;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getCameraImpactProfile };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
