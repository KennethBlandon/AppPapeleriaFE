// Función global para mostrar alertas personalizadas con diseño
window.showAlert = function(message, type = 'error') {
  const alertId = 'custom-alert-modal-' + Date.now();
  const bgColor = type === 'error' ? '#ffdad6' : type === 'success' ? '#dff8d1' : '#fff3e0';
  const iconColor = type === 'error' ? '#ba1a1a' : type === 'success' ? '#2a6a05' : '#e65100';
  const icon = type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'warning';
  
  const modal = document.createElement('div');
  modal.id = alertId;
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 37, 66, 0.24);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    padding: 2rem;
    max-width: 28rem;
    width: 100%;
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  `;
  
  const iconDiv = document.createElement('div');
  iconDiv.style.cssText = `
    background: ${bgColor};
    color: ${iconColor};
    padding: 1rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
  `;
  iconDiv.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.5rem; font-weight: 700;">${icon}</span>`;
  
  const textDiv = document.createElement('div');
  textDiv.style.cssText = `
    flex: 1;
  `;
  
  const titleEl = document.createElement('h4');
  titleEl.style.cssText = `
    margin: 0 0 0.75rem;
    color: #002542;
    font-size: 1.05rem;
    font-weight: 700;
  `;
  titleEl.textContent = type === 'error' ? '⚠ Error' : type === 'success' ? '✓ Éxito' : 'Información';
  
  const msgEl = document.createElement('p');
  msgEl.style.cssText = `
    margin: 0;
    color: #43474d;
    font-size: 0.95rem;
    line-height: 1.5;
  `;
  msgEl.textContent = message;
  
  const buttonsDiv = document.createElement('div');
  buttonsDiv.style.cssText = `
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    justify-content: flex-end;
  `;
  
  const btn = document.createElement('button');
  btn.style.cssText = `
    padding: 0.55rem 1.5rem;
    background: #002542;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
  `;
  btn.textContent = 'Aceptar';
  btn.onmouseover = () => btn.style.background = '#1a4a6e';
  btn.onmouseout = () => btn.style.background = '#002542';
  btn.onclick = () => modal.remove();
  
  buttonsDiv.appendChild(btn);
  textDiv.appendChild(titleEl);
  textDiv.appendChild(msgEl);
  textDiv.appendChild(buttonsDiv);
  
  content.appendChild(iconDiv);
  content.appendChild(textDiv);
  modal.appendChild(content);
  
  document.body.appendChild(modal);
  
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
};

(() => {
  const root = document.getElementById('view-root');
  const title = document.getElementById('shell-title');
  const subtitle = document.getElementById('shell-subtitle');
  const routeButtons = Array.from(document.querySelectorAll('[data-route]'));
  const helpButton = document.getElementById('help-button');
  const helpModal = document.getElementById('help-modal');
  const helpClose = document.getElementById('help-close');
  
  const settingsButton = document.getElementById('settings-button');
  const settingsModal = document.getElementById('settings-modal');
  const settingsClose = document.getElementById('settings-close');
  const settingsCancel = document.getElementById('settings-cancel');
  const settingsSave = document.getElementById('settings-save');
  const retentionSlider = document.getElementById('retention-slider');
  const retentionDisplay = document.getElementById('retention-display');
  const ivaInput = document.getElementById('iva-input');
  const ivaDisplay = document.getElementById('iva-display');
  const dbStatusSpan = document.getElementById('db-status');
  const openDiscountManagerButton = document.getElementById('open-discount-manager');
  const discountModal = document.getElementById('discount-modal');
  const discountClose = document.getElementById('discount-close');
  const discountSave = document.getElementById('discount-save');
  const discountNameInput = document.getElementById('discount-name');
  const discountRateInput = document.getElementById('discount-rate');
  const discountList = document.getElementById('discount-list');

  window.appLiveRefresh = {
    // Live refresh deshabilitado: las vistas se actualizan por eventos explicitos.
    start() {
      return () => {};
    },
  };

  const getRoute = () => {
    const hash = (window.location.hash || '').replace('#', '').trim();
    if (hash === 'dashboard' || hash === 'inventario' || hash === 'facturacion' || hash === 'clientes' || hash === 'pedidos' || hash === 'contabilidad' || hash === 'reportes') {
      return hash;
    }
    return 'catalogo';
  };

  const setActiveNav = (route) => {
    routeButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.route === route);
    });
  };

  const navigate = (route) => {
    window.location.hash = route;
  };

  const render = () => {
    const route = getRoute();
    const view = route === 'dashboard'
      ? window.dashboardView
      : route === 'facturacion'
      ? window.invoiceView
      : route === 'clientes'
        ? window.clientsView
        : route === 'pedidos'
          ? window.ordersView
          : route === 'inventario'
            ? window.inventoryView
            : route === 'contabilidad'
              ? window.contabilidadView
              : route === 'reportes'
                ? window.reportesView
          : window.catalogView;

    root.innerHTML = view.render();
    title.textContent = view.title;
    subtitle.textContent = view.subtitle;
    setActiveNav(route);
    view.bind(root, navigate);
  };

  routeButtons.forEach((button) => {
    button.addEventListener('click', () => navigate(button.dataset.route));
  });

  const blurModalFocus = (modal) => {
    if (!modal) return;
    const activeElement = document.activeElement;
    if (activeElement && modal.contains(activeElement) && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
  };

  if (helpButton && helpModal && helpClose) {
    const closeHelp = () => {
      blurModalFocus(helpModal);
      helpModal.classList.remove('show');
      helpModal.setAttribute('aria-hidden', 'true');
    };

    const openHelp = () => {
      helpModal.classList.add('show');
      helpModal.setAttribute('aria-hidden', 'false');
    };

    helpButton.addEventListener('click', openHelp);

    helpClose.addEventListener('click', closeHelp);
    helpModal.addEventListener('click', (event) => {
      if (event.target === helpModal) {
        closeHelp();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeHelp();
      }
    });
  }

  // Cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.appSession.redirectToLogin();
    });
  }

  // Modal de Ajustes
  if (settingsButton && settingsModal) {
    const loadDiscounts = () => {
      try {
        const raw = localStorage.getItem('orderDiscounts');
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const saveDiscounts = (discounts) => {
      localStorage.setItem('orderDiscounts', JSON.stringify(discounts));
    };

    const renderDiscounts = () => {
      if (!discountList) return;
      const discounts = loadDiscounts();
      if (!discounts.length) {
        discountList.innerHTML = '<div class="field-input" style="color:#73777e;">Aún no hay descuentos creados.</div>';
        return;
      }

      discountList.innerHTML = discounts.map((discount) => `
        <div class="field-input" style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
          <span style="display:grid; gap:0.2rem;">
            <strong style="color:#002542;">${escapeHtml(discount.name)}</strong>
            <span style="color:#43474d; font-size:0.85rem;">${Number(discount.rate || 0).toFixed(2)}%</span>
          </span>
          <button class="icon-button" type="button" data-discount-delete="${escapeHtml(discount.id)}" aria-label="Eliminar descuento">
            <span class="material-symbols-outlined text-error">delete</span>
          </button>
        </div>
      `).join('');
    };

    const closeSettings = () => {
      blurModalFocus(settingsModal);
      settingsModal.classList.remove('show');
      settingsModal.setAttribute('aria-hidden', 'true');
    };

    const closeDiscountModal = () => {
      if (!discountModal) return;
      blurModalFocus(discountModal);
      discountModal.classList.remove('show');
      discountModal.setAttribute('aria-hidden', 'true');
    };

    // La API valida la contraseña contra el usuario de la sesión activa (no se envía el usuario).
    const verifySqlCredentials = async (password) => {
      await window.appApi.verifyPassword(password);
      return true;
    };

    const requestPasswordConfirmation = () => new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 37, 66, 0.24);
        backdrop-filter: blur(4px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      `;

      const card = document.createElement('div');
      card.style.cssText = `
        width: 100%;
        max-width: 26rem;
        background: #fff;
        border-radius: 0.75rem;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
        padding: 1.2rem;
        display: grid;
        gap: 0.8rem;
      `;

      const titleEl = document.createElement('h4');
      titleEl.textContent = 'Confirmar cambio de IVA';
      titleEl.style.cssText = 'margin:0; color:#002542; font-size:1rem; font-weight:700;';

      const descEl = document.createElement('p');
      descEl.textContent = 'Ingresa tu contraseña SQL para guardar este cambio.';
      descEl.style.cssText = 'margin:0; color:#43474d; font-size:0.92rem;';

      const input = document.createElement('input');
      input.type = 'password';
      input.placeholder = 'Contraseña SQL';
      input.autocomplete = 'current-password';
      input.style.cssText = `
        width: 100%;
        border: 1px solid #d5dde5;
        border-radius: 0.5rem;
        padding: 0.65rem 0.75rem;
        font-size: 0.95rem;
      `;

      const actions = document.createElement('div');
      actions.style.cssText = 'display:flex; justify-content:flex-end; gap:0.6rem; margin-top:0.2rem;';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.style.cssText = `
        border: 1px solid #c2c8d0;
        background: #fff;
        color: #43474d;
        border-radius: 0.5rem;
        padding: 0.5rem 0.95rem;
        cursor: pointer;
      `;

      const okBtn = document.createElement('button');
      okBtn.type = 'button';
      okBtn.textContent = 'Confirmar';
      okBtn.style.cssText = `
        border: 1px solid #002542;
        background: #002542;
        color: #fff;
        border-radius: 0.5rem;
        padding: 0.5rem 0.95rem;
        cursor: pointer;
        font-weight: 600;
      `;

      const closeModal = (value) => {
        overlay.remove();
        resolve(value);
      };

      cancelBtn.addEventListener('click', () => closeModal(null));
      okBtn.addEventListener('click', () => closeModal(input.value));
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          closeModal(input.value);
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          closeModal(null);
        }
      });
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeModal(null);
      });

      actions.appendChild(cancelBtn);
      actions.appendChild(okBtn);
      card.appendChild(titleEl);
      card.appendChild(descEl);
      card.appendChild(input);
      card.appendChild(actions);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      input.focus();
    });

    const openDiscountModal = () => {
      if (!discountModal) return;
      renderDiscounts();
      discountModal.classList.add('show');
      discountModal.setAttribute('aria-hidden', 'false');
    };

    const openSettings = () => {
      settingsModal.classList.add('show');
      settingsModal.setAttribute('aria-hidden', 'false');
      
      // Cargar retención actual desde localStorage
      const currentRetention = localStorage.getItem('retentionRate') || '0';
      retentionSlider.value = currentRetention;
      retentionDisplay.textContent = parseFloat(currentRetention).toFixed(1) + '%';
      
      // Cargar IVA actual desde localStorage
      const currentIva = localStorage.getItem('ivaRate') || '0';
      ivaInput.value = currentIva;
      ivaInput.max = '20';
      ivaDisplay.textContent = parseFloat(currentIva) + '%';
      
      const versionSpan = document.getElementById('app-version');
      const apiUrlSpan = document.getElementById('api-url');
      if (versionSpan) versionSpan.textContent = window.appConfig?.version || '-';
      if (apiUrlSpan) apiUrlSpan.textContent = window.appApi.getBaseUrl();

      // Verificar estado de BD
      testDatabaseConnection();
    };

    const testDatabaseConnection = async () => {
      try {
        dbStatusSpan.textContent = 'Verificando...';
        dbStatusSpan.style.color = '#666';
        const response = await fetch(`${window.appApi.getBaseUrl()}/api/health`);
        if (response.ok) {
          dbStatusSpan.textContent = '✓ Conectado';
          dbStatusSpan.style.color = '#28a745';
        } else {
          const data = await response.json();
          if (response.status === 503) {
            dbStatusSpan.textContent = '⚠ Servidor ok, BD no disponible';
            dbStatusSpan.style.color = '#ff9800';
          } else {
            dbStatusSpan.textContent = '✗ Error: ' + (data.error || 'Error desconocido');
            dbStatusSpan.style.color = '#d32f2f';
          }
        }
      } catch (err) {
        dbStatusSpan.textContent = '✗ No hay conexión';
        dbStatusSpan.style.color = '#d32f2f';
      }
    };

    // Slider de retención actualiza el display
    if (retentionSlider) {
      retentionSlider.addEventListener('input', () => {
        const value = parseFloat(retentionSlider.value).toFixed(1);
        retentionDisplay.textContent = value + '%';
      });
    }

    // Input de IVA actualiza el display
    if (ivaInput) {
      ivaInput.addEventListener('input', () => {
        let value = parseFloat(ivaInput.value || 0);
        if (!Number.isFinite(value) || value < 0) value = 0;
        if (value > 20) value = 20;
        ivaInput.value = String(value);
        ivaDisplay.textContent = value + '%';
      });
    }

    settingsButton.addEventListener('click', openSettings);
    
    if (settingsClose) {
      settingsClose.addEventListener('click', closeSettings);
    }
    
    if (settingsCancel) {
      settingsCancel.addEventListener('click', closeSettings);
    }

    openDiscountManagerButton?.addEventListener('click', openDiscountModal);
    discountClose?.addEventListener('click', closeDiscountModal);

    discountSave?.addEventListener('click', () => {
      const name = discountNameInput?.value?.trim() || '';
      const rate = Number(discountRateInput?.value || 0);

      if (!name) {
        alert('Debes indicar el nombre del descuento.');
        discountNameInput?.focus();
        return;
      }

      if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
        alert('El valor porcentual debe estar entre 0 y 100.');
        discountRateInput?.focus();
        return;
      }

      const discounts = loadDiscounts();
      discounts.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        rate,
      });
      saveDiscounts(discounts);
      if (discountNameInput) discountNameInput.value = '';
      if (discountRateInput) discountRateInput.value = '';
      renderDiscounts();
    });

    discountList?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-discount-delete]');
      if (!button) return;
      const id = button.getAttribute('data-discount-delete');
      if (!id) return;

      const updated = loadDiscounts().filter((item) => item.id !== id);
      saveDiscounts(updated);
      renderDiscounts();
    });

    if (settingsSave) {
      settingsSave.addEventListener('click', async () => {
        settingsSave.disabled = true;
        const retentionValue = parseFloat(retentionSlider.value).toFixed(2);
        const ivaValue = parseFloat(ivaInput.value || 0);
        const currentIvaValue = parseFloat(localStorage.getItem('ivaRate') || '0');
        
        if (!Number.isFinite(ivaValue) || ivaValue < 0 || ivaValue > 20) {
          alert('El IVA debe estar entre 0% y 20%.');
          ivaInput.focus();
          settingsSave.disabled = false;
          return;
        }

        if (ivaValue !== currentIvaValue) {
          const sqlUser = window.appSession.getUser();
          if (!sqlUser) {
            alert('No se encontró el usuario activo. Vuelve a iniciar sesión para modificar el IVA.');
            settingsSave.disabled = false;
            return;
          }

          const password = await requestPasswordConfirmation();
          if (password === null) {
            settingsSave.disabled = false;
            return;
          }

          if (!String(password).trim()) {
            alert('Debes ingresar la contraseña para cambiar el IVA.');
            settingsSave.disabled = false;
            return;
          }

          try {
            await verifySqlCredentials(password);
          } catch (error) {
            alert(error.message || 'Contraseña inválida. No se guardó el cambio de IVA.');
            settingsSave.disabled = false;
            return;
          }
        }
        
        localStorage.setItem('retentionRate', retentionValue);
        localStorage.setItem('ivaRate', ivaValue);
        
        // Notificar que fue guardado
        const originalText = settingsSave.textContent;
        settingsSave.textContent = '✓ Guardado';
        setTimeout(() => {
          settingsSave.textContent = originalText;
          settingsSave.disabled = false;
          closeSettings();
        }, 1500);
      });
    }

    settingsModal.addEventListener('click', (event) => {
      if (event.target === settingsModal) {
        closeSettings();
      }
    });

    discountModal?.addEventListener('click', (event) => {
      if (event.target === discountModal) {
        closeDiscountModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && settingsModal.classList.contains('show')) {
        closeSettings();
      }
      if (event.key === 'Escape' && discountModal?.classList.contains('show')) {
        closeDiscountModal();
      }
    });
  }

  // Sistema global de alertas de stock
  window.stockAlerts = [];
  
  const createStockAlertsUI = () => {
    const existing = document.getElementById('stock-alerts-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'stock-alerts-container';
    container.style.cssText = `
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 999;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    `;

    const badge = document.createElement('div');
    badge.id = 'stock-alerts-badge';
    badge.style.cssText = `
      background: #ba1a1a;
      color: white;
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(186, 26, 26, 0.3);
      transition: transform 0.2s;
    `;
    badge.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.3rem; font-weight: 700;">notifications</span>`;
    badge.title = 'Alertas de stock mínimo';

    const dropdown = document.createElement('div');
    dropdown.id = 'stock-alerts-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 3.2rem;
      right: 0;
      background: white;
      border: 1px solid #e6e8ea;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      max-width: 380px;
      width: 380px;
      max-height: 400px;
      overflow-y: auto;
      display: none;
      z-index: 1000;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 1rem;
      border-bottom: 1px solid #e6e8ea;
      background: #f5f7fa;
      font-weight: 600;
      color: #002542;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
    `;
    header.innerHTML = `
      <span>Productos con bajo stock</span>
      <button type="button" id="close-alerts-dropdown" style="background: none; border: none; cursor: pointer; color: #73777e; font-size: 1.2rem;">
        <span class="material-symbols-outlined">close</span>
      </button>
    `;

    const content = document.createElement('div');
    content.id = 'stock-alerts-content';

    dropdown.appendChild(header);
    dropdown.appendChild(content);

    badge.addEventListener('click', () => {
      const isOpen = dropdown.style.display === 'block';
      dropdown.style.display = isOpen ? 'none' : 'block';
    });

    dropdown.querySelector('#close-alerts-dropdown').addEventListener('click', () => {
      dropdown.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target) && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
      }
    });

    container.appendChild(badge);
    container.appendChild(dropdown);
    document.body.appendChild(container);
  };

  window.updateStockAlertsUI = () => {
    const alerts = window.stockAlerts || [];
    const container = document.getElementById('stock-alerts-container');
    
    if (!container) {
      createStockAlertsUI();
    }

    const badge = document.getElementById('stock-alerts-badge');
    const content = document.getElementById('stock-alerts-content');

    if (badge) {
      if (alerts.length > 0) {
        badge.style.display = 'flex';
        const countEl = badge.querySelector('span') || document.createElement('span');
        if (alerts.length <= 99) {
          countEl.style.display = 'none';
          badge.textContent = alerts.length;
        } else {
          countEl.style.display = 'flex';
          badge.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1.3rem; font-weight: 700;">notifications</span>`;
        }
      } else {
        badge.style.display = 'none';
      }
    }

    if (content) {
      if (alerts.length === 0) {
        content.innerHTML = '<div style="padding: 2rem 1rem; text-align: center; color: #73777e;">No hay alertas de stock.</div>';
      } else {
        content.innerHTML = alerts.map((alert) => `
          <div style="padding: 0.75rem 1rem; border-bottom: 1px solid #e6e8ea; display: grid; gap: 0.3rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <strong style="color: #002542; font-size: 0.9rem;">${escapeHtml(alert.CodigoProducto)}</strong>
              <span style="color: #ba1a1a; font-size: 0.8rem; font-weight: 600;">⚠ Bajo stock</span>
            </div>
            <div style="color: #43474d; font-size: 0.85rem;">
              ${escapeHtml(alert.NombreProducto)}
            </div>
            <div style="color: #73777e; font-size: 0.8rem; display: flex; gap: 1rem;">
              <span>Stock: <strong>${Number(alert.Existencia)}</strong></span>
              <span>Mínimo: <strong>${Number(alert.StockMinimo)}</strong></span>
              <span style="color: #ba1a1a; font-weight: 600;">Falta: <strong>${Number(alert.StockMinimo) - Number(alert.Existencia)}</strong></span>
            </div>
          </div>
        `).join('');
      }
    }
  };

  // Inicializar UI de alertas
  createStockAlertsUI();

  window.addEventListener('hashchange', render);
  if (!window.location.hash) {
    window.location.hash = 'dashboard';
  }
  render();
})();
