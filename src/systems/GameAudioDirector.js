const CUE_NAMES = ['ui', 'action', 'danger', 'transition', 'result'];

function clamp01(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export class GameAudioDirector {
  constructor({ audioFactory, cues, bgmUrl }) {
    this.audioFactory = audioFactory;
    this.cues = {};
    for (const name of CUE_NAMES) if (cues?.[name]) this.cues[name] = cues[name];
    this.bgmUrl = bgmUrl;
    this.bgmVolume = 1;
    this.sfxVolume = 1;
    this.muted = false;
    this.bgm = null;
  }

  startFromGesture() {
    if (this.bgm && !this.bgm.paused) return;
    const bgm = this.audioFactory();
    bgm.src = this.bgmUrl;
    bgm.loop = true;
    bgm.volume = this.muted ? 0 : this.bgmVolume;
    this.bgm = bgm;
    try { const result = bgm.play(); if (result?.catch) result.catch(() => {}); } catch {}
  }

  playCue(name) {
    const src = this.cues[name];
    if (!src) return;
    const sfx = this.audioFactory();
    sfx.src = src;
    sfx.loop = false;
    sfx.volume = this.muted ? 0 : this.sfxVolume;
    try { const result = sfx.play(); if (result?.catch) result.catch(() => {}); } catch {}
  }

  setBgmVolume(value) { this.bgmVolume = clamp01(value); this.applyBgmVolume(); }
  setSfxVolume(value) { this.sfxVolume = clamp01(value); }
  setMuted(value) { this.muted = !!value; this.applyBgmVolume(); }
  applyBgmVolume() { if (this.bgm) this.bgm.volume = this.muted ? 0 : this.bgmVolume; }
  stopBgm() { if (this.bgm) { this.bgm.pause(); this.bgm.currentTime = 0; } }
  get settings() { return { bgmVolume: this.bgmVolume, sfxVolume: this.sfxVolume, muted: this.muted }; }
}
