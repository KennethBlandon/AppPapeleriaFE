# AppPapeleria — Frontend (escritorio)

Aplicación de escritorio de AppPapeleria hecha con Electron. Toda la información la obtiene de la API [AppPapeleriaBE](../AppPapeleriaBE); esta app **no** contiene credenciales de base de datos ni lógica de servidor.

## Requisitos

- Node.js 18 o superior
- La API (AppPapeleriaBE) corriendo y accesible

## Desarrollo

```bash
npm install
npm start
```

Por defecto se conecta a `http://localhost:3000`. Para apuntar a otra API:

- Variable de entorno: `APPPAPELERIA_API_URL=http://192.168.1.50:3000 npm start`
- O un archivo `config.json` (ver `config.example.json`):

```json
{ "apiBaseUrl": "http://192.168.1.50:3000" }
```

Se busca `config.json`, en este orden, en:

1. `%APPDATA%\AppPapeleria\config.json` (en desarrollo: `%APPDATA%\apppapeleria-fe\config.json`)
2. La carpeta del `.exe` instalado
3. La raíz de este proyecto

La URL activa se ve en la pantalla de login y en *Ajustes → Información de la Aplicación*.

## Instalador para Windows

```bash
npm run dist:win
```

Genera `release/AppPapeleria-Setup-<versión>.exe`. Después de instalar, crea `config.json` con la URL de la API en cualquiera de las ubicaciones de arriba.

## Estructura

```
src/
  main/
    main.js        Proceso principal: ventana, navegación bloqueada, apertura de PDF/enlaces
    preload.js     Expone solo window.appConfig (solo lectura) a la interfaz
    config.js      Lee la URL de la API (env / config.json)
  renderer/
    login.html, index.html, styles.css, manual.pdf
    js/
      session.js       Token de sesión (sessionStorage)
      auth-guard.js    Redirige al login si no hay sesión válida
      utils.js         escapeHtml compartido
      api.js           Cliente HTTP: agrega el token, maneja 401
      login.js         Formulario de login
      app.js           Shell, router, ajustes
      catalogo.js, inventario.js, pedidos.js, ...   Un módulo por vista
    vendor/          Tailwind, html2pdf y xlsx locales (sin depender de CDNs)
```

## Seguridad

- `contextIsolation`, `sandbox` y `nodeIntegration: false`: la interfaz no tiene acceso a Node.js.
- Content-Security-Policy sin `unsafe-inline` para scripts: un `<img onerror=...>` inyectado no se ejecuta.
- Los datos que vienen de la API se escapan con `escapeHtml` antes de insertarse como HTML.
- La ventana no puede navegar fuera de sus archivos; los enlaces externos se abren en el navegador.
- La sesión se guarda en `sessionStorage` y se pierde al cerrar la app; si la API responde `401` se vuelve al login.
