const fs = require('fs');
const path = require('path');

describe('Electron window', () => {
  test('uses the same portrait size as the Phaser game canvas', () => {
    const main = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');

    expect(main).toContain('width: 1080');
    expect(main).toContain('height: 1920');
    expect(main).toContain('resizable: true');
  });
});
