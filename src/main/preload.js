const { contextBridge, ipcRenderer } = require('electron');

// Único puente entre el proceso principal y la interfaz.
// El renderer no tiene acceso a Node.js ni a ninguna otra API de Electron.
const config = ipcRenderer.sendSync('app:get-config');

contextBridge.exposeInMainWorld('appConfig', Object.freeze({
  apiBaseUrl: config.apiBaseUrl,
  version: config.version,
  userConfigFile: config.userConfigFile,
}));

contextBridge.exposeInMainWorld('appUpdater', Object.freeze({
  check: () => ipcRenderer.invoke('updater:check'),
  getStatus: () => ipcRenderer.invoke('updater:get-status'),
  install: () => ipcRenderer.invoke('updater:install'),
  onStatus: (callback) => {
    const listener = (_, status) => callback(status);
    ipcRenderer.on('updater:status', listener);
    return () => ipcRenderer.removeListener('updater:status', listener);
  },
}));
