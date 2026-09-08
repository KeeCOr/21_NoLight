import { GameAudioDirector } from './GameAudioDirector.mjs';

export function installGameAudioRuntime(basePath, bgmFile = 'bgm-loop.ogg') {
  if (globalThis.__gameAudioRuntime) return globalThis.__gameAudioRuntime;
  const kenney = (name) => `./assets/audio/kenney/${name}.ogg`;
  const director = new GameAudioDirector({
    audioFactory: () => new Audio(),
    bgmUrl: `${basePath}/${bgmFile}`,
    cues: {
      ui: { src: kenney('sfx_dodge_guard'), category: 'ui', gain: 0.34 },
      action: { src: kenney('sfx_attack_slash'), category: 'action', gain: 0.42 },
      danger: { src: kenney('sfx_player_hurt'), category: 'danger', gain: 0.46 },
      transition: { src: kenney('sfx_attack_slash'), category: 'transition', gain: 0.42 },
      result: { src: kenney('sfx_stage_fail'), category: 'result', gain: 0.5 },
    },
  });
  const start = () => director.startFromGesture();
  window.addEventListener('pointerdown', start, { once: true });
  window.addEventListener('keydown', start, { once: true });
  document.addEventListener('visibilitychange', () => director.handleVisibility(document.hidden));
  window.addEventListener('game-audio', (event) => {
    if (event.detail?.cue) director.playCue(event.detail.cue);
  });
  globalThis.__gameAudioRuntime = director;
  return director;
}

export function emitGameAudioCue(cue) {
  window.dispatchEvent(new CustomEvent('game-audio', { detail: { cue } }));
}
