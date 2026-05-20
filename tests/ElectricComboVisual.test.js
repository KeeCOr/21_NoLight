const fs = require('fs');
const path = require('path');

describe('Electric combo visual', () => {
  test('GameScene renders electric basic attacks as increasing discharges', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'scenes', 'GameScene.js'), 'utf8');

    expect(source).toContain('_electricDischarge(char, comboStep');
    expect(source).toContain('const boltCount = comboStep + 1');
    expect(source).toContain('if (current instanceof ElectricCharacter)');
  });
});
