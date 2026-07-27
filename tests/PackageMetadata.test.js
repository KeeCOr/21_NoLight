const fs = require('fs');
const path = require('path');

describe('package metadata shell compatibility', () => {
  test('package metadata uses ASCII-safe distribution strings', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

    expect(pkg.name).toBe('21-nl');
    expect(pkg.version).toBe('0.12.0');
    expect(pkg.description).toBe('Ink-brush action platformer');
    expect(pkg.author).toBe('Jinwoo Oh');
    expect(/^[\x20-\x7E]+$/.test(pkg.description)).toBe(true);
    expect(/^[\x20-\x7E]+$/.test(pkg.author)).toBe(true);
  });
});

