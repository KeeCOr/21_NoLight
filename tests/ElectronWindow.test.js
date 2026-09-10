const fs = require('fs');
const path = require('path');

describe('Electron window', () => {
  const main = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');

  test('uses the same portrait size as the Phaser game canvas', () => {
    expect(main).toContain('width: 900');
    expect(main).toContain('height: 1600');
    expect(main).toContain('minWidth: 450');
    expect(main).toContain('minHeight: 800');
    expect(main).toContain('resizable: true');
    expect(main).toContain('setAspectRatio(9 / 16)');
    expect(main).toContain('autoHideMenuBar: true');
  });

  test('integrates the static server and loads via loopback with a dynamic port', () => {
    expect(main).toMatch(/require\(['"]\.\/src\/staticServer['"]\)/);
    expect(main).toMatch(/startStaticServer\(__dirname,\s*0\)/);
    expect(main).toContain('http://127.0.0.1:${port}');
    expect(main).toContain('win.loadURL(');
  });

  test('never uses loadFile or file:// URLs', () => {
    expect(main).not.toContain('loadFile');
    expect(main).not.toContain('file://');
  });

  test('starts the static server only once and stops it idempotently', () => {
    expect(main).toContain('let serverOrigin = null;');
    expect(main).toMatch(/if \(!serverOrigin\)\s*{\s*const port = await startStaticServer/);
    expect(main).toContain('stopStaticServer()');
    expect(main).toContain('let isShuttingDown = false;');
    expect(main).toMatch(/if \(isShuttingDown\) return;/);
  });

  test('closes window-all-closed before quitting on non-darwin platforms', () => {
    expect(main).toMatch(/app\.on\('window-all-closed', async \(\) => {\s*if \(process\.platform !== 'darwin'\) {\s*await shutdownStaticServer\(\);\s*app\.quit\(\);/);
  });

  test('handles before-quit without recursive shutdown calls', () => {
    expect(main).toMatch(/app\.on\('before-quit', \(\) => {\s*shutdownStaticServer\(\);\s*}\);/);
  });

  test('optionally recreates the window on macOS activate', () => {
    expect(main).toMatch(/app\.on\('activate', \(\) => {/);
    expect(main).toContain("process.platform === 'darwin'");
    expect(main).toContain('BrowserWindow.getAllWindows().length === 0');
  });

  test('keeps strict security webPreferences with the existing preload', () => {
    expect(main).toContain('nodeIntegration: false');
    expect(main).toContain('contextIsolation: true');
    expect(main).toContain('sandbox: true');
    expect(main).toContain("preload: path.join(__dirname, 'preload.js')");
  });

  test('denies new windows and blocks navigation away from the loopback origin', () => {
    expect(main).toContain("setWindowOpenHandler(() => ({ action: 'deny' }))");
    expect(main).toMatch(/on\('will-navigate', \(event, navigationUrl\) => {\s*if \(navigationUrl !== `\$\{serverOrigin\}\/`\) {\s*event\.preventDefault\(\);/);
  });

  test('preserves Steam IPC handlers and initialization exactly', () => {
    expect(main).toContain("require('steamworks.js')");
    expect(main).toContain("steam.init(STEAM_APP_ID)");
    expect(main).toContain("ipcMain.on('steam:available',   e => { e.returnValue = steam !== null; });");
    expect(main).toContain("ipcMain.on('steam:getUserName', e => { e.returnValue = steam ? steam.localplayer.getName() : null; });");
    expect(main).toContain("ipcMain.handle('achievement:unlock', async (_, id) => {");
    expect(main).toContain("ipcMain.on('achievement:isUnlocked', (e, id) => {");
  });
});
