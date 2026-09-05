const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// TODO: Replace 480 with actual Steam App ID before release
const STEAM_APP_ID = 480;
let steam = null;
try {
  steam = require('steamworks.js');
  steam.init(STEAM_APP_ID);
  console.log('[Steam] Initialized, user:', steam.localplayer.getName());
} catch (e) {
  console.warn('[Steam] Not available:', e.message);
}

// ── Steam IPC ──────────────────────────────────────────────────────────────
ipcMain.on('steam:available',   e => { e.returnValue = steam !== null; });
ipcMain.on('steam:getUserName', e => { e.returnValue = steam ? steam.localplayer.getName() : null; });
ipcMain.handle('achievement:unlock', async (_, id) => {
  if (!steam) return false;
  try { steam.achievement.activate(id); return true; } catch { return false; }
});
ipcMain.on('achievement:isUnlocked', (e, id) => {
  e.returnValue = steam ? steam.achievement.isActivated(id) : false;
});
// ──────────────────────────────────────────────────────────────────────────

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 1600,
    minWidth: 450,
    minHeight: 800,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.setAspectRatio(9 / 16);
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
