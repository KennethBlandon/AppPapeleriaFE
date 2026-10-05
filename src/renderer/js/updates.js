// Aviso de actualizaciones (la descarga la hace el proceso principal con electron-updater).
(() => {
  const updater = window.appUpdater;
  if (!updater) return;

  const statusSpan = document.getElementById('update-status');
  const checkButton = document.getElementById('update-check');

  let banner = null;
  let dismissedVersion = null;

  const describe = (status) => {
    switch (status.state) {
      case 'checking': return 'Buscando actualizaciones...';
      case 'up-to-date': return 'Tienes la versión más reciente.';
      case 'available': return `Descargando versión ${status.version}...`;
      case 'downloading': return `Descargando versión ${status.version || ''} (${status.percent || 0}%)...`;
      case 'downloaded': return `Versión ${status.version} lista para instalar.`;
      case 'unsupported': return status.message;
      case 'error': return 'No se pudo verificar actualizaciones.';
      default: return 'Sin verificar.';
    }
  };

  const removeBanner = () => {
    banner?.remove();
    banner = null;
  };

  const showInstallBanner = (status) => {
    if (banner || dismissedVersion === status.version) return;

    banner = document.createElement('div');
    banner.className = 'no-print';
    banner.setAttribute('role', 'status');
    banner.style.cssText = `
      position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 10001;
      max-width: 22rem; background: #002542; color: #fff; border-radius: 0.75rem;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25); padding: 1rem 1.1rem;
      display: grid; gap: 0.7rem; font-size: 0.9rem;
    `;

    const title = document.createElement('strong');
    title.textContent = 'Nueva versión disponible';

    const text = document.createElement('span');
    text.textContent = `La versión ${status.version} ya se descargó. Reinicia la aplicación para instalarla.`;
    text.style.cssText = 'color: #d1e4ff; line-height: 1.4;';

    const actions = document.createElement('div');
    actions.style.cssText = 'display: flex; gap: 0.5rem; justify-content: flex-end;';

    const later = document.createElement('button');
    later.type = 'button';
    later.textContent = 'Más tarde';
    later.style.cssText = 'background: transparent; color: #d1e4ff; border: 1px solid #436182; border-radius: 0.5rem; padding: 0.4rem 0.8rem; cursor: pointer;';
    later.addEventListener('click', () => {
      dismissedVersion = status.version;
      removeBanner();
    });

    const install = document.createElement('button');
    install.type = 'button';
    install.textContent = 'Reiniciar e instalar';
    install.style.cssText = 'background: #fff; color: #002542; border: 0; border-radius: 0.5rem; padding: 0.4rem 0.8rem; font-weight: 700; cursor: pointer;';
    install.addEventListener('click', async () => {
      install.disabled = true;
      install.textContent = 'Instalando...';
      await updater.install();
    });

    actions.append(later, install);
    banner.append(title, text, actions);
    document.body.appendChild(banner);
  };

  const render = (status) => {
    if (statusSpan) {
      statusSpan.textContent = describe(status);
      statusSpan.style.color = status.state === 'error' ? '#d32f2f' : status.state === 'downloaded' ? '#28a745' : '#666';
      statusSpan.title = status.state === 'error' ? (status.message || '') : '';
    }

    if (checkButton) {
      checkButton.disabled = ['checking', 'available', 'downloading'].includes(status.state);
    }

    if (status.state === 'downloaded') {
      showInstallBanner(status);
    }
  };

  checkButton?.addEventListener('click', () => {
    dismissedVersion = null;
    updater.check().then(render).catch(() => {});
  });

  updater.onStatus(render);
  updater.getStatus().then(render).catch(() => {});
})();
