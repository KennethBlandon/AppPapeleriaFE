// Utilidades compartidas por todos los módulos de la interfaz.
(() => {
  // Escapa texto antes de interpolarlo en plantillas HTML (innerHTML) para evitar XSS.
  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  window.escapeHtml = escapeHtml;
  window.appUtils = Object.freeze({ escapeHtml });
})();
