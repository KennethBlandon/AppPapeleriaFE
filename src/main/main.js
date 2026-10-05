const path = require('path');
const { pathToFileURL, fileURLToPath } = require('url');
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { loadConfig } = require('./config');

const RENDERER_DIR = path.join(__dirname, '..', 'renderer');
const RENDERER_URL_PREFIX = pathToFileURL(RENDERER_DIR + path.sep).href;

let mainWindow = null;
let appConfig = null;

// Prevenir múltiples instancias en Windows
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const isInternalUrl = (url) => String(url).startsWith(RENDERER_URL_PREFIX);

const openExternally = (url) => {
  if (url.startsWith('file:')) {
    const filePath = fileURLToPath(url);
    // Solo se abren archivos propios de la app (p. ej. el manual en PDF).
    if (filePath.startsWith(RENDERER_DIR) && filePath.toLowerCase().endsWith('.pdf')) {
      shell.openPath(filePath);
    }
    return;
  }

  if (/^https?:\/\//i.test(url)) {
    shell.openExternal(url);
  }
};

function createWindow() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      spellcheck: false,
    },
  });

  // El renderer no puede navegar fuera de sus propios archivos ni abrir ventanas nuevas.
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isInternalUrl(url)) {
      event.preventDefault();
      openExternally(url);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternally(url);
    return { action: 'deny' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadFile(path.join(RENDERER_DIR, 'login.html'));
}

ipcMain.on('app:get-config', (event) => {
  event.returnValue = {
    apiBaseUrl: appConfig.apiBaseUrl,
    version: appConfig.version,
    userConfigFile: appConfig.userConfigFile,
  };
});

app.on('web-contents-created', (_, contents) => {
  // Bloquea <webview> por completo: la app no los usa.
  contents.on('will-attach-webview', (event) => event.preventDefault());
});

app.whenReady().then(() => {
  appConfig = loadConfig();
  console.log(`[ELECTRON] API: ${appConfig.apiBaseUrl}`);
  createWindow();
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
