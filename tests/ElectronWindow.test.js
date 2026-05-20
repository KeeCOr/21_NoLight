const fs = require('fs');
const path = require('path');

describe('Electron window', () => {
  test('uses the same portrait size as the Phaser game canvas', () => {
    const main = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');

    expect(main).toContain('width: 900');
    expect(main).toContain('height: 1600');
    expect(main).toContain('resizable: true');
  });
});
