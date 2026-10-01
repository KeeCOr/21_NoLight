const TutorialCopy = {
  title: 'ESCAPE PROTOCOL',
  goal: 'Goal: climb through the ink city and escape.',
  heal: 'Defeat enemies, then collect the HP drop to recover.',
  controls: 'Move: Arrow keys   Jump: Up   Attack: Z   Skill: X   Guard: C   Swap: TAB',
  combo: 'Chain attacks quickly to extend your combo.',
  start: '[ SPACE ] START',
  steps: [
    { title: 'GOAL', body: 'Climb upward through the ink city. Escape before the pursuer catches you.' },
    { title: 'CONTROLS', body: 'Arrow keys move and jump. Z attacks, X uses skill, C guards, TAB swaps.' },
    { title: 'SURVIVE', body: 'Enemies drop HP ink. Pick it up to heal. Keep attacking to build combos.' },
  ],
};

if (typeof module !== 'undefined') module.exports = TutorialCopy;
