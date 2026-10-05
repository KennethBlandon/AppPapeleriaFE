// Sesión del usuario: token emitido por la API (AppPapeleriaBE).
// Se guarda en sessionStorage para que se pierda al cerrar la aplicación.
(() => {
  const KEYS = { token: 'authToken', user: 'authUser', expiresAt: 'authExpiresAt' };

  const read = (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const save = ({ token, user, expiresAt }) => {
    sessionStorage.setItem(KEYS.token, token);
    sessionStorage.setItem(KEYS.user, user);
    sessionStorage.setItem(KEYS.expiresAt, String(expiresAt || 0));
  };

  const clear = () => {
    Object.values(KEYS).forEach((key) => sessionStorage.removeItem(key));
    // Limpieza de claves de la versión anterior (sesión falsa en localStorage).
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
  };

  const isValid = () => {
    const token = read(KEYS.token);
    const expiresAt = Number(read(KEYS.expiresAt) || 0);
    return Boolean(token) && expiresAt > Date.now();
  };

  const redirectToLogin = () => {
    clear();
    if (!/login\.html$/i.test(window.location.pathname)) {
      window.location.replace('login.html');
    }
  };

  window.appSession = {
    save,
    clear,
    isValid,
    redirectToLogin,
    getToken: () => read(KEYS.token),
    getUser: () => read(KEYS.user) || '',
  };
})();
