const fs = require('fs');
const path = require('path');

describe('camera impact direction', () => {
  test('GameScene uses camera punches for hits, kills, combos, skills, and rushes', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'scenes', 'GameScene.js'), 'utf8');

    expect(source).toContain('_cameraPunch(kind, power = 1)');
    expect(source).toContain("this._cameraPunch('hit'");
    expect(source).toContain("this._cameraPunch('kill'");
    expect(source).toContain("this._cameraPunch('combo'");
    expect(source).toContain("this._cameraPunch('skill'");
    expect(source).toContain("this._cameraPunch('rush'");
  });
});
