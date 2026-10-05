const { app, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

// Las actualizaciones se publican como GitHub Releases del repo AppPapeleriaFE
// (configurado en package.json → build.publish). electron-builder genera latest.yml,
// que es lo que el updater consulta para saber si hay una versión nueva.

const CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000; // cada 4 horas mientras la app esté abierta

let getWindow = () => null;
let lastStatus = { state: 'idle' };

const publish = (status) => {
  lastStatus = { ...status, currentVersion: app.getVersion() };
  const win = getWindow();
  if (win && !win.isDestroyed()) {
    win.webContents.send('updater:status', lastStatus);
  }
};

const handleError = (error) => {
  const message = error?.message || String(error);
  // Sin releases publicados todavía no es un fallo: simplemente no hay nada más nuevo.
  if (/No published versions/i.test(message)) {
    publish({ state: 'up-to-date' });
    return;
  }
  publish({ state: 'error', message });
};

const check = async () => {
  if (!app.isPackaged) {
    publish({ state: 'unsupported', message: 'Las actualizaciones solo funcionan en la app instalada.' });
    return lastStatus;
  }

  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    handleError(error);
  }
  return lastStatus;
};

const initUpdater = (windowGetter) => {
  getWindow = windowGetter;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.logger = console;

  autoUpdater.on('checking-for-update', () => publish({ state: 'checking' }));
  autoUpdater.on('update-not-available', () => publish({ state: 'up-to-date' }));
  autoUpdater.on('update-available', (info) => publish({ state: 'available', version: info.version }));
  autoUpdater.on('download-progress', (progress) => publish({
    state: 'downloading',
    version: lastStatus.version,
    percent: Math.round(progress.percent || 0),
  }));
  autoUpdater.on('update-downloaded', (info) => publish({ state: 'downloaded', version: info.version }));
  autoUpdater.on('error', handleError);

  ipcMain.handle('updater:check', () => check());
  ipcMain.handle('updater:get-status', () => ({ ...lastStatus, currentVersion: app.getVersion() }));
  ipcMain.handle('updater:install', () => {
    if (lastStatus.state !== 'downloaded') return false;
    // Cierra la app, instala en silencio y la vuelve a abrir.
    setImmediate(() => autoUpdater.quitAndInstall(true, true));
    return true;
  });

  if (app.isPackaged) {
    // Primera revisión unos segundos después de abrir, para no competir con la carga inicial.
    setTimeout(check, 10 * 1000);
    setInterval(check, CHECK_INTERVAL_MS).unref();
  }
};

module.exports = { initUpdater };
