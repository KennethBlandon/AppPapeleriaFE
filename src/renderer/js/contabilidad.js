window.contabilidadView = {
  title: 'Contabilidad',
  subtitle: 'Estado de cuenta de clientes y cuentas por cobrar.',
  render() {
    return `
      <div class="view-wrap contabilidad-view">
        <div class="no-print" style="display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; margin-bottom:1.5rem; flex-wrap:nowrap;">
          <div>
            <span class="eyebrow">Análisis Financiero</span>
            <h3 id="accounting-title" style="margin:0.25rem 0 0; font-size:2rem; color:#002542;">Estado de Cuenta de Clientes</h3>
            <p id="accounting-subtitle" style="margin:0.4rem 0 0; color:#43474d; max-width:46rem;">Resumen de pedidos, facturas y balance general por cliente.</p>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:nowrap; align-items:center; justify-content:flex-end; white-space:nowrap; flex-shrink:0;">
            <button id="export-accounting" class="cta-button" type="button" style="white-space:nowrap;"><span class="material-symbols-outlined">download</span><span>Exportar Excel</span></button>
            <button id="view-clients-btn" class="secondary-btn accounting-view-btn active" type="button" data-accounting-view="clientes" style="white-space:nowrap;">Estado de cuenta de clientes</button>
            <button id="view-receivables-btn" class="secondary-btn accounting-view-btn" type="button" data-accounting-view="cxc" style="white-space:nowrap;">Cuentas por cobrar</button>
          </div>
        </div>

        <div id="clients-view">
          <div class="catalog-layout">
            <div class="catalog-main">
              <div class="catalog-card">
                <div style="padding:1rem 1.15rem 0.5rem; display:grid; gap:0.9rem;">
                  <div class="grid-2" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
                    <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                      <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Total Clientes</p>
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                        <strong id="accounting-total-clients" style="font-size:2rem; color:#002542;">0</strong>
                        <span class="material-symbols-outlined" style="color:#002542; background:#cfe6f2; padding:0.55rem; border-radius:0.75rem;">groups</span>
                      </div>
                    </div>
                    <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                      <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Monto Facturado</p>
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                        <strong id="accounting-total-billed" style="font-size:2rem; color:#002542;">C$0.00</strong>
                        <span class="material-symbols-outlined" style="color:#002a05; background:#a3f69c; padding:0.55rem; border-radius:0.75rem;">trending_up</span>
                      </div>
                    </div>
                    <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                      <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Total Pedidos</p>
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                        <strong id="accounting-total-orders" style="font-size:2rem; color:#002542;">0</strong>
                        <span class="material-symbols-outlined" style="color:#002542; background:#d1e4ff; padding:0.55rem; border-radius:0.75rem;">shopping_cart</span>
                      </div>
                    </div>
                  </div>

                  <div class="search-row no-print">
                    <input id="accounting-search" class="search-input" type="search" placeholder="Buscar cliente..." />
                  </div>
                </div>

                <div class="table-wrap">
                  <table class="catalog-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th style="text-align:center;">Pedidos</th>
                        <th style="text-align:center;">Facturas</th>
                        <th style="text-align:right;">Monto Facturado</th>
                        <th style="text-align:right;">Subtotal</th>
                        <th style="text-align:right;">Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="accounting-rows"></tbody>
                  </table>
                </div>

                <div class="catalog-footer">
                  <span id="accounting-count">Mostrando 0 de 0 clientes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="receivables-view" style="display:none;">
          <div class="catalog-layout">
            <div class="catalog-main">
              <div class="catalog-card">
                <div style="padding:1rem 1.15rem 0.5rem; display:grid; gap:0.9rem;">
                  <div class="grid-2" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
                    <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                      <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">CxC Activas</p>
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                        <strong id="receivables-total-count" style="font-size:2rem; color:#002542;">0</strong>
                        <span class="material-symbols-outlined" style="color:#002542; background:#d1e4ff; padding:0.55rem; border-radius:0.75rem;">account_balance_wallet</span>
                      </div>
                    </div>
                    <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                      <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Saldo Pendiente</p>
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                        <strong id="receivables-total-balance" style="font-size:2rem; color:#ba1a1a;">C$0.00</strong>
                        <span class="material-symbols-outlined" style="color:#ba1a1a; background:#ffdad6; padding:0.55rem; border-radius:0.75rem;">schedule</span>
                      </div>
                    </div>
                    <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                      <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Monto Original</p>
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                        <strong id="receivables-total-original" style="font-size:2rem; color:#002542;">C$0.00</strong>
                        <span class="material-symbols-outlined" style="color:#002542; background:#cfe6f2; padding:0.55rem; border-radius:0.75rem;">request_quote</span>
                      </div>
                    </div>
                  </div>

                  <div class="search-row no-print">
                    <input id="receivables-search" class="search-input" type="search" placeholder="Buscar cuenta por cliente, factura o cuenta..." />
                  </div>
                </div>

                <div class="table-wrap">
                  <table class="catalog-table">
                    <thead>
                      <tr>
                        <th>Cuenta</th>
                        <th>Cliente</th>
                        <th>Factura</th>
                        <th style="text-align:right;">Monto Original</th>
                        <th style="text-align:right;">Saldo Pendiente</th>
                        <th style="text-align:right;">Fecha</th>
                        <th style="text-align:right;">Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="receivables-rows"></tbody>
                  </table>
                </div>

                <div class="catalog-footer">
                  <span id="receivables-count">Mostrando 0 de 0 cuentas</span>
                </div>
              </div>
            </div>
          </div>

          <div class="catalog-card" style="margin-top:1.25rem;">
            <div style="padding:1rem 1.15rem 0.5rem; display:grid; gap:0.9rem;">
              <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; flex-wrap:wrap;">
                <div>
                  <span class="eyebrow">Historial financiero</span>
                  <h4 style="margin:0.25rem 0 0; color:#002542; font-size:1.35rem;">CxC pagadas</h4>
                  <p style="margin:0.35rem 0 0; color:#43474d;">Cuentas por cobrar ya canceladas con acceso al historial de transacciones.</p>
                </div>
                <div class="search-row no-print" style="min-width:min(100%, 28rem); flex:1; max-width:32rem;">
                  <input id="receivables-history-search" class="search-input" type="search" placeholder="Buscar cuenta pagada, cliente o factura..." />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:0.9rem;">
                <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                  <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">CxC pagadas</p>
                  <strong id="receivables-history-total-count" style="font-size:2rem; color:#002542;">0</strong>
                </div>
                <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                  <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Monto cancelado</p>
                  <strong id="receivables-history-total-paid" style="font-size:2rem; color:#002542;">C$0.00</strong>
                </div>
              </div>
            </div>

            <div class="table-wrap">
              <table class="catalog-table">
                <thead>
                  <tr>
                    <th>Cuenta</th>
                    <th>Cliente</th>
                    <th>Factura</th>
                    <th style="text-align:right;">Monto Original</th>
                    <th style="text-align:right;">Total Abonado</th>
                    <th style="text-align:right;">Último Abono</th>
                    <th style="text-align:right;">Acciones</th>
                  </tr>
                </thead>
                <tbody id="receivables-history-rows"></tbody>
              </table>
            </div>

            <div class="catalog-footer">
              <span id="receivables-history-count">Mostrando 0 de 0 cuentas pagadas</span>
            </div>
          </div>
        </div>

        <div id="statement-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:65; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card side-panel" style="width:100%; max-width:56rem; max-height:88vh; overflow:auto; position:static;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:1.5rem;">
              <div>
                <h4 id="statement-client-name">Cliente</h4>
                <p id="statement-client-id" style="color:#43474d; font-size:0.9rem;">Cédula: --</p>
              </div>
              <button id="close-statement-modal" class="round-button" type="button" aria-label="Cerrar estado de cuenta"><span class="material-symbols-outlined">close</span></button>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                <p style="margin:0 0 0.5rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Total Pedidos</p>
                <strong id="statement-total-orders" style="font-size:1.5rem; color:#002542;">0</strong>
              </div>
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                <p style="margin:0 0 0.5rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Total Facturas</p>
                <strong id="statement-total-invoices" style="font-size:1.5rem; color:#002542;">0</strong>
              </div>
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                <p style="margin:0 0 0.5rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Monto Facturado</p>
                <strong id="statement-total-billed" style="font-size:1.5rem; color:#002542;">C$0.00</strong>
              </div>
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffdad6;">
                <p style="margin:0 0 0.5rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Monto Pendiente</p>
                <strong id="statement-pending-amount" style="font-size:1.5rem; color:#ba1a1a;">C$0.00</strong>
              </div>
            </div>

            <div style="margin-bottom:1.5rem;">
              <h5 style="margin:0 0 1rem; color:#002542;">Historial de Pedidos</h5>
              <div id="statement-orders-list" style="display:grid; gap:0.75rem; max-height:400px; overflow-y:auto;"></div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
              <button id="statement-cancel" class="secondary-btn" type="button">Cerrar</button>
            </div>
          </div>
        </div>

        <div id="orders-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:65; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card side-panel" style="width:100%; max-width:64rem; max-height:88vh; overflow:auto; position:static; display:grid; grid-template-rows:auto 1fr auto; gap:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem;">
              <div>
                <span class="eyebrow">Pedidos del Cliente</span>
                <h4 id="orders-client-name" style="margin:0.25rem 0 0;">Cliente</h4>
                <p id="orders-client-id" style="color:#43474d; font-size:0.9rem; margin:0.25rem 0 0;">Cédula: --</p>
              </div>
              <button id="close-orders-modal" class="round-button" type="button" aria-label="Cerrar pedidos"><span class="material-symbols-outlined">close</span></button>
            </div>

            <div style="display:grid; gap:1rem; overflow-y:auto;">
              <div id="orders-list" style="display:grid; gap:0.75rem;"></div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid #e0e3e5; padding-top:1rem;">
              <button id="orders-cancel" class="secondary-btn" type="button">Cerrar</button>
            </div>
          </div>
        </div>

        <div id="receivable-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:70; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card side-panel" style="width:100%; max-width:64rem; max-height:90vh; overflow:auto; position:static; display:grid; grid-template-rows:auto 1fr auto; gap:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem;">
              <div>
                <span class="eyebrow">Cuentas por cobrar</span>
                <h4 id="receivable-account-name" style="margin:0.25rem 0 0;">Cuenta por cobrar</h4>
                <p id="receivable-account-meta" style="color:#43474d; font-size:0.9rem; margin:0.25rem 0 0;">Factura --</p>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <button id="export-receivable-detail" class="secondary-btn" type="button" style="display:inline-flex; align-items:center; gap:0.4rem; height:2.6rem;">
                  <span class="material-symbols-outlined" style="font-size:1.1rem;">download</span>
                  Exportar Excel
                </button>
                <button id="close-receivable-modal" class="round-button" type="button" aria-label="Cerrar cuenta por cobrar"><span class="material-symbols-outlined">close</span></button>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem;">
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                <p style="margin:0 0 0.35rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Monto original</p>
                <strong id="receivable-original-amount" style="font-size:1.5rem; color:#002542;">C$0.00</strong>
              </div>
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffdad6;">
                <p style="margin:0 0 0.35rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Saldo pendiente</p>
                <strong id="receivable-balance-amount" style="font-size:1.5rem; color:#ba1a1a;">C$0.00</strong>
              </div>
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                <p style="margin:0 0 0.35rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Total abonado</p>
                <strong id="receivable-total-paid" style="font-size:1.5rem; color:#002542;">C$0.00</strong>
              </div>
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                <p style="margin:0 0 0.35rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Fecha creación</p>
                <strong id="receivable-created-at" style="font-size:1.2rem; color:#002542;">--</strong>
              </div>
            </div>

            <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff; border:1px solid #e6e8ea;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem; margin-bottom:0.75rem; flex-wrap:wrap;">
                <h5 style="margin:0; color:#002542;">Registrar abono</h5>
                <span id="receivable-state" class="chip" style="display:inline-flex;">Activo</span>
              </div>
              <div style="display:grid; grid-template-columns:minmax(0, 1fr) auto; gap:0.75rem; align-items:end;">
                <div class="field-group" style="margin:0;">
                  <label>Monto a abonar</label>
                  <input id="receivable-payment-amount" class="field-input" type="number" min="0.01" step="0.01" placeholder="0.00" />
                </div>
                <button id="receivable-payment-submit" class="cta-button" type="button" style="height:3rem;">Registrar abono</button>
              </div>
            </div>

            <div>
              <h5 style="margin:0 0 1rem; color:#002542;">Historial de abonos</h5>
              <div id="receivable-history-list" style="display:grid; gap:0.75rem; max-height:280px; overflow-y:auto;"></div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid #e0e3e5; padding-top:1rem;">
              <button id="receivable-close" class="secondary-btn" type="button">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  bind(root) {
    const api = window.appApi;
    const normalizePaymentType = (value) => {
      const normalized = String(value || '').trim().toLowerCase();
      return normalized === 'credito' || normalized === 'crédito' ? 'Credito' : 'Contado';
    };
    const formatMoney = (value) => `C$${Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatDate = (value) => {
      if (!value) return '--';
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '--' : date.toLocaleDateString('es-ES');
    };

    let allClients = [];
    let allReceivables = [];
    let allReceivableHistory = [];
    let activeView = 'clientes';
    let selectedReceivable = null;

    const showModal = (modal) => {
      if (!modal) return;
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      modal.setAttribute('aria-hidden', 'false');
    };

    const hideModal = (modal) => {
      if (!modal) return;
      const activeElement = document.activeElement;
      if (activeElement && modal.contains(activeElement) && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.setAttribute('aria-hidden', 'true');
    };

    const setText = (selector, value) => {
      const element = root.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };

    const setActiveView = (view) => {
      activeView = view;
      const clientsView = root.querySelector('#clients-view');
      const receivablesView = root.querySelector('#receivables-view');
      const title = root.querySelector('#accounting-title');
      const subtitle = root.querySelector('#accounting-subtitle');

      if (clientsView) clientsView.style.display = view === 'clientes' ? '' : 'none';
      if (receivablesView) receivablesView.style.display = view === 'cxc' ? '' : 'none';
      if (title) title.textContent = view === 'clientes' ? 'Estado de Cuenta de Clientes' : 'Cuentas por Cobrar';
      if (subtitle) {
        subtitle.textContent = view === 'clientes'
          ? 'Resumen de pedidos, facturas y balance general por cliente.'
          : 'Cuentas activas con saldo pendiente, historial de pagos y abonos registrados.';
      }

      root.querySelectorAll('.accounting-view-btn').forEach((button) => {
        const isActive = button.dataset.accountingView === view;
        button.classList.toggle('active', isActive);
        button.style.background = isActive ? '#002542' : 'transparent';
        button.style.color = isActive ? '#ffffff' : '#002542';
      });
    };

    const applyClientFilter = () => {
      const rows = Array.from(root.querySelectorAll('#accounting-rows tr'));
      const term = (root.querySelector('#accounting-search')?.value || '').trim().toLowerCase();
      let visible = 0;

      rows.forEach((row) => {
        const text = (row.textContent || '').toLowerCase();
        const show = !term || text.includes(term);
        row.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });

      const counter = root.querySelector('#accounting-count');
      if (counter) counter.textContent = `Mostrando ${visible} de ${allClients.length} clientes`;
    };

    const applyReceivableFilter = () => {
      const rows = Array.from(root.querySelectorAll('#receivables-rows tr'));
      const term = (root.querySelector('#receivables-search')?.value || '').trim().toLowerCase();
      let visible = 0;

      rows.forEach((row) => {
        const text = (row.textContent || '').toLowerCase();
        const show = !term || text.includes(term);
        row.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });

      const counter = root.querySelector('#receivables-count');
      if (counter) counter.textContent = `Mostrando ${visible} de ${allReceivables.length} cuentas`;
    };

    const applyReceivableHistoryFilter = () => {
      const rows = Array.from(root.querySelectorAll('#receivables-history-rows tr'));
      const term = (root.querySelector('#receivables-history-search')?.value || '').trim().toLowerCase();
      let visible = 0;

      rows.forEach((row) => {
        const text = (row.textContent || '').toLowerCase();
        const show = !term || text.includes(term);
        row.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });

      const counter = root.querySelector('#receivables-history-count');
      if (counter) counter.textContent = `Mostrando ${visible} de ${allReceivableHistory.length} cuentas pagadas`;
    };

    const renderClients = async () => {
      try {
        const result = await api.request('/api/contabilidad/clientes-balance');
        allClients = Array.isArray(result) ? result : [];

        const rowsHost = root.querySelector('#accounting-rows');
        if (!rowsHost) return;

        if (allClients.length === 0) {
          rowsHost.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#73777e;">Sin clientes registrados.</td></tr>';
          const counter = root.querySelector('#accounting-count');
          if (counter) counter.textContent = 'Mostrando 0 de 0 clientes';
          return;
        }

        rowsHost.innerHTML = allClients.map((client) => `
          <tr style="cursor:pointer;" data-client-id="${client.ClienteID}">
            <td>
              <div style="display:grid; gap:0.15rem;">
                <strong style="color:#002542;">${escapeHtml(client.NombreCliente || 'Sin nombre')}</strong>
                <span style="color:#43474d; font-size:0.75rem;">${escapeHtml(client.Cedula || 'Sin cédula')}</span>
              </div>
            </td>
            <td style="text-align:center;"><strong>${client.TotalPedidos || 0}</strong></td>
            <td style="text-align:center;"><strong>${client.TotalFacturas || 0}</strong></td>
            <td style="text-align:right;"><strong>${formatMoney(client.MontoFacturado || 0)}</strong></td>
            <td style="text-align:right;">${formatMoney(client.SubtotalFacturas || 0)}</td>
            <td style="text-align:right;">
              <button class="icon-button view-orders" type="button" data-client-id="${client.ClienteID}" aria-label="Ver pedidos del cliente">
                <span class="material-symbols-outlined">shopping_cart</span>
              </button>
            </td>
          </tr>
        `).join('');

        const counter = root.querySelector('#accounting-count');
        if (counter) counter.textContent = `Mostrando ${allClients.length} de ${allClients.length} clientes`;

        const totalMontoFacturado = allClients.reduce((sum, client) => sum + Number(client.MontoFacturado || 0), 0);
        const totalPedidos = allClients.reduce((sum, client) => sum + Number(client.TotalPedidos || 0), 0);

        const totalClientsKPI = root.querySelector('#accounting-total-clients');
        if (totalClientsKPI) totalClientsKPI.textContent = String(allClients.length);

        const totalBilledKPI = root.querySelector('#accounting-total-billed');
        if (totalBilledKPI) totalBilledKPI.textContent = formatMoney(totalMontoFacturado);

        const totalOrdersKPI = root.querySelector('#accounting-total-orders');
        if (totalOrdersKPI) totalOrdersKPI.textContent = String(totalPedidos);

        applyClientFilter();
      } catch (error) {
        console.error('[Contabilidad] Error loading clients:', error);
      }
    };

    const renderReceivables = async () => {
      try {
        const result = await api.listReceivables();
        allReceivables = Array.isArray(result) ? result : [];

        const rowsHost = root.querySelector('#receivables-rows');
        if (!rowsHost) return;

        if (allReceivables.length === 0) {
          rowsHost.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#73777e;">No hay cuentas por cobrar activas.</td></tr>';
          const counter = root.querySelector('#receivables-count');
          if (counter) counter.textContent = 'Mostrando 0 de 0 cuentas';
          return;
        }

        rowsHost.innerHTML = allReceivables.map((account) => `
          <tr>
            <td><strong style="color:#002542;">${escapeHtml(account.NombreCuenta || `CxC-${account.CxCID}`)}</strong></td>
            <td>
              <div style="display:grid; gap:0.15rem;">
                <strong style="color:#002542;">${escapeHtml(account.NombreCliente || 'Sin nombre')}</strong>
                <span style="color:#43474d; font-size:0.75rem;">${escapeHtml(account.Cedula || 'Sin cédula')}</span>
              </div>
            </td>
            <td>${account.FacturaID ? `#${account.FacturaID}` : '--'}</td>
            <td style="text-align:right; font-weight:700;">${formatMoney(account.MontoOriginal || 0)}</td>
            <td style="text-align:right; font-weight:700; color:#ba1a1a;">${formatMoney(account.SaldoPendiente || 0)}</td>
            <td style="text-align:right;">${formatDate(account.FechaCreacion)}</td>
            <td style="text-align:right;">
              <button class="icon-button receivable-pay" type="button" data-cxid="${account.CxCID}" aria-label="Abonar a la cuenta por cobrar">
                <span class="material-symbols-outlined">payments</span>
              </button>
            </td>
          </tr>
        `).join('');

        const totalCountKPI = root.querySelector('#receivables-total-count');
        if (totalCountKPI) totalCountKPI.textContent = String(allReceivables.length);

        const totalBalanceKPI = root.querySelector('#receivables-total-balance');
        if (totalBalanceKPI) totalBalanceKPI.textContent = formatMoney(allReceivables.reduce((sum, account) => sum + Number(account.SaldoPendiente || 0), 0));

        const totalOriginalKPI = root.querySelector('#receivables-total-original');
        if (totalOriginalKPI) totalOriginalKPI.textContent = formatMoney(allReceivables.reduce((sum, account) => sum + Number(account.MontoOriginal || 0), 0));

        const receivablesCount = root.querySelector('#receivables-count');
        if (receivablesCount) receivablesCount.textContent = `Mostrando ${allReceivables.length} de ${allReceivables.length} cuentas`;

        applyReceivableFilter();
      } catch (error) {
        console.error('[Contabilidad] Error loading receivables:', error);
      }
    };

    const renderReceivableHistory = async () => {
      try {
        const result = await api.listReceivablesHistory();
        allReceivableHistory = Array.isArray(result) ? result : [];

        const rowsHost = root.querySelector('#receivables-history-rows');
        if (!rowsHost) return;

        if (allReceivableHistory.length === 0) {
          rowsHost.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#73777e;">No hay cuentas por cobrar pagadas para mostrar.</td></tr>';
          const counter = root.querySelector('#receivables-history-count');
          if (counter) counter.textContent = 'Mostrando 0 de 0 cuentas pagadas';
          const countKPI = root.querySelector('#receivables-history-total-count');
          if (countKPI) countKPI.textContent = '0';
          const paidKPI = root.querySelector('#receivables-history-total-paid');
          if (paidKPI) paidKPI.textContent = 'C$0.00';
          return;
        }

        rowsHost.innerHTML = allReceivableHistory.map((account) => `
          <tr>
            <td><strong style="color:#002542;">${escapeHtml(account.NombreCuenta || `CxC-${account.CxCID}`)}</strong></td>
            <td>
              <div style="display:grid; gap:0.15rem;">
                <strong style="color:#002542;">${escapeHtml(account.NombreCliente || 'Sin nombre')}</strong>
                <span style="color:#43474d; font-size:0.75rem;">${escapeHtml(account.Cedula || 'Sin cédula')}</span>
              </div>
            </td>
            <td>${account.FacturaID ? `#${account.FacturaID}` : '--'}</td>
            <td style="text-align:right; font-weight:700;">${formatMoney(account.MontoOriginal || 0)}</td>
            <td style="text-align:right; font-weight:700; color:#002542;">${formatMoney(account.TotalAbonado || 0)}</td>
            <td style="text-align:right;">${formatDate(account.UltimoAbono || account.FechaCreacion)}</td>
            <td style="text-align:right;">
              <button class="icon-button receivable-history-view" type="button" data-receivable-id="${account.CxCID}" aria-label="Ver historial de transacciones">
                <span class="material-symbols-outlined">history</span>
              </button>
            </td>
          </tr>
        `).join('');

        const counter = root.querySelector('#receivables-history-count');
        if (counter) counter.textContent = `Mostrando ${allReceivableHistory.length} de ${allReceivableHistory.length} cuentas pagadas`;

        const countKPI = root.querySelector('#receivables-history-total-count');
        if (countKPI) countKPI.textContent = String(allReceivableHistory.length);

        const paidKPI = root.querySelector('#receivables-history-total-paid');
        if (paidKPI) paidKPI.textContent = formatMoney(allReceivableHistory.reduce((sum, account) => sum + Number(account.TotalAbonado || 0), 0));

        applyReceivableHistoryFilter();
      } catch (error) {
        console.error('[Contabilidad] Error loading receivable history:', error);
      }
    };

    const loadClientOrders = async (clienteId) => {
      try {
        const result = await api.request(`/api/contabilidad/cliente/${clienteId}/estado-cuenta`);
        const { cliente, pedidos } = result;

        root.querySelector('#orders-client-name').textContent = cliente.NombreCliente;
        root.querySelector('#orders-client-id').textContent = `Cédula: ${cliente.Cedula || 'N/A'}`;

        const ordersList = root.querySelector('#orders-list');
        if (ordersList) {
          if (!pedidos || pedidos.length === 0) {
            ordersList.innerHTML = '<div style="padding:2rem; text-align:center; color:#73777e;"><span class="material-symbols-outlined" style="font-size:3rem; opacity:0.5;">shopping_cart</span><p style="margin:1rem 0 0;">Sin pedidos registrados para este cliente.</p></div>';
          } else {
            ordersList.innerHTML = pedidos.map((pedido) => `
              <div style="padding:1rem; border:1px solid #e0e3e5; border-radius:0.5rem; background:#f8f9fb;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; gap:0.5rem; flex-wrap:wrap;">
                  <div>
                    <strong style="font-size:1.05rem; color:#002542;">Pedido #${pedido.PedidoID}</strong>
                    <span style="color:#43474d; font-size:0.85rem; margin-left:0.75rem;">${new Date(pedido.FechaEmision).toLocaleDateString('es-ES')}</span>
                  </div>
                  <span style="background:#cfe6f2; color:#002542; padding:0.35rem 0.75rem; border-radius:0.25rem; font-size:0.75rem; font-weight:600;">${pedido.Estado || 'Pendiente'}</span>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:1rem; margin-bottom:1rem; font-size:0.9rem;">
                  <div>
                    <p style="margin:0 0 0.3rem; color:#73777e; font-size:0.75rem; text-transform:uppercase; font-weight:600;">Unidades</p>
                    <strong style="color:#002542; font-size:1.1rem;">${pedido.TotalUnidades || 0}</strong>
                  </div>
                  <div>
                    <p style="margin:0 0 0.3rem; color:#73777e; font-size:0.75rem; text-transform:uppercase; font-weight:600;">Subtotal</p>
                    <strong style="color:#002542; font-size:1.1rem;">${formatMoney(pedido.Subtotal || 0)}</strong>
                  </div>
                  <div>
                    <p style="margin:0 0 0.3rem; color:#73777e; font-size:0.75rem; text-transform:uppercase; font-weight:600;">Total</p>
                    <strong style="color:#002542; font-size:1.1rem;">${formatMoney(pedido.Total || pedido.Subtotal || 0)}</strong>
                  </div>
                </div>

                ${pedido.FacturaID ? `
                  <div style="padding:0.75rem; background:#f2f4f6; border-radius:0.25rem; font-size:0.85rem;">
                    <p style="margin:0 0 0.5rem; color:#73777e; text-transform:uppercase; font-size:0.7rem; font-weight:600;">Facturado</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem; flex-wrap:wrap;">
                      <span style="color:#002542;">Factura #${pedido.FacturaID}</span>
                      <strong style="color:#002542;">${formatMoney(pedido.MontoFacturado || 0)}</strong>
                    </div>
                  </div>
                ` : `<div style="padding:0.75rem; background:#ffdad6; border-radius:0.25rem; color:#ba1a1a; font-size:0.85rem; text-align:center; font-weight:600;">⚠ Sin factura generada</div>`}
              </div>
            `).join('');
          }
        }

        showModal(root.querySelector('#orders-modal'));
      } catch (error) {
        console.error('[Contabilidad] Error loading orders:', error);
        window.showAlert('Error al cargar los pedidos: ' + (error.message || 'Error desconocido'), 'error');
      }
    };

    const openReceivableModal = async (cxId) => {
      try {
        const result = await api.getReceivable(cxId);
        selectedReceivable = result;
        const account = result.account;
        const history = Array.isArray(result.history) ? result.history : [];

        setText('#receivable-account-name', account.NombreCuenta || `CxC-${account.CxCID}`);
        setText('#receivable-account-meta', `Factura: ${account.FacturaID ? `#${account.FacturaID}` : 'N/A'} | Cliente: ${account.NombreCliente || 'N/A'}`);
        setText('#receivable-original-amount', formatMoney(account.MontoOriginal || 0));
        setText('#receivable-balance-amount', formatMoney(account.SaldoPendiente || 0));
        setText('#receivable-total-paid', formatMoney((account.MontoOriginal || 0) - (account.SaldoPendiente || 0)));
        setText('#receivable-created-at', `Creada: ${formatDate(account.FechaCreacion)}`);
        setText('#receivable-state', account.Estado || 'Activo');
        const paymentAmount = root.querySelector('#receivable-payment-amount');
        if (paymentAmount) paymentAmount.value = '';

        const stateChip = root.querySelector('#receivable-state');
        if (stateChip) {
          const isPaid = String(account.Estado || '').toLowerCase() === 'cancelado';
          stateChip.style.background = isPaid ? '#d1fae5' : '#cfe6f2';
          stateChip.style.color = '#002542';
          stateChip.textContent = isPaid ? 'Cancelada' : 'Activa';
        }

        const paymentSection = root.querySelector('#receivable-payment-amount')?.closest('.catalog-card');
        if (paymentSection) {
          const isPaid = String(account.Estado || '').toLowerCase() === 'cancelado';
          paymentSection.style.background = isPaid ? '#eefcf3' : '#ffffff';
          paymentSection.style.border = isPaid ? '1px solid #a3f69c' : '1px solid #e6e8ea';
          const paymentInput = root.querySelector('#receivable-payment-amount');
          const paymentButton = root.querySelector('#receivable-payment-submit');
          if (paymentInput) paymentInput.disabled = isPaid;
          if (paymentButton) paymentButton.disabled = isPaid || Number(account.SaldoPendiente || 0) <= 0;
        }

        const historyHost = root.querySelector('#receivable-history-list');
        if (historyHost) {
          if (!history.length) {
            historyHost.innerHTML = '<div style="padding:1rem; text-align:center; color:#73777e; border:1px dashed #d0d5da; border-radius:0.5rem;">Sin abonos registrados aún.</div>';
          } else {
            historyHost.innerHTML = history.map((payment, index) => `
              <div style="padding:0.9rem 1rem; border:1px solid #e0e3e5; border-radius:0.5rem; background:#f8f9fb; display:flex; justify-content:space-between; gap:1rem; align-items:center; flex-wrap:wrap;">
                <div>
                  <strong style="color:#002542;">Abono #${history.length - index}</strong>
                  <div style="color:#43474d; font-size:0.8rem; margin-top:0.2rem;">${formatDate(payment.FechaAbono)}</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-weight:700; color:#002542;">${formatMoney(payment.MontoAbonado || 0)}</div>
                  <div style="color:#43474d; font-size:0.8rem;">Saldo: ${formatMoney(payment.SaldoRestante || 0)}</div>
                </div>
              </div>
            `).join('');
          }
        }

        showModal(root.querySelector('#receivable-modal'));
      } catch (error) {
        console.error('[Contabilidad] Error loading receivable:', error);
        window.showAlert(error.message || 'No fue posible cargar la cuenta por cobrar.', 'error');
      }
    };

    const saveReceivablePayment = async () => {
      if (!selectedReceivable?.account?.CxCID) {
        window.showAlert('Primero selecciona una cuenta por cobrar.', 'warning');
        return;
      }

      const amountInput = root.querySelector('#receivable-payment-amount');
      const amount = Number(amountInput?.value || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        window.showAlert('Ingresa un monto válido para el abono.', 'warning');
        return;
      }

      try {
        await api.addReceivablePayment(selectedReceivable.account.CxCID, { montoAbonado: amount });
        window.showAlert('Abono registrado correctamente.', 'success');
        await renderReceivables();
        await openReceivableModal(selectedReceivable.account.CxCID);
      } catch (error) {
        window.showAlert(error.message || 'No fue posible registrar el abono.', 'error');
      }
    };

    const exportSelectedReceivable = () => {
      if (!window.XLSX) {
        window.showAlert('No se pudo cargar el módulo de Excel.', 'error');
        return;
      }

      if (!selectedReceivable?.account?.CxCID) {
        window.showAlert('Primero abre una cuenta por cobrar para exportarla.', 'warning');
        return;
      }

      const account = selectedReceivable.account;
      const history = Array.isArray(selectedReceivable.history) ? selectedReceivable.history : [];
      const documentNumber = account.FacturaID ? `FACT-${account.FacturaID}` : `CXC-${account.CxCID}`;
      const fileName = `${String(account.NombreCuenta || documentNumber).replace(/[^a-z0-9\-_.]+/gi, '_').toLowerCase()}.xlsx`;

      const summaryRows = [{
        'Cuenta': account.NombreCuenta || `CxC-${account.CxCID}`,
        'Cliente': account.NombreCliente || '',
        'Cédula': account.Cedula || '',
        'Factura': account.FacturaID ? `#${account.FacturaID}` : '',
        'Fecha Creación': formatDate(account.FechaCreacion),
        'Estado': account.Estado || 'Activo',
        'Monto Original': Number(account.MontoOriginal || 0),
        'Saldo Pendiente': Number(account.SaldoPendiente || 0),
        'Total Abonado': Number((account.MontoOriginal || 0) - (account.SaldoPendiente || 0)),
      }];

      const paymentRows = history.length > 0
        ? history.map((payment, index) => ({
          'Abono': history.length - index,
          'Fecha': formatDate(payment.FechaAbono),
          'Monto Abonado': Number(payment.MontoAbonado || 0),
          'Saldo Restante': Number(payment.SaldoRestante || 0),
        }))
        : [{
          'Abono': '',
          'Fecha': '',
          'Monto Abonado': 0,
          'Saldo Restante': Number(account.SaldoPendiente || 0),
        }];

      const wb = XLSX.utils.book_new();
      const wsResumen = XLSX.utils.json_to_sheet(summaryRows);
      const wsHistorial = XLSX.utils.json_to_sheet(paymentRows);

      wsResumen['!cols'] = [
        { wch: 22 },
        { wch: 28 },
        { wch: 16 },
        { wch: 14 },
        { wch: 14 },
        { wch: 12 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
      ];

      wsHistorial['!cols'] = [
        { wch: 12 },
        { wch: 14 },
        { wch: 16 },
        { wch: 16 },
      ];

      wsResumen['!autofilter'] = { ref: `A1:I${summaryRows.length + 1}` };
      wsHistorial['!autofilter'] = { ref: `A1:D${paymentRows.length + 1}` };

      const setCurrencyCol = (sheet, colLetter, fromRow, toRow) => {
        for (let row = fromRow; row <= toRow; row += 1) {
          const cell = sheet[`${colLetter}${row}`];
          if (cell) cell.z = '"C$" #,##0.00';
        }
      };

      setCurrencyCol(wsResumen, 'G', 2, 2);
      setCurrencyCol(wsResumen, 'H', 2, 2);
      setCurrencyCol(wsResumen, 'I', 2, 2);
      setCurrencyCol(wsHistorial, 'C', 2, paymentRows.length + 1);
      setCurrencyCol(wsHistorial, 'D', 2, paymentRows.length + 1);

      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen CxC');
      XLSX.utils.book_append_sheet(wb, wsHistorial, 'Historial Abonos');
      XLSX.writeFile(wb, fileName);
    };

    // View switching
    root.querySelectorAll('.accounting-view-btn').forEach((button) => {
      button.addEventListener('click', () => setActiveView(button.dataset.accountingView || 'clientes'));
    });

    root.querySelector('#accounting-search')?.addEventListener('input', applyClientFilter);
    root.querySelector('#receivables-search')?.addEventListener('input', applyReceivableFilter);
    root.querySelector('#receivables-history-search')?.addEventListener('input', applyReceivableHistoryFilter);

    root.querySelector('#accounting-rows')?.addEventListener('click', (event) => {
      const btn = event.target.closest('.view-orders');
      if (!btn) return;
      event.stopPropagation();
      loadClientOrders(Number(btn.dataset.clientId));
    });

    root.querySelector('#receivables-rows')?.addEventListener('click', (event) => {
      const btn = event.target.closest('.receivable-pay');
      if (!btn) return;
      event.stopPropagation();
      openReceivableModal(Number(btn.dataset.cxid));
    });

    root.querySelector('#receivables-history-rows')?.addEventListener('click', (event) => {
      const btn = event.target.closest('.receivable-history-view');
      if (!btn) return;
      event.stopPropagation();
      openReceivableModal(Number(btn.dataset.receivableId));
    });

    root.querySelector('#receivable-payment-submit')?.addEventListener('click', saveReceivablePayment);
    root.querySelector('#export-receivable-detail')?.addEventListener('click', exportSelectedReceivable);

    root.querySelector('#close-receivable-modal')?.addEventListener('click', () => hideModal(root.querySelector('#receivable-modal')));
    root.querySelector('#receivable-close')?.addEventListener('click', () => hideModal(root.querySelector('#receivable-modal')));
    root.querySelector('#receivable-modal')?.addEventListener('click', (event) => {
      if (event.target === root.querySelector('#receivable-modal')) {
        hideModal(root.querySelector('#receivable-modal'));
      }
    });

    // Modal controls
    root.querySelector('#close-orders-modal')?.addEventListener('click', () => hideModal(root.querySelector('#orders-modal')));
    root.querySelector('#orders-cancel')?.addEventListener('click', () => hideModal(root.querySelector('#orders-modal')));
    root.querySelector('#orders-modal')?.addEventListener('click', (event) => {
      if (event.target === root.querySelector('#orders-modal')) {
        hideModal(root.querySelector('#orders-modal'));
      }
    });

    root.querySelector('#close-statement-modal')?.addEventListener('click', () => hideModal(root.querySelector('#statement-modal')));
    root.querySelector('#statement-cancel')?.addEventListener('click', () => hideModal(root.querySelector('#statement-modal')));
    root.querySelector('#statement-modal')?.addEventListener('click', (event) => {
      if (event.target === root.querySelector('#statement-modal')) {
        hideModal(root.querySelector('#statement-modal'));
      }
    });

    root.querySelector('#export-accounting')?.addEventListener('click', () => {
      if (!window.XLSX) {
        window.showAlert('No se pudo cargar el módulo de Excel.', 'error');
        return;
      }

      if (activeView === 'cxc') {
        if (allReceivables.length === 0) {
          window.showAlert('No hay cuentas por cobrar para exportar.', 'warning');
          return;
        }

        const ws = XLSX.utils.json_to_sheet(allReceivables.map((account) => ({
          'Cuenta': account.NombreCuenta || `CxC-${account.CxCID}`,
          'Cliente': account.NombreCliente || '',
          'Factura': account.FacturaID ? `#${account.FacturaID}` : '',
          'Monto Original': Number(account.MontoOriginal || 0),
          'Saldo Pendiente': Number(account.SaldoPendiente || 0),
          'Fecha Creación': formatDate(account.FechaCreacion),
          'Estado': account.Estado || 'Activo',
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Cuentas Por Cobrar');
        XLSX.writeFile(wb, 'cuentas-por-cobrar.xlsx');
        return;
      }

      if (allClients.length === 0) {
        window.showAlert('No hay datos para exportar.', 'warning');
        return;
      }

      const ws = XLSX.utils.json_to_sheet(allClients.map((client) => ({
        'Nombre Cliente': client.NombreCliente,
        'Cédula': client.Cedula,
        'Total Pedidos': client.TotalPedidos,
        'Total Facturas': client.TotalFacturas,
        'Monto Facturado': client.MontoFacturado,
        'Subtotal': client.SubtotalFacturas,
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contabilidad');
      XLSX.writeFile(wb, 'contabilidad-clientes.xlsx');
    });

    const refreshAccountingData = async () => {
      if (!root.isConnected) return;
      await Promise.all([renderClients(), renderReceivables(), renderReceivableHistory()]);
    };

    setActiveView('clientes');
    refreshAccountingData();
  }
};
