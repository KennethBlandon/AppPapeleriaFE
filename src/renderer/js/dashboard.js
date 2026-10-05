window.dashboardView = {
  title: 'Papeleria Industrial',
  subtitle: 'Resumen ejecutivo de ventas, inventario y operaciones diarias.',
  render() {
    return `
      <div class="view-wrap dashboard-view">
        <div style="display:grid; gap:2rem;">
          <section class="dashboard-stats">
            <div class="catalog-card dashboard-main-kpi" style="padding:1.5rem; min-height:13.5rem; background:#002542; color:#fff; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.18em; color:rgba(255,255,255,0.65);">Ingresos del Día</span>
                <h3 style="margin:0.5rem 0 0; font-size:clamp(2.5rem, 6vw, 3.5rem); font-weight:900;">--</h3>
              </div>
              <div style="position:absolute; right:-20px; bottom:-20px; width:15rem; height:15rem; background:#1b3b5a; opacity:0.35; border-radius:9999px; filter:blur(48px);"></div>
            </div>

            <div class="catalog-card" style="padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; min-height:13.5rem;">
              <div>
                <div style="width:2.5rem; height:2.5rem; border-radius:0.75rem; background:#ffdad6; color:#ba1a1a; display:grid; place-items:center; margin-bottom:1rem;">
                  <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">warning</span>
                </div>
                <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Bajo Stock</span>
                <p style="margin:0.35rem 0 0; font-size:2rem; font-weight:900; color:#191c1e;">0 Items</p>
              </div>
              <button id="go-inventario" class="ghost-button" type="button" style="padding:0; text-align:left; color:#002542; font-weight:800;">Revisar inventario →</button>
            </div>

            <div class="catalog-card" style="padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; min-height:13.5rem;">
              <div>
                <div style="width:2.5rem; height:2.5rem; border-radius:0.75rem; background:#cfe6f2; color:#4c616c; display:grid; place-items:center; margin-bottom:1rem;">
                  <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">local_shipping</span>
                </div>
                <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Pedidos Pendientes</span>
                <p style="margin:0.35rem 0 0; font-size:2rem; font-weight:900; color:#191c1e;">0</p>
              </div>
            </div>

          </section>

          <div style="display:grid; grid-template-columns:minmax(0, 2fr) minmax(0, 1fr); gap:1.5rem; align-items:start;">
            <section class="catalog-card" style="padding:1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:end; gap:1rem; margin-bottom:1rem;">
                <div>
                  <h4 style="margin:0; font-size:1.35rem; color:#002542;">Pedidos Recientes</h4>
                  <p style="margin:0.25rem 0 0; color:#43474d;">Seguimiento de las últimas transacciones en tiempo real.</p>
                </div>
                <button id="open-pending-orders" class="ghost-button" type="button" style="font-weight:800; color:#002542;">Ver todo</button>
              </div>
              <div class="table-wrap">
                <table class="invoice-table">
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                      <th style="text-align:right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colspan="4" style="text-align:center; color:#73777e;">Sin pedidos cargados.</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <aside style="display:grid; gap:1.5rem;">
              <section class="catalog-card" style="padding:1.25rem;">
                <h4 style="margin:0 0 1rem; font-size:1.05rem; color:#002542;">Acciones Rápidas</h4>
                <div style="display:grid; gap:0.75rem;">
                  <button id="go-pedidos" class="catalog-card" type="button" style="padding:0.9rem; box-shadow:none; background:#ffffff; border:1px solid rgba(195,198,206,0.35); display:flex; justify-content:space-between; align-items:center; gap:1rem;">
                    <span style="display:flex; align-items:center; gap:0.75rem; text-align:left;">
                      <span style="width:2.5rem; height:2.5rem; border-radius:0.75rem; background:#d1e4ff; color:#002542; display:grid; place-items:center; flex-shrink:0;">
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                      </span>
                      <span style="display:grid;">
                        <strong style="color:#191c1e;">Nuevo Pedido</strong>
                        <span style="font-size:0.72rem; color:#43474d;">Crear venta directa</span>
                      </span>
                    </span>
                    <span class="material-symbols-outlined" style="color:#73777e;">chevron_right</span>
                  </button>
                  <button id="go-clientes-quick" class="catalog-card" type="button" style="padding:0.9rem; box-shadow:none; background:#ffffff; border:1px solid rgba(195,198,206,0.35); display:flex; justify-content:space-between; align-items:center; gap:1rem;">
                    <span style="display:flex; align-items:center; gap:0.75rem; text-align:left;">
                      <span style="width:2.5rem; height:2.5rem; border-radius:0.75rem; background:#d1e4ff; color:#002542; display:grid; place-items:center; flex-shrink:0;">
                        <span class="material-symbols-outlined">person_add</span>
                      </span>
                      <span style="display:grid;">
                        <strong style="color:#191c1e;">Alta de Cliente</strong>
                        <span style="font-size:0.72rem; color:#43474d;">Registrar en base de datos</span>
                      </span>
                    </span>
                    <span class="material-symbols-outlined" style="color:#73777e;">chevron_right</span>
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <div id="pending-orders-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:65; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card" style="width:100%; max-width:56rem; max-height:85vh; display:grid; grid-template-rows:auto 1fr auto; overflow:hidden;">
            <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e6e8ea; display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.3rem; color:#002542;">Pedidos Pendientes</h4>
                <p style="margin:0.3rem 0 0; color:#43474d;">Listado completo para seguimiento operativo y generación de reportes.</p>
              </div>
              <button id="close-pending-orders" class="icon-button" type="button" aria-label="Cerrar ventana de pedidos pendientes">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style="padding:1rem 1.5rem; overflow:auto;">
              <div class="table-wrap">
                <table class="invoice-table" id="pending-orders-report">
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th style="text-align:right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colspan="5" style="text-align:center; color:#73777e;">Sin pedidos pendientes cargados.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style="padding:1rem 1.5rem; border-top:1px solid #e6e8ea; background:#f2f4f6; display:flex; justify-content:flex-end; gap:0.65rem;">
              <button id="print-pending-report" class="cta-button" type="button" style="display:flex; align-items:center; gap:0.4rem;">
                <span class="material-symbols-outlined">print</span>
                Reportes
              </button>
              <button id="close-pending-orders-footer" class="ghost-button" type="button">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  bind(root, navigate) {
    const api = window.appApi;
    const formatMoney = (value) => `C$${Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const mainKpi = root.querySelector('.dashboard-main-kpi h3');
    const statCards = Array.from(root.querySelectorAll('section.dashboard-stats .catalog-card'));
    const lowStockCard = statCards[1];
    const pendingCard = statCards[2];
    const recentOrdersBody = root.querySelector('.invoice-table tbody');
    const pendingOrdersBody = root.querySelector('#pending-orders-report tbody');

    const renderRows = (rows, emptyMessage, cells) => {
      if (!rows || rows.length === 0) {
        return emptyMessage;
      }

      return rows.map(cells).join('');
    };

    const refreshSummary = async () => {
      if (!root.isConnected) return;
      if (!api?.getDashboardSummary) {
        return;
      }

      try {
        const summary = await api.getDashboardSummary();

        if (mainKpi) {
          mainKpi.textContent = formatMoney(summary.totalIngresosHoy);
        }

        if (lowStockCard) {
          const value = lowStockCard.querySelector('p');
          if (value) value.textContent = `${summary.bajoStock || 0} Items`;
        }

        if (pendingCard) {
          const value = pendingCard.querySelector('p');
          if (value) value.textContent = String(summary.pedidosPendientes || 0);
        }

        if (recentOrdersBody) {
          recentOrdersBody.innerHTML = renderRows(summary.pedidosRecientes, '<tr><td colspan="4" style="text-align:center; color:#73777e;">Sin pedidos cargados.</td></tr>', (order) => `
            <tr>
              <td>#${order.PedidoID}</td>
              <td>${escapeHtml(order.NombreCliente || 'Cliente')}</td>
              <td>${order.Estado || 'Pendiente'}</td>
              <td style="text-align:right;">${formatMoney(order.Total)}</td>
            </tr>
          `);
        }

        if (pendingOrdersBody) {
          const pendingOnly = (summary.pedidosRecientes || []).filter((order) => (order.Estado || 'Pendiente') === 'Pendiente');
          pendingOrdersBody.innerHTML = renderRows(pendingOnly, '<tr><td colspan="5" style="text-align:center; color:#73777e;">Sin pedidos pendientes cargados.</td></tr>', (order) => `
            <tr>
              <td>#${order.PedidoID}</td>
              <td>${escapeHtml(order.NombreCliente || 'Cliente')}</td>
              <td>${order.Estado || 'Pendiente'}</td>
              <td>${new Date(order.FechaEmision).toLocaleDateString('es-ES')}</td>
              <td style="text-align:right;">${formatMoney(order.Total)}</td>
            </tr>
          `);
        }

      } catch (error) {
        console.error(error);
      }
    };

    refreshSummary();

    root.querySelector('#go-inventario')?.addEventListener('click', () => {
      if (typeof navigate === 'function') {
        navigate('inventario');
      }
    });

    root.querySelector('#go-pedidos')?.addEventListener('click', () => {
      if (typeof navigate === 'function') {
        navigate('pedidos');
      }
    });

    root.querySelector('#go-clientes-quick')?.addEventListener('click', () => {
      if (typeof navigate === 'function') {
        navigate('clientes');
      }
    });

    const modal = root.querySelector('#pending-orders-modal');
    const openModal = root.querySelector('#open-pending-orders');
    const closeModalButtons = [
      root.querySelector('#close-pending-orders'),
      root.querySelector('#close-pending-orders-footer')
    ].filter(Boolean);

    const showModal = () => {
      if (!modal) return;
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      modal.setAttribute('aria-hidden', 'false');
    };

    const hideModal = () => {
      if (!modal) return;
      const activeElement = document.activeElement;
      if (activeElement && modal.contains(activeElement) && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.setAttribute('aria-hidden', 'true');
    };

    openModal?.addEventListener('click', showModal);
    closeModalButtons.forEach((button) => button.addEventListener('click', hideModal));
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) {
        hideModal();
      }
    });

    root.querySelector('#print-pending-report')?.addEventListener('click', () => {
      window.print();
    });

    root.querySelectorAll('button[type="button"]').forEach((button) => {
      button.addEventListener('click', () => {
        button.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 180 });
      });
    });
  }
};