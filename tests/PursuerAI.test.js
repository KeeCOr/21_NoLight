const { PursuerAI, PURSUER_STATE } = require('../src/systems/PursuerAI.js');

describe('PursuerAI rush pressure', () => {
  test('enters a short rush state on a fixed interval, then returns to chase', () => {
    const ai = new PursuerAI();

    expect(ai.update(17999)).not.toBe('rush');
    expect(ai.state).toBe(PURSUER_STATE.CHASING);

    expect(ai.update(1)).toBe('rush');
    expect(ai.state).toBe(PURSUER_STATE.RUSHING);
    expect(ai.getSpeed(120)).toBe(660);

    expect(ai.update(2400)).toBeNull();
    expect(ai.state).toBe(PURSUER_STATE.CHASING);
  });
});
