window.catalogView = {
  title: 'Catálogo de Productos',
  subtitle: 'Visualización y gestión del inventario premium. Busca un SKU, cambia la unidad de medida o abre facturación desde aquí.',
  render() {
    return `
      <div class="view-wrap catalog-view">
        <div class="catalog-header no-print">
          <div>
            <h3>Catálogo de Productos</h3>
            <button id="open-new-product-modal" class="cta-button" type="button" style="margin-top:0.7rem; display:inline-flex; align-items:center; gap:0.45rem;">
              <span class="material-symbols-outlined">add</span>
              Nuevo Producto
            </button>
          </div>
          <div class="catalog-toolbar">
            <button class="chip active" data-unit-measure="all">Todos</button>
            <button class="chip" data-unit-measure="Pliego">Pliego</button>
            <button class="chip" data-unit-measure="Lámina">Lámina</button>
            <button class="chip" data-unit-measure="Rollo">Rollo</button>
            <button class="chip" data-unit-measure="Caja">Caja</button>
            <button class="chip" data-unit-measure="Unidad">Unidad</button>
            <button class="chip" data-unit-measure="Resma">Resma</button>
            <button class="chip" data-unit-measure="Resmon">Resmon</button>
          </div>
        </div>
        <br>
        <div class="catalog-layout">
          <div class="catalog-main">
            <div class="catalog-card">
              <div style="padding: 1rem 1.15rem; display: grid; gap: 0.9rem;">
                <div class="search-row no-print">
                  <input id="catalog-search" class="search-input" type="search" placeholder="Buscar productos, SKUs o descripción..." />
                </div>
                <div class="table-wrap">
                  <table class="catalog-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th style="text-align:center;">Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="catalog-rows"></tbody>
                  </table>
                </div>
              </div>
              <div class="catalog-footer">
                <span id="catalog-count">Mostrando 0 de 0 productos</span>
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

        <div id="new-product-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:65; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card side-panel" style="width:100%; max-width:38rem; max-height:88vh; overflow:auto; position:static;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <h4>Nuevo Producto</h4>
                <p>Completa los detalles del artículo premium.</p>
              </div>
              <button id="close-new-product-modal" class="round-button" type="button" aria-label="Cerrar formulario de nuevo producto"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div class="field-group">
              <div class="field-group"><label>Nombre del Producto</label><input id="new-product-name" class="field-input" placeholder="Ej: Agenda Ejecutiva 2024" type="text" /></div>
              <div class="grid-2">
                <div class="field-group"><label>Código (SKU)</label><input id="new-product-sku" class="field-input" placeholder="ATL-000-XX" type="text" /></div>
                <div class="field-group"><label>Unidad de medida</label><select id="new-product-category" class="field-select"><option value="">Selecciona</option><option>Pliego</option><option>Lámina</option><option>Rollo</option><option>Caja</option><option>Unidad</option><option>Resma</option><option>Resmon</option></select></div>
              </div>
              <div class="field-group"><label>Descripción Corta</label><textarea id="new-product-description" class="field-textarea" rows="3" placeholder="Detalles técnicos y materiales..."></textarea></div>
              <div class="grid-2">
                <div class="field-group"><label>Precio (C$)</label><input id="new-product-price" class="field-input" placeholder="0.00" type="number" step="0.01" /></div>
              </div>
              <div style="display:flex; gap:0.65rem; margin-top:0.25rem;">
                <button id="save-new-product" class="cta-button" style="flex:1;">Guardar Producto</button>
                <button id="cancel-new-product" class="ghost-button" type="button">Cancelar</button>
              </div>
            </div>
          </div>
        </div>

        <div id="edit-product-modal" class="no-print" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:66; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card side-panel" style="width:100%; max-width:38rem; max-height:88vh; overflow:auto; position:static;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <h4>Editar Producto</h4>
                <p>Actualiza la información del artículo.</p>
              </div>
              <button id="close-edit-product-modal" class="round-button" type="button" aria-label="Cerrar formulario de edición de producto"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div class="field-group">
              <div class="field-group"><label>Nombre del Producto</label><input id="edit-product-name" class="field-input" placeholder="Ej: Agenda Ejecutiva 2024" type="text" /></div>
              <div class="grid-2">
                <div class="field-group"><label>Código (SKU)</label><input id="edit-product-sku" class="field-input" placeholder="ATL-000-XX" type="text" /></div>
                <div class="field-group"><label>Unidad de medida</label><select id="edit-product-category" class="field-select"><option value="">Selecciona</option><option>Pliego</option><option>Lámina</option><option>Rollo</option><option>Caja</option><option>Unidad</option><option>Resma</option><option>Resmon</option></select></div>
              </div>
              <div class="field-group"><label>Descripción Corta</label><textarea id="edit-product-description" class="field-textarea" rows="3" placeholder="Detalles técnicos y materiales..."></textarea></div>
              <div class="grid-2">
                <div class="field-group"><label>Precio (C$)</label><input id="edit-product-price" class="field-input" placeholder="0.00" type="number" step="0.01" /></div>
              </div>
              <div style="display:flex; gap:0.65rem; margin-top:0.25rem; flex-wrap:wrap;">
                <button id="delete-edit-product" class="ghost-button" type="button" style="flex:1; color:#ba1a1a; border-color:#ffc2c2; text-transform:uppercase; letter-spacing:0.12em; font-weight:800;">Eliminar</button>
                <button id="cancel-edit-product" class="ghost-button" type="button" style="flex:1; text-transform:uppercase; letter-spacing:0.12em; font-weight:800;">Cancelar</button>
                <button id="save-edit-product" class="cta-button" type="button" style="flex:1; text-transform:uppercase; letter-spacing:0.12em; font-weight:800;">Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  bind(root, navigate) {
    const search = root.querySelector('#catalog-search');
    const rowsHost = root.querySelector('#catalog-rows');
    const counter = root.querySelector('#catalog-count');
    const chips = Array.from(root.querySelectorAll('[data-unit-measure]'));
    const newProductModal = root.querySelector('#new-product-modal');
    const editProductModal = root.querySelector('#edit-product-modal');
    const api = window.appApi;
    let productRows = [];
    let currentEditProductId = null;

    const escapeHtml = (value) => String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const productFieldIds = {
      name: '#new-product-name',
      sku: '#new-product-sku',
      category: '#new-product-category',
      description: '#new-product-description',
      price: '#new-product-price',
    };

    const editFieldIds = {
      name: '#edit-product-name',
      sku: '#edit-product-sku',
      category: '#edit-product-category',
      description: '#edit-product-description',
      price: '#edit-product-price',
    };

    const clearProductForm = (prefix = 'new') => {
      const ids = prefix === 'new' ? productFieldIds : editFieldIds;
      Object.values(ids).forEach((selector) => {
        const element = root.querySelector(selector);
        if (!element) return;
        if (element.tagName === 'SELECT') {
          element.value = '';
        } else {
          element.value = '';
        }
      });
    };

    const readProductForm = (prefix = 'new') => {
      const ids = prefix === 'new' ? productFieldIds : editFieldIds;
      return {
        nombreProducto: root.querySelector(ids.name)?.value?.trim() || '',
        codigoProducto: root.querySelector(ids.sku)?.value?.trim() || '',
        unidadMedida: root.querySelector(ids.category)?.value?.trim() || '',
        descripcion: root.querySelector(ids.description)?.value?.trim() || '',
        precio: Number(root.querySelector(ids.price)?.value || 0),
      };
    };

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

    const loadProducts = async () => {
      if (!api?.listProducts) {
        return [];
      }

      try {
        return await api.listProducts();
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    const renderProducts = async () => {
      if (!rowsHost) return;
      const products = await loadProducts();
      productRows = products;

      if (products.length === 0) {
        rowsHost.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#73777e;">Sin productos cargados. Agrega uno desde "Nuevo Producto".</td></tr>';
        if (counter) counter.textContent = 'Mostrando 0 de 0 productos';
        return;
      }

      rowsHost.innerHTML = products.map((product) => {
        const sku = product.CodigoProducto || product.codigoProducto || product.sku || '';
        const name = product.NombreProducto || product.nombreProducto || product.name || '';
        const description = product.Descripcion || product.descripcion || product.description || '';
        const unitMeasure = product.UnidadMedida || product.unidadMedida || '';
        const price = Number(product.Precio ?? product.precio ?? 0).toFixed(2);
        const haystack = `${sku} ${name} ${description} ${price}`;
        return `
          <tr class="product-row" data-product-id="${escapeHtml(product.ProductID)}" data-unit-measure="${escapeHtml(unitMeasure)}" data-search="${escapeHtml(haystack)}">
            <td class="mono">${escapeHtml(sku)}</td>
            <td><strong style="color:#002542;">${escapeHtml(name)}</strong></td>
            <td>${escapeHtml(description)}</td>
            <td><strong>C$${price}</strong></td>
            <td><div class="row-actions"><button class="icon-button" type="button" data-product-action="edit" data-product-id="${escapeHtml(product.ProductID)}" aria-label="Editar producto"><span class="material-symbols-outlined">edit</span></button><button class="icon-button" type="button" data-product-action="delete" data-product-id="${escapeHtml(product.ProductID)}" aria-label="Eliminar producto"><span class="material-symbols-outlined">delete</span></button></div></td>
          </tr>
        `;
      }).join('');
    };

    const applyFilter = () => {
      const rows = Array.from(root.querySelectorAll('#catalog-rows .product-row'));
      const term = (search?.value || '').trim().toLowerCase();
      const activeUnitMeasure = (root.querySelector('[data-unit-measure].active')?.dataset.unitMeasure || 'all').toLowerCase();
      let visible = 0;

      rows.forEach((row) => {
        const haystack = (row.dataset.search || row.textContent || '').toLowerCase();
        const matchesText = !term || haystack.includes(term);
        const unitMeasure = (row.dataset.unitMeasure || '').toLowerCase();
        const matchesUnitMeasure = activeUnitMeasure === 'all' || unitMeasure.includes(activeUnitMeasure);
        const show = matchesText && matchesUnitMeasure;
        row.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });

      if (counter) counter.textContent = `Mostrando ${visible} de ${rows.length} productos`;
    };

    search?.addEventListener('input', applyFilter);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((button) => button.classList.remove('active'));
        chip.classList.add('active');
        applyFilter();
      });
    });

    const openNewProductModal = root.querySelector('#open-new-product-modal');
    const closeNewProductModal = () => hideModal(newProductModal);

    const closeEditProductModal = () => {
      currentEditProductId = null;
      hideModal(editProductModal);
    };

    const showNewProductModal = () => {
      clearProductForm('new');
      showModal(newProductModal);
    };

    const showEditProductModal = (product) => {
      if (!product) return;
      currentEditProductId = product.ProductID;
      root.querySelector('#edit-product-name').value = product.NombreProducto || product.nombreProducto || product.name || '';
      root.querySelector('#edit-product-sku').value = product.CodigoProducto || product.codigoProducto || product.sku || '';
      root.querySelector('#edit-product-category').value = product.UnidadMedida || product.unidadMedida || '';
      root.querySelector('#edit-product-description').value = product.Descripcion || product.descripcion || product.description || '';
      root.querySelector('#edit-product-price').value = Number(product.Precio ?? product.precio ?? product.price ?? 0);
      showModal(editProductModal);
    };

    const getProductById = (productId) => productRows.find((product) => String(product.ProductID) === String(productId)) || null;

    openNewProductModal?.addEventListener('click', showNewProductModal);
    root.querySelector('#close-new-product-modal')?.addEventListener('click', closeNewProductModal);
    root.querySelector('#cancel-new-product')?.addEventListener('click', closeNewProductModal);
    root.querySelector('#close-edit-product-modal')?.addEventListener('click', closeEditProductModal);
    root.querySelector('#cancel-edit-product')?.addEventListener('click', closeEditProductModal);
    root.querySelector('#delete-edit-product')?.addEventListener('click', async () => {
      if (!currentEditProductId) return;

      const product = getProductById(currentEditProductId);
      const confirmed = window.confirm(`¿Eliminar ${product?.NombreProducto || 'este producto'}? Se quitará del catálogo y del inventario. Si tiene movimientos o facturas, su historial se conserva.`);
      if (!confirmed) return;

      if (!api?.deleteProduct) {
        window.showAlert('La API no está disponible.');
        return;
      }

      try {
        await api.deleteProduct(currentEditProductId);
        await renderProducts();
        applyFilter();
        closeEditProductModal();
      } catch (error) {
        window.showAlert(error.message || 'No fue posible eliminar el producto.', 'error');
      }
    });

    newProductModal?.addEventListener('click', (event) => {
      if (event.target === newProductModal) closeNewProductModal();
    });

    editProductModal?.addEventListener('click', (event) => {
      if (event.target === editProductModal) closeEditProductModal();
    });

    rowsHost?.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-product-action]');
      if (!button) return;

      const product = getProductById(button.dataset.productId);
      if (!product) return;

      if (button.dataset.productAction === 'edit') {
        showEditProductModal(product);
        return;
      }

      if (button.dataset.productAction === 'delete') {
        const confirmed = window.confirm(`¿Eliminar ${product.NombreProducto || product.name || 'este producto'}? Se quitará del catálogo y del inventario. Si tiene movimientos o facturas, su historial se conserva.`);
        if (!confirmed) return;

        if (!api?.deleteProduct) {
          window.showAlert('La API no está disponible.');
          return;
        }

        try {
          await api.deleteProduct(product.ProductID);
          await renderProducts();
          applyFilter();
        } catch (error) {
          window.showAlert(error.message || 'No fue posible eliminar el producto.', 'error');
        }
      }
    });

    root.querySelector('#save-edit-product')?.addEventListener('click', async () => {
      if (!currentEditProductId) return;

      if (!api?.updateProduct) {
        window.showAlert('La API no está disponible.');
        return;
      }

      const payload = readProductForm('edit');
      if (!payload.nombreProducto || !payload.codigoProducto || !Number.isFinite(payload.precio)) {
        window.showAlert('Código, nombre y precio son obligatorios.');
        return;
      }

      try {
        await api.updateProduct(currentEditProductId, payload);
        await renderProducts();
        applyFilter();
        closeEditProductModal();
      } catch (error) {
        window.showAlert(error.message || 'No fue posible actualizar el producto.', 'error');
      }
    });

    root.querySelector('#save-new-product')?.addEventListener('click', async () => {
      const payload = readProductForm('new');

      if (!payload.nombreProducto || !payload.codigoProducto || !Number.isFinite(payload.precio)) {
        window.showAlert('Código, nombre y precio son obligatorios.');
        return;
      }

      if (!api?.createProduct) {
        window.showAlert('La API no está disponible.');
        return;
      }

      try {
        await api.createProduct(payload);
        await renderProducts();
        applyFilter();
        clearProductForm('new');
        closeNewProductModal();
      } catch (error) {
        window.showAlert(error.message || 'No fue posible guardar el producto.', 'error');
      }
    });

    const refreshCatalogData = async () => {
      if (!root.isConnected) return;
      await renderProducts();
      applyFilter();
    };

    refreshCatalogData();
  }
};

