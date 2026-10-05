// Debe cargarse antes que cualquier otro módulo de la vista principal.
if (!window.appSession.isValid()) {
  window.appSession.redirectToLogin();
}
