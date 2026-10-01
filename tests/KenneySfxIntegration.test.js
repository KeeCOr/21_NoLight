const fs = require('fs');
const path = require('path');
const { getActionFeedback, getCombatFeedbackSequence } = require('../src/systems/ActionFeedback');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('Kenney combat SFX integration', () => {
  test('first 30-second combat feedback events expose compact Kenney SFX cues', () => {
    const sequence = getCombatFeedbackSequence([
      { type: 'attack', comboStep: 1 },
      { type: 'dodge', staminaBefore: 70, staminaAfter: 45 },
      { type: 'guard', staminaBefore: 60, staminaAfter: 52 },
      { type: 'hit', comboStep: 2, damage: 24 },
      { type: 'stagger', damage: 18 },
      { type: 'defeat', damage: 80 },
      { type: 'fail' },
    ]);

    expect(sequence.map(step => step.sfx.key)).toEqual([
      'sfx_attack_slash',
      'sfx_dodge_guard',
      'sfx_dodge_guard',
      'sfx_hit_impact',
      'sfx_player_hurt',
      'sfx_enemy_defeat',
      'sfx_stage_fail',
    ]);
    expect(new Set(sequence.map(step => step.sfx.key)).size).toBeLessThanOrEqual(6);
    expect(sequence.every(step => step.sfx.source === 'Kenney CC0')).toBe(true);
  });

  test('BootScene preloads the selected Kenney combat SFX files', () => {
    const source = read('src/scenes/BootScene.js');

    [
      "this.load.audio('sfx_attack_slash', 'assets/audio/kenney/sfx_attack_slash.ogg')",
      "this.load.audio('sfx_dodge_guard', 'assets/audio/kenney/sfx_dodge_guard.ogg')",
      "this.load.audio('sfx_hit_impact', 'assets/audio/kenney/sfx_hit_impact.ogg')",
      "this.load.audio('sfx_player_hurt', 'assets/audio/kenney/sfx_player_hurt.ogg')",
      "this.load.audio('sfx_enemy_defeat', 'assets/audio/kenney/sfx_enemy_defeat.ogg')",
      "this.load.audio('sfx_stage_fail', 'assets/audio/kenney/sfx_stage_fail.ogg')",
    ].forEach(expected => expect(source).toContain(expected));
  });

  test('GameScene plays feedback SFX through a guarded sample-first helper', () => {
    const source = read('src/scenes/GameScene.js');

    expect(source).toContain('this._playFeedbackSfx(feedback);');
    expect(source).toContain('this.sound?.get?.(feedback.sfx.key)');
    expect(source).toContain('this.sound.play(feedback.sfx.key');
    expect(source).toContain('feedback.sfx.fallback');
  });

  test('project keeps Kenney source attribution next to runtime audio files', () => {
    const readme = read('assets/audio/kenney/README.md');
    const runtimeFiles = [
      'sfx_attack_slash.ogg',
      'sfx_dodge_guard.ogg',
      'sfx_hit_impact.ogg',
      'sfx_player_hurt.ogg',
      'sfx_enemy_defeat.ogg',
      'sfx_stage_fail.ogg',
    ];

    expect(readme).toContain('Kenney');
    expect(readme).toContain('CC0');
    runtimeFiles.forEach(fileName => {
      expect(fs.existsSync(path.join(__dirname, '..', 'assets/audio/kenney', fileName))).toBe(true);
      expect(readme).toContain(fileName);
    });
  });

  test('unknown feedback keeps a synthesized fallback cue instead of hard failing audio', () => {
    expect(getActionFeedback({ type: 'unknown' }).sfx).toMatchObject({
      key: 'sfx_hit_impact',
      fallback: 'synth-hit',
    });
  });
});

