const makeFactory = (created) => () => {
  const audio = { src: '', loop: false, volume: 0, currentTime: 0, paused: true, play() { this.paused = false; }, pause() { this.paused = true; } };
  created.push(audio); return audio;
};

test('audio starts once from the gesture entrypoint', async () => {
  const { GameAudioDirector } = await import('../src/systems/GameAudioDirector.mjs'); const made = [];
  const d = new GameAudioDirector({ audioFactory: makeFactory(made), bgmUrl: '/b', cues: {} }); expect(made).toHaveLength(0); d.startFromGesture(); d.startFromGesture(); expect(made).toHaveLength(1); expect(made[0].loop).toBe(true);
});
test('audio separates BGM and SFX volume', async () => {
  const { GameAudioDirector } = await import('../src/systems/GameAudioDirector.mjs'); const made = [];
  const d = new GameAudioDirector({ audioFactory: makeFactory(made), bgmUrl: '/b', cues: { action: '/a' } }); d.setBgmVolume(.2); d.setSfxVolume(.7); d.startFromGesture(); d.playCue('action'); expect(made[0].volume).toBe(.2); expect(made[1].volume).toBe(.7);
});
test('audio clamps and mutes safely', async () => {
  const { GameAudioDirector } = await import('../src/systems/GameAudioDirector.mjs'); const made = [];
  const d = new GameAudioDirector({ audioFactory: makeFactory(made), bgmUrl: '/b', cues: {} }); d.setBgmVolume(9); d.setSfxVolume(-1); d.startFromGesture(); d.setMuted(true); expect(d.settings).toEqual({ bgmVolume: 1, sfxVolume: 0, muted: true }); expect(made[0].volume).toBe(0);
});
