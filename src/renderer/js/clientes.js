window.clientsView = {
  title: 'Gestión de Clientes y Proveedores',
  subtitle: 'Directorio para revisar, crear y preparar datos de contacto.',
  render() {
    return `
      <div class="view-wrap clients-view">
        <div class="no-print" style="display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap;">
          <div>
            <h3 style="margin:0.25rem 0 0; font-size:2rem; color:#002542;">Directorio</h3>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            <button id="open-new-client-modal" class="ghost-button" type="button" style="display:flex; align-items:center; gap:0.45rem; border:1px solid #c3c6ce;"><span class="material-symbols-outlined">person_add</span><span>Nuevo cliente</span></button>
            <button id="open-providers-modal" class="ghost-button" type="button" style="display:flex; align-items:center; gap:0.45rem; border:1px solid #c3c6ce;"><span class="material-symbols-outlined">local_shipping</span><span>Proveedores</span></button>
            <button id="export-clients" class="cta-button" type="button"><span class="material-symbols-outlined">download</span><span>Exportar Excel</span></button>
          </div>
        </div>

        <div class="catalog-layout">
          <div class="catalog-main">
            <div class="catalog-card">
              <div style="padding:1rem 1.15rem 0.5rem; display:grid; gap:0.9rem;">
                <div class="grid-2" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
                  <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                    <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Total Clientes</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                      <strong id="clients-total-kpi" style="font-size:2rem; color:#002542;">0</strong>
                      <span class="material-symbols-outlined" style="color:#002542; background:#cfe6f2; padding:0.55rem; border-radius:0.75rem;">groups</span>
                    </div>
                  </div>
                  <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                    <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Nuevos (Mes)</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                      <strong id="clients-new-kpi" style="font-size:2rem; color:#002542;">0</strong>
                      <span class="material-symbols-outlined" style="color:#002a05; background:#a3f69c; padding:0.55rem; border-radius:0.75rem;">person_add</span>
                    </div>
                  </div>
                  <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff;">
                    <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Total Proveedores</p>
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
                      <strong id="clients-retention-kpi" style="font-size:2rem; color:#002542;">--</strong>
                       <span class="material-symbols-outlined" style="color:#002542; background:#cfe6f2; padding:0.55rem; border-radius:0.75rem;">groups</span>
                    </div>
                  </div>
                </div>

                <div class="search-row no-print">
                  <input id="client-search" class="search-input" type="search" placeholder="Buscar cliente..." />
                </div>
              </div>

              <div class="table-wrap">
                <table class="catalog-table">
                  <thead>
                    <tr>
                      <th>Nombre del Cliente</th>
                      <th>RUC / Cédula</th>
                      <th>Contacto</th>
                      <th>Correo Electrónico</th>
                      <th>Estado</th>
                      <th style="text-align:right;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="client-rows"></tbody>
                </table>
              </div>

              <div class="catalog-footer">
                <span id="client-count">Mostrando 0 de 0 clientes registrados</span>
                <div style="display:flex; gap:0.45rem; align-items:center;">
                  <button class="round-button"><span class="material-symbols-outlined">chevron_left</span></button>
                  <button class="filter-button active">1</button>
                  <button class="filter-button">2</button>
                  <button class="filter-button">3</button>
                  <button class="round-button"><span class="material-symbols-outlined">chevron_right</span></button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div id="new-client-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:65; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card side-panel" style="width:100%; max-width:38rem; max-height:88vh; overflow:auto; position:static;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <h4>Nuevo Cliente</h4>
                <p>Información general</p>
              </div>
              <button id="close-new-client-modal" class="round-button" type="button" aria-label="Cerrar formulario de nuevo cliente"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div class="field-group">
              <div class="field-group"><label>Nombre Completo o Razón Social</label><input id="new-client-name" class="field-input" placeholder="Ej: Arquitecura Loft S.A.S" type="text" /></div>
              <div class="field-group"><label>Identificación (RUC/Cédula)</label><input id="new-client-id" class="field-input" placeholder="0010102031986R" type="text" minlength="14" maxlength="14" /></div>
              <div class="field-group"><label>Correo Electrónico</label><input id="new-client-email" class="field-input" placeholder="ejemplo@correo.com" type="email" /></div>
              <div class="field-group"><label>Teléfono de Contacto</label><input id="new-client-phone" class="field-input" placeholder="+57 300 000 0000" type="tel" /></div>
              <div class="field-group"><label>Dirección Fiscal</label><input id="new-client-address" class="field-input" placeholder="Calle 00 # 00 - 00" type="text" /></div>
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                <div style="display:flex; gap:0.75rem; align-items:flex-start;">
                  <span class="material-symbols-outlined" style="color:#64b462;">info</span>
                  <p style="margin:0; color:#526772; font-size:0.82rem; line-height:1.6;">Este cliente será indexado automáticamente para su uso en los módulos de <strong>Pedidos</strong> y <strong>Facturación</strong>.</p>
                </div>
              </div>
              <div style="display:flex; gap:0.65rem; margin-top:0.25rem;">
                <button id="cancel-new-client-modal" class="ghost-button" type="button" style="flex:1; text-transform:uppercase; letter-spacing:0.12em; font-weight:800;">Cancelar</button>
                <button id="save-new-client-modal" class="cta-button" type="button" style="flex:1; text-transform:uppercase; letter-spacing:0.12em; font-weight:800;">Guardar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL PROVEEDORES -->
        <div id="providers-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:67; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card" style="width:100%; max-width:52rem; max-height:88vh; display:grid; grid-template-rows:auto 1fr auto; overflow:hidden; padding:0;">
            <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e6e8ea; display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.25rem; color:#002542;">Proveedores</h4>
                <p style="margin:0.3rem 0 0; color:#43474d; font-size:0.85rem;">Gestiona el directorio de proveedores.</p>
              </div>
              <button id="close-providers-modal" class="round-button" type="button" aria-label="Cerrar proveedores"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div style="overflow:auto; padding:1.25rem; display:flex; flex-direction:column; gap:1rem;">
              <div class="table-wrap">
                <table class="invoice-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre del Proveedor</th>
                      <th style="text-align:center; width:8rem;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="providers-rows">
                    <tr><td colspan="3" style="text-align:center; color:#73777e; padding:2rem;">Cargando proveedores...</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style="padding:1rem 1.5rem; border-top:1px solid #e6e8ea; background:#f2f4f6; display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
              <span id="providers-count" style="font-size:0.82rem; color:#73777e;"></span>
              <div style="display:flex; gap:0.65rem;">
                <button id="close-providers-modal-footer" class="ghost-button" type="button">Cerrar</button>
                <button id="open-new-provider-form" class="cta-button" type="button" style="display:flex; align-items:center; gap:0.4rem;"><span class="material-symbols-outlined">add</span><span>Nuevo Proveedor</span></button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL NUEVO / EDITAR PROVEEDOR -->
        <div id="provider-form-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.35); backdrop-filter:blur(8px); z-index:68; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card side-panel" style="width:100%; max-width:34rem; max-height:80vh; overflow:auto; position:static;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <h4 id="provider-form-title">Nuevo Proveedor</h4>
                <p style="margin:0.3rem 0 0; color:#43474d;">Ingresa el nombre del proveedor.</p>
              </div>
              <button id="close-provider-form-modal" class="round-button" type="button"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div class="field-group">
              <label>Nombre del Proveedor</label>
              <input id="provider-form-name" class="field-input" type="text" placeholder="Ej: Distribuidora Central S.A." />
            </div>
            <div style="display:flex; gap:0.65rem; margin-top:1rem;">
              <button id="cancel-provider-form" class="ghost-button" type="button" style="flex:1;">Cancelar</button>
              <button id="save-provider-form" class="cta-button" type="button" style="flex:1;">Guardar</button>
            </div>
          </div>
        </div>

        <div id="edit-client-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:66; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card side-panel" style="width:100%; max-width:38rem; max-height:88vh; overflow:auto; position:static;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <h4>Editar Cliente</h4>
                <p>Actualiza los datos registrados</p>
              </div>
              <button id="close-edit-client-modal" class="round-button" type="button" aria-label="Cerrar formulario de edición de cliente"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div class="field-group">
              <div class="field-group"><label>Nombre Completo o Razón Social</label><input id="edit-client-name" class="field-input" placeholder="Ej: Arquitectura Loft S.A.S" type="text" /></div>
              <div class="field-group"><label>Identificación (RUC/Cédula)</label><input id="edit-client-id" class="field-input" placeholder="0010102031876R" type="text" minlength="14" maxlength="14" /></div>
              <div class="field-group"><label>Correo Electrónico</label><input id="edit-client-email" class="field-input" placeholder="ejemplo@correo.com" type="email" /></div>
              <div class="field-group"><label>Teléfono de Contacto</label><input id="edit-client-phone" class="field-input" placeholder="+57 300 000 0000" type="tel" /></div>
              <div class="field-group"><label>Dirección Fiscal</label><input id="edit-client-address" class="field-input" placeholder="BO. ALT Puente calle" type="text" /></div>
              <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
                <div style="display:flex; gap:0.75rem; align-items:flex-start;">
                  <span class="material-symbols-outlined" style="color:#64b462;">info</span>
                  <p style="margin:0; color:#526772; font-size:0.82rem; line-height:1.6;">Los cambios se aplicarán al cliente y quedarán disponibles para Pedidos y Facturación.</p>
                </div>
              </div>
              <div style="display:flex; gap:0.65rem; margin-top:0.25rem; flex-wrap:wrap;">
                <button id="delete-edit-client-modal" class="ghost-button" type="button" style="flex:1; text-transform:uppercase; letter-spacing:0.12em; font-weight:800; color:#ba1a1a; border-color:#ffc2c2;">Eliminar</button>
                <button id="cancel-edit-client-modal" class="ghost-button" type="button" style="flex:1; text-transform:uppercase; letter-spacing:0.12em; font-weight:800;">Cancelar</button>
                <button id="save-edit-client-modal" class="cta-button" type="button" style="flex:1; text-transform:uppercase; letter-spacing:0.12em; font-weight:800;">Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  bind(root, navigate) {
    const search = root.querySelector('#client-search');
    const rowsHost = root.querySelector('#client-rows');
    const counter = root.querySelector('#client-count');
    const newClientModal = root.querySelector('#new-client-modal');
    const editClientModal = root.querySelector('#edit-client-modal');
    const openNewClientModal = root.querySelector('#open-new-client-modal');
    const api = window.appApi;
    let clientRows = [];
    let currentEditClientId = null;

    const escapeHtml = (value) => String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const initials = (name) => {
      const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
      return (parts[0]?.[0] || 'C') + (parts[1]?.[0] || 'L');
    };

    const clientFieldIds = {
      name: '#new-client-name',
      id: '#new-client-id',
      email: '#new-client-email',
      phone: '#new-client-phone',
      address: '#new-client-address',
    };

    const editFieldIds = {
      name: '#edit-client-name',
      id: '#edit-client-id',
      email: '#edit-client-email',
      phone: '#edit-client-phone',
      address: '#edit-client-address',
    };

    const setFields = (prefix, values = {}) => {
      Object.entries(values).forEach(([key, value]) => {
        const element = root.querySelector((prefix === 'new' ? clientFieldIds : editFieldIds)[key]);
        if (element) {
          element.value = value || '';
        }
      });
    };

    const clearNewClientForm = () => setFields('new', { name: '', id: '', email: '', phone: '', address: '' });

    const clearEditClientForm = () => setFields('edit', { name: '', id: '', email: '', phone: '', address: '' });

    const readClientForm = (prefix) => ({
      cedula: (root.querySelector((prefix === 'new' ? clientFieldIds : editFieldIds).id)?.value?.trim() || '').slice(0, 14),
      nombreCliente: root.querySelector((prefix === 'new' ? clientFieldIds : editFieldIds).name)?.value?.trim() || '',
      correo: root.querySelector((prefix === 'new' ? clientFieldIds : editFieldIds).email)?.value?.trim() || '',
      telefono: root.querySelector((prefix === 'new' ? clientFieldIds : editFieldIds).phone)?.value?.trim() || '',
      direccion: root.querySelector((prefix === 'new' ? clientFieldIds : editFieldIds).address)?.value?.trim() || '',
    });

    const isValidCedulaLength = (value) => String(value || '').trim().length === 14;

    const enforceCedulaMaxLength = (selector, max = 14) => {
      const input = root.querySelector(selector);
      if (!input) return;

      const trimValue = () => {
        if (input.value.length > max) {
          input.value = input.value.slice(0, max);
        }
      };

      input.setAttribute('maxlength', String(max));
      input.addEventListener('input', trimValue);
      input.addEventListener('paste', () => setTimeout(trimValue, 0));
    };

    const getClientById = (clientId) => clientRows.find((client) => String(client.ClienteID) === String(clientId)) || null;

    const loadClients = async () => {
      if (!api?.listClients) {
        return [];
      }

      try {
        return await api.listClients();
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    const renderClients = async () => {
      if (!rowsHost) return;
      const clients = await loadClients();
      clientRows = clients;

      if (clients.length === 0) {
        rowsHost.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#73777e;">Sin clientes cargados. Agrega uno con "Nuevo cliente".</td></tr>';
        if (counter) counter.textContent = 'Mostrando 0 de 0 clientes registrados';
        root.querySelector('#clients-total-kpi').textContent = '0';
        root.querySelector('#clients-new-kpi').textContent = '0';
        return;
      }

      rowsHost.innerHTML = clients.map((client) => {
        const name = client.NombreCliente || client.nombreCliente || client.name || '';
        const id = client.Cedula || client.cedula || client.id || '';
        const phone = client.Telefono || client.telefono || client.phone || '';
        const email = client.Correo || client.correo || client.email || '';
        const searchData = `${name} ${id} ${phone} ${email}`;
        return `
          <tr class="product-row" data-client-id="${escapeHtml(client.ClienteID)}" data-search="${escapeHtml(searchData)}">
            <td><div class="product-meta"><div class="thumb" style="border-radius:9999px; background:#526772; color:#fff; display:grid; place-items:center; font-weight:800;">${escapeHtml(initials(name).toUpperCase())}</div><strong>${escapeHtml(name)}</strong></div></td>
            <td>${escapeHtml(id)}</td>
            <td>${escapeHtml(phone)}</td>
            <td>${escapeHtml(email)}</td>
            <td><span class="chip active" style="border-radius:0.35rem; padding:0.25rem 0.5rem; font-size:0.7rem; text-transform:uppercase;">Activo</span></td>
            <td><div class="row-actions" style="justify-content:flex-end;"><button class="icon-button" type="button" data-client-action="edit" data-client-id="${escapeHtml(client.ClienteID)}" aria-label="Editar cliente"><span class="material-symbols-outlined">edit</span></button><button class="icon-button" type="button" data-client-action="delete" data-client-id="${escapeHtml(client.ClienteID)}" aria-label="Eliminar cliente"><span class="material-symbols-outlined">delete</span></button></div></td>
          </tr>
        `;
      }).join('');

      root.querySelector('#clients-total-kpi').textContent = String(clients.length);
      root.querySelector('#clients-new-kpi').textContent = String(clients.length);
    };

    const applyFilter = () => {
      const term = (search?.value || '').trim().toLowerCase();
      let visible = 0;

      const rows = Array.from(root.querySelectorAll('#client-rows .product-row'));
      rows.forEach((row) => {
        const haystack = (row.dataset.search || row.textContent || '').toLowerCase();
        const show = !term || haystack.includes(term);
        row.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });

      if (counter) counter.textContent = `Mostrando ${visible} de ${rows.length} clientes registrados`;
    };

    search?.addEventListener('input', applyFilter);

    const blurModalFocus = (modal) => {
      if (!modal) return;
      const activeElement = document.activeElement;
      if (activeElement && modal.contains(activeElement) && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }
    };

    const closeNewClientModal = () => {
      if (!newClientModal) return;
      blurModalFocus(newClientModal);
      newClientModal.style.opacity = '0';
      newClientModal.style.pointerEvents = 'none';
      newClientModal.setAttribute('aria-hidden', 'true');
    };

    const closeEditClientModal = () => {
      if (!editClientModal) return;
      blurModalFocus(editClientModal);
      editClientModal.style.opacity = '0';
      editClientModal.style.pointerEvents = 'none';
      editClientModal.setAttribute('aria-hidden', 'true');
      currentEditClientId = null;
    };

    const showNewClientModal = () => {
      if (!newClientModal) return;
      clearNewClientForm();
      newClientModal.style.opacity = '1';
      newClientModal.style.pointerEvents = 'auto';
      newClientModal.setAttribute('aria-hidden', 'false');
    };

    const showEditClientModal = (client) => {
      if (!editClientModal || !client) return;
      currentEditClientId = client.ClienteID;
      setFields('edit', {
        name: client.NombreCliente || client.nombreCliente || client.name || '',
        id: client.Cedula || client.cedula || client.id || '',
        email: client.Correo || client.correo || client.email || '',
        phone: client.Telefono || client.telefono || client.phone || '',
        address: client.Direccion || client.direccion || client.address || '',
      });
      editClientModal.style.opacity = '1';
      editClientModal.style.pointerEvents = 'auto';
      editClientModal.setAttribute('aria-hidden', 'false');
    };

    openNewClientModal?.addEventListener('click', showNewClientModal);
    root.querySelector('#close-new-client-modal')?.addEventListener('click', closeNewClientModal);
    root.querySelector('#cancel-new-client-modal')?.addEventListener('click', closeNewClientModal);
    root.querySelector('#close-edit-client-modal')?.addEventListener('click', closeEditClientModal);
    root.querySelector('#cancel-edit-client-modal')?.addEventListener('click', closeEditClientModal);

    root.querySelector('#edit-client-modal')?.addEventListener('click', (event) => {
      if (event.target === editClientModal) {
        closeEditClientModal();
      }
    });

    root.querySelector('#new-client-modal')?.addEventListener('click', (event) => {
      if (event.target === newClientModal) {
        closeNewClientModal();
      }
    });

    enforceCedulaMaxLength('#new-client-id', 14);
    enforceCedulaMaxLength('#edit-client-id', 14);

    rowsHost?.addEventListener('click', (event) => {
      const actionButton = event.target.closest('[data-client-action]');
      if (!actionButton) return;

      const client = getClientById(actionButton.dataset.clientId);
      if (!client) return;

      if (actionButton.dataset.clientAction === 'edit') {
        showEditClientModal(client);
        return;
      }

      if (actionButton.dataset.clientAction === 'delete') {
        const confirmed = window.confirm(`¿Eliminar a ${client.NombreCliente || client.nombreCliente || 'este cliente'} del directorio? Sus pedidos, facturas y cuentas por cobrar se conservan.`);
        if (!confirmed) {
          return;
        }

        if (!api?.deleteClient) {
          window.showAlert('La API no está disponible.');
          return;
        }

        api.deleteClient(client.ClienteID)
          .then(async () => {
            await renderClients();
            applyFilter();
          })
          .catch((error) => {
            window.showAlert(error.message || 'No fue posible eliminar el cliente.', 'error');
          });
      }
    });

    root.querySelector('#save-edit-client-modal')?.addEventListener('click', async () => {
      if (!currentEditClientId) return;

      if (!api?.updateClient) {
        window.showAlert('La API no está disponible.');
        return;
      }

      const payload = readClientForm('edit');
      if (!payload.nombreCliente || !payload.cedula) {
        window.showAlert('El nombre y la identificación son obligatorios.');
        return;
      }

      if (!isValidCedulaLength(payload.cedula)) {
        window.showAlert('La identificación debe tener exactamente 14 caracteres.', 'warning');
        root.querySelector('#edit-client-id')?.focus();
        return;
      }

      try {
        await api.updateClient(currentEditClientId, payload);
        await renderClients();
        applyFilter();
        closeEditClientModal();
      } catch (error) {
        window.showAlert(error.message || 'No fue posible actualizar el cliente.', 'error');
      }
    });

    root.querySelector('#save-new-client-modal')?.addEventListener('click', async () => {
      const payload = readClientForm('new');
      if (!payload.nombreCliente || !payload.cedula) {
        window.showAlert('El nombre y la identificación son obligatorios.');
        return;
      }

      if (!isValidCedulaLength(payload.cedula)) {
        window.showAlert('La identificación debe tener exactamente 14 caracteres.', 'warning');
        root.querySelector('#new-client-id')?.focus();
        return;
      }

      if (!api?.createClient) {
        window.showAlert('La API no está disponible.');
        return;
      }

      try {
        await api.createClient(payload);
        await renderClients();
        applyFilter();
        clearNewClientForm();
        closeNewClientModal();
      } catch (error) {
        window.showAlert(error.message || 'No fue posible guardar el cliente.', 'error');
      }
    });
    root.querySelector('#export-clients')?.addEventListener('click', async () => {
      const clients = clientRows.length > 0 ? clientRows : await loadClients();
      if (clients.length === 0) {
        window.showAlert('No hay clientes para exportar.', 'warning');
        return;
      }

      const data = clients.map((client) => ({
        'Nombre': client.NombreCliente || client.nombreCliente || client.name,
        'Identificación': client.Cedula || client.cedula || client.id,
        'Correo Electrónico': client.Correo || client.correo || client.email,
        'Teléfono': client.Telefono || client.telefono || client.phone,
        'Dirección': client.Direccion || client.direccion || client.address,
        'Estado': 'Activo'
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
      XLSX.writeFile(wb, 'clientes.xlsx');
    });

    // ---- PROVEEDORES ----
    const providersModal = root.querySelector('#providers-modal');
    const providerFormModal = root.querySelector('#provider-form-modal');
    const providersRows = root.querySelector('#providers-rows');
    const providersCount = root.querySelector('#providers-count');
    const providersKpi = root.querySelector('#clients-retention-kpi');
    let currentEditProviderId = null;

    const refreshProvidersKpi = async () => {
      try {
        const providers = api?.listProviders ? await api.listProviders() : [];
        if (providersKpi) providersKpi.textContent = String(providers.length);
      } catch {
        if (providersKpi) providersKpi.textContent = '0';
      }
    };

    const openProvidersModal = () => {
      if (!providersModal) return;
      providersModal.style.opacity = '1';
      providersModal.style.pointerEvents = 'auto';
      providersModal.setAttribute('aria-hidden', 'false');
      renderProviders();
    };

    const closeProvidersModal = () => {
      if (!providersModal) return;
      blurModalFocus(providersModal);
      providersModal.style.opacity = '0';
      providersModal.style.pointerEvents = 'none';
      providersModal.setAttribute('aria-hidden', 'true');
    };

    const openProviderForm = (provider = null) => {
      if (!providerFormModal) return;
      currentEditProviderId = provider ? provider.ProveedorID : null;
      root.querySelector('#provider-form-title').textContent = provider ? 'Editar Proveedor' : 'Nuevo Proveedor';
      root.querySelector('#provider-form-name').value = provider ? (provider.NombreProveedor || '') : '';
      providerFormModal.style.opacity = '1';
      providerFormModal.style.pointerEvents = 'auto';
      providerFormModal.setAttribute('aria-hidden', 'false');
    };

    const closeProviderForm = () => {
      if (!providerFormModal) return;
      blurModalFocus(providerFormModal);
      providerFormModal.style.opacity = '0';
      providerFormModal.style.pointerEvents = 'none';
      providerFormModal.setAttribute('aria-hidden', 'true');
      currentEditProviderId = null;
    };

    const renderProviders = async () => {
      if (!providersRows) return;
      try {
        const providers = api?.listProviders ? await api.listProviders() : [];
        if (providersCount) providersCount.textContent = `${providers.length} proveedor${providers.length !== 1 ? 'es' : ''} registrado${providers.length !== 1 ? 's' : ''}`;
        if (!providers.length) {
          providersRows.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#73777e; padding:2rem;">Sin proveedores. Agrega uno con "Nuevo Proveedor".</td></tr>';
          if (providersKpi) providersKpi.textContent = '0';
          return;
        }
        if (providersKpi) providersKpi.textContent = String(providers.length);
        providersRows.innerHTML = providers.map((p) => `
          <tr>
            <td style="color:#73777e;">#${escapeHtml(String(p.ProveedorID))}</td>
            <td><strong>${escapeHtml(p.NombreProveedor || '')}</strong></td>
            <td>
              <div class="row-actions" style="justify-content:center;">
                <button class="icon-button" type="button" data-provider-action="edit" data-provider-id="${escapeHtml(String(p.ProveedorID))}" data-provider-name="${escapeHtml(p.NombreProveedor || '')}" aria-label="Editar proveedor"><span class="material-symbols-outlined">edit</span></button>
                <button class="icon-button" type="button" data-provider-action="delete" data-provider-id="${escapeHtml(String(p.ProveedorID))}" data-provider-name="${escapeHtml(p.NombreProveedor || '')}" aria-label="Eliminar proveedor"><span class="material-symbols-outlined">delete</span></button>
              </div>
            </td>
          </tr>
        `).join('');
      } catch (error) {
        if (providersKpi) providersKpi.textContent = '0';
        providersRows.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#ba1a1a; padding:2rem;">Error al cargar: ${escapeHtml(error.message)}</td></tr>`;
      }
    };

    root.querySelector('#open-providers-modal')?.addEventListener('click', openProvidersModal);
    root.querySelector('#close-providers-modal')?.addEventListener('click', closeProvidersModal);
    root.querySelector('#close-providers-modal-footer')?.addEventListener('click', closeProvidersModal);
    providersModal?.addEventListener('click', (e) => { if (e.target === providersModal) closeProvidersModal(); });

    root.querySelector('#open-new-provider-form')?.addEventListener('click', () => openProviderForm(null));
    root.querySelector('#close-provider-form-modal')?.addEventListener('click', closeProviderForm);
    root.querySelector('#cancel-provider-form')?.addEventListener('click', closeProviderForm);
    providerFormModal?.addEventListener('click', (e) => { if (e.target === providerFormModal) closeProviderForm(); });

    root.querySelector('#save-provider-form')?.addEventListener('click', async () => {
      const nombre = root.querySelector('#provider-form-name')?.value?.trim();
      if (!nombre) {
        window.showAlert('El nombre del proveedor es obligatorio.', 'warning');
        return;
      }
      try {
        if (currentEditProviderId) {
          await api.updateProvider(currentEditProviderId, { nombreProveedor: nombre });
        } else {
          await api.createProvider({ nombreProveedor: nombre });
        }
        closeProviderForm();
        await renderProviders();
      } catch (error) {
        window.showAlert(error.message || 'No fue posible guardar el proveedor.', 'error');
      }
    });

    providersRows?.addEventListener('click', async (event) => {
      const btn = event.target.closest('[data-provider-action]');
      if (!btn) return;
      const id = btn.dataset.providerId;
      const name = btn.dataset.providerName;
      if (btn.dataset.providerAction === 'edit') {
        openProviderForm({ ProveedorID: id, NombreProveedor: name });
        return;
      }
      if (btn.dataset.providerAction === 'delete') {
        if (!window.confirm(`¿Eliminar al proveedor "${name}"?`)) return;
        try {
          await api.deleteProvider(id);
          await renderProviders();
        } catch (error) {
          window.showAlert(error.message || 'No fue posible eliminar el proveedor.', 'error');
        }
      }
    });

    const refreshClientsData = async () => {
      if (!root.isConnected) return; // No actualizar si la vista no está activa
      await Promise.all([renderClients(), refreshProvidersKpi()]);
      applyFilter();
    };

    refreshClientsData();
  }
};

