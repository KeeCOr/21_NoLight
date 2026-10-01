const fs = require('fs');
const path = require('path');

describe('camera impact direction', () => {
  test('GameScene uses direction-aware camera impact profiles for hits, kills, combos, skills, and rushes', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'scenes', 'GameScene.js'), 'utf8');

    expect(source).toContain('getCameraImpactProfile');
    expect(source).toContain('_cameraPunch(kind, power = 1, options = {})');
    expect(source).toContain('_cameraNudge(profile)');
    expect(source).toContain("this._cameraPunch('hit', 1, {");
    expect(source).toContain("this._cameraPunch('kill', 1.25, {");
    expect(source).toContain("this._cameraPunch('combo', 1.1, {");
    expect(source).toContain("this._cameraPunch('skill', radius >= 180 ? 1.15 : 0.85, {");
    expect(source).toContain("this._cameraPunch('rush'");
  });
});
