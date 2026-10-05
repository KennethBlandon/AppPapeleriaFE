(() => {
  const form = document.getElementById('loginForm');
  const userInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');
  const submitBtn = document.getElementById('submitBtn');
  const serverInfo = document.getElementById('serverInfo');

  let hideTimer = null;

  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => errorMessage.classList.add('hidden'), 6000);
  };

  // Si ya hay una sesión válida, ir directo a la aplicación.
  if (window.appSession.isValid()) {
    window.location.replace('index.html');
    return;
  }

  if (serverInfo) {
    serverInfo.textContent = `Servidor: ${window.appApi.getBaseUrl()}`;
  }

  // Aviso temprano si la API no responde (no bloquea el formulario).
  window.appApi.getHealth().catch((error) => {
    showError(error.status === 503
      ? 'El servidor responde, pero la base de datos no está disponible.'
      : `No hay conexión con el servidor (${window.appApi.getBaseUrl()}).`);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const user = userInput.value.trim();
    const password = passwordInput.value;

    errorMessage.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-70', 'cursor-not-allowed');

    try {
      const session = await window.appApi.login(user, password);
      window.appSession.save({ token: session.token, user: session.user, expiresAt: session.expiresAt });
      window.location.replace('index.html');
    } catch (error) {
      passwordInput.value = '';
      showError(error.message || 'No fue posible iniciar sesión.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
  });
})();
