const TutorialCopy = require('../src/systems/TutorialCopy.js');

describe('TutorialCopy', () => {
  test('explains the escape goal, kill healing, and simple controls', () => {
    expect(TutorialCopy.title).toBe('ESCAPE PROTOCOL');
    expect(TutorialCopy.goal).toContain('escape');
    expect(TutorialCopy.heal).toContain('restore HP');
    expect(TutorialCopy.controls).toContain('Attack: Z');
    expect(TutorialCopy.controls).toContain('Skill: X');
    expect(TutorialCopy.controls).toContain('Guard: C');
    expect(TutorialCopy.controls).toContain('Swap: TAB');
  });
});
