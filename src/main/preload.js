const { contextBridge, ipcRenderer } = require('electron');

// Único puente entre el proceso principal y la interfaz: configuración de solo lectura.
// El renderer no tiene acceso a Node.js ni a ninguna otra API de Electron.
const config = ipcRenderer.sendSync('app:get-config');

contextBridge.exposeInMainWorld('appConfig', Object.freeze({
  apiBaseUrl: config.apiBaseUrl,
  version: config.version,
  userConfigFile: config.userConfigFile,
}));
