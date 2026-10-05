const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

// Las actualizaciones se publican como GitHub Releases del repo AppPapeleriaFE
// (configurado en package.json → build.publish). electron-builder genera latest.yml,
// que es lo que el updater consulta para saber si hay una versión nueva.

const CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000; // cada 4 horas mientras la app esté abierta

let getWindow = () => null;
let lastStatus = { state: 'idle' };
let installing = false;

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

// Instala la actualización descargada. El instalador se muestra (no es silencioso) para que el
// usuario vea que se está actualizando y no vuelva a abrir la app a mitad del proceso: si la app
// está abierta mientras se reemplazan sus archivos, el instalador falla con
// "No se pudieron desinstalar los archivos antiguos". Al terminar, la app se vuelve a abrir sola.
const installNow = () => {
  if (installing || lastStatus.state !== 'downloaded') return false;
  installing = true;
  publish({ state: 'installing', version: lastStatus.version });

  // Cerrar las ventanas primero libera los procesos de Chromium que bloquean archivos.
  BrowserWindow.getAllWindows().forEach((win) => win.destroy());
  setImmediate(() => autoUpdater.quitAndInstall(false, true));
  return true;
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
  // La instalación al cerrar se maneja abajo (before-quit) para que sea visible y reabra la app.
  autoUpdater.autoInstallOnAppQuit = false;
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
  ipcMain.handle('updater:install', () => installNow());

  // Si el usuario cierra la app con una actualización ya descargada, se instala en ese momento.
  app.on('before-quit', (event) => {
    if (installing || lastStatus.state !== 'downloaded') return;
    event.preventDefault();
    installNow();
  });

  if (app.isPackaged) {
    // Primera revisión unos segundos después de abrir, para no competir con la carga inicial.
    setTimeout(check, 10 * 1000);
    setInterval(check, CHECK_INTERVAL_MS).unref();
  }
};

module.exports = { initUpdater };
