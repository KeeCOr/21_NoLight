const { combatCue } = require('../src/systems/CombatReadability');
test('kill cue is stronger than hit cue', () => { expect(combatCue('kill').freezeMs).toBeGreaterThan(combatCue('hit').freezeMs); });
