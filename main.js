const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { start: startStaticServer, stop: stopStaticServer } = require('./src/staticServer');

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

let serverOrigin = null;

async function createWindow() {
  if (!serverOrigin) {
    const port = await startStaticServer(__dirname, 0);
    serverOrigin = `http://127.0.0.1:${port}`;
  }

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
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  win.setAspectRatio(9 / 16);

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, navigationUrl) => {
    if (navigationUrl !== `${serverOrigin}/`) {
      event.preventDefault();
    }
  });

  win.loadURL(`${serverOrigin}/`);
}

let isShuttingDown = false;

async function shutdownStaticServer() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  try {
    await stopStaticServer();
  } catch (e) {
    console.warn('[StaticServer] Failed to stop cleanly:', e.message);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    await shutdownStaticServer();
    app.quit();
  }
});

app.on('activate', () => {
  if (process.platform === 'darwin' && BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  shutdownStaticServer();
});
