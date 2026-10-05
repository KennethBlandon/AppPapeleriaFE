const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

const stripTrailingSlash = (value) => String(value || '').trim().replace(/\/+$/, '');

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// La app de escritorio solo necesita saber dónde está la API.
// No contiene credenciales de base de datos: esas viven únicamente en el servidor (AppPapeleriaBE).
const candidateConfigFiles = () => [
  path.join(app.getPath('userData'), 'config.json'),
  path.join(path.dirname(process.execPath), 'config.json'),
  path.join(__dirname, '..', '..', 'config.json'),
];

const readConfigFile = () => {
  for (const file of candidateConfigFiles()) {
    if (!fs.existsSync(file)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`[CONFIG] Configuración cargada desde: ${file}`);
      return { data, file };
    } catch (error) {
      console.warn(`[CONFIG] No se pudo leer ${file}: ${error.message}`);
    }
  }
  return { data: {}, file: null };
};

const loadConfig = () => {
  const { data, file } = readConfigFile();
  const fromEnv = process.env.APPPAPELERIA_API_URL || process.env.API_BASE_URL;
  const candidate = stripTrailingSlash(fromEnv || data.apiBaseUrl || DEFAULT_API_BASE_URL);

  if (!isHttpUrl(candidate)) {
    console.warn(`[CONFIG] apiBaseUrl inválida (${candidate}). Se usará ${DEFAULT_API_BASE_URL}.`);
  }

  return {
    apiBaseUrl: isHttpUrl(candidate) ? candidate : DEFAULT_API_BASE_URL,
    configFile: file,
    userConfigFile: candidateConfigFiles()[0],
    version: app.getVersion(),
  };
};

module.exports = { loadConfig };
