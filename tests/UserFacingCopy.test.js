const fs = require('fs');
const path = require('path');

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

describe('readable user-facing copy', () => {
  test('action feedback labels remain readable Korean callouts', () => {
    const { getActionFeedback } = require('../src/systems/ActionFeedback');

    expect(getActionFeedback({ type: 'hit', comboStep: 2, damage: 34 }).label).toBe('2연 참격 · 34');
    expect(getActionFeedback({ type: 'kill', damage: 60 }).label).toBe('먹물 폭쇄 · +50');
    expect(getActionFeedback({ type: 'dash', staminaBefore: 80, staminaAfter: 50 }).label).toBe('대시 잔상 · -30 ST');
  });

  test('HUD source uses readable control labels and an explicit TAB swap slot', () => {
    const source = read('src/ui/HUD.js');

    expect(source).toContain("'▲'");
    expect(source).toContain("'▼'");
    expect(source).toContain("'◀'");
    expect(source).toContain("'▶'");
    expect(source).toContain("label: '참격'");
    expect(source).toContain("label: '대시'");
    expect(source).toContain("label: '필살'");
    expect(source).toContain("label: '검'");
    expect(source).toContain("label: 'TAB'");
  });
});
