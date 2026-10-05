window.inventoryView = {
  title: 'Inventario Multi-bodega',
  subtitle: 'Controla stock, ingresos y remisiones entre bodegas con una vista clara y operativa.',
  render() {
    return `
      <div class="view-wrap inventory-view">
        <div class="no-print" style="display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; margin-bottom:2rem; flex-wrap:wrap;">
          <div>
            <span class="eyebrow">Operaciones de Bodega</span>
            <h3 style="margin:0.25rem 0 0; font-size:2rem; color:#002542;">Inventario Multi-bodega</h3>
            <p style="margin:0.4rem 0 0; color:#43474d; max-width:62rem;">Administra el stock valorizado, registra ingresos y controla remisiones entre bodegas desde un solo panel.</p>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
          </div>
        </div>

        <div class="grid grid-cols-12 gap-6" style="display:grid; grid-template-columns:repeat(12, minmax(0, 1fr)); gap:1.5rem; align-items:start;">
          <div class="catalog-card" style="grid-column:span 12 / span 12; padding:1.25rem; display:grid; grid-template-columns:repeat(12, minmax(0, 1fr)); gap:1rem;">
            <div style="grid-column:span 12 / span 12; display:grid; grid-template-columns:repeat(12, minmax(0, 1fr)); gap:1rem;">
              <div style="grid-column:span 12 / span 12; display:grid; grid-template-columns:repeat(12, minmax(0, 1fr)); gap:1rem;">
                <div class="catalog-card" style="grid-column:span 12 / span 12; padding:1.25rem; box-shadow:none; background:#ffffff; border:1px solid rgba(195,198,206,0.35); display:flex; justify-content:space-between; align-items:flex-end;">
                  <div>
                    <p style="margin:0 0 0.35rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.68rem; font-weight:800; color:#73777e;">Stock Valorizado</p>
                    <h4 id="inventory-stock-kpi" style="margin:0; font-size:2rem; color:#002542;">--</h4>
                  </div>
                </div>
                <button id="open-incoming-modal" class="cta-button" type="button" style="grid-column:span 4 / span 4; border-radius:1rem; padding:1.25rem; display:flex; align-items:center; justify-content:center; gap:0.8rem; font-size:1rem; min-height:5.5rem;">
                  <span class="material-symbols-outlined" style="font-size:2rem;">add_shopping_cart</span>
                  <span style="text-align:left; display:grid;">
                    <span style="font-weight:800;">Registrar Ingreso</span>
                    <span style="font-size:0.75rem; opacity:0.8; font-weight:500;">Añadir mercancía a bodega</span>
                  </span>
                </button>
                <button id="open-remission-modal" class="ghost-button" type="button" style="grid-column:span 4 / span 4; background:#e6e8ea; color:#002542; border:1px solid rgba(195,198,206,0.35); border-radius:1rem; padding:1.25rem; display:flex; align-items:center; justify-content:center; gap:0.8rem; font-size:1rem; min-height:5.5rem;">
                  <span class="material-symbols-outlined" style="font-size:2rem;">local_shipping</span>
                  <span style="text-align:left; display:grid;">
                    <span style="font-weight:800;">Nueva Remisión</span>
                    <span style="font-size:0.75rem; opacity:0.8; font-weight:500;">Movimiento entre bodegas</span>
                  </span>
                </button>
                <button id="open-min-stock-modal" class="ghost-button" type="button" style="grid-column:span 4 / span 4; background:#f3e5f5; color:#4a148c; border:1px solid rgba(195,198,206,0.35); border-radius:1rem; padding:1.25rem; display:flex; align-items:center; justify-content:center; gap:0.8rem; font-size:1rem; min-height:5.5rem;">
                  <span class="material-symbols-outlined" style="font-size:2rem;">local_fire_department</span>
                  <span style="text-align:left; display:grid;">
                    <span style="font-weight:800;">Stock Mínimo</span>
                    <span style="font-size:0.75rem; opacity:0.8; font-weight:500;">Configurar alertas por producto</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <section style="grid-column:span 12 / span 12; display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1.5rem;">
            <div class="catalog-card" style="padding:1rem;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; gap:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span class="material-symbols-outlined" style="color:#002542;">warehouse</span>
                  <h4 style="margin:0; color:#002542; font-size:1rem;">Bodega Principal (Norte)</h4>
                </div>
                <span class="chip active" data-capacity-chip="Bodega Principal" style="border-radius:9999px; padding:0.25rem 0.7rem; font-size:0.7rem;">--</span>
              </div>
              <div style="margin-bottom:0.75rem;">
                <input id="warehouse-principal-search" class="search-input" type="text" placeholder="Buscar por producto, SKU..." style="width:100%; padding:0.5rem; border:1px solid #e6e8ea; border-radius:0.5rem; font-size:0.9rem;" />
              </div>
              <div class="table-wrap" style="max-height:22rem; overflow-y:auto; border:1px solid #e6e8ea; border-radius:0.5rem;">
                <table class="invoice-table" style="margin-bottom:0;">
                  <thead style="position:sticky; top:0; background:#ffffff; z-index:10;">
                    <tr>
                      <th>Producto</th>
                      <th>SKU</th>
                      <th style="text-align:right;">Existencia</th>
                      <th style="text-align:center;">Estado</th>
                    </tr>
                  </thead>
                  <tbody data-warehouse-name="Bodega Principal">
                    <tr><td colspan="4" style="text-align:center; color:#73777e;">Sin existencias cargadas.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="catalog-card" style="padding:1rem;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; gap:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span class="material-symbols-outlined" style="color:#002542;">storefront</span>
                  <h4 style="margin:0; color:#002542; font-size:1rem;">Bodega Local (Centro)</h4>
                </div>
                <span class="chip active" data-capacity-chip="Bodega Local (Centro)" style="border-radius:9999px; padding:0.25rem 0.7rem; font-size:0.7rem;">--</span>
              </div>
              <div style="margin-bottom:0.75rem;">
                <input id="warehouse-local-search" class="search-input" type="text" placeholder="Buscar por producto, SKU..." style="width:100%; padding:0.5rem; border:1px solid #e6e8ea; border-radius:0.5rem; font-size:0.9rem;" />
              </div>
              <div class="table-wrap" style="max-height:22rem; overflow-y:auto; border:1px solid #e6e8ea; border-radius:0.5rem;">
                <table class="invoice-table" style="margin-bottom:0;">
                  <thead style="position:sticky; top:0; background:#ffffff; z-index:10;">
                    <tr>
                      <th>Producto</th>
                      <th>SKU</th>
                      <th style="text-align:right;">Existencia</th>
                      <th style="text-align:center;">Estado</th>
                    </tr>
                  </thead>
                  <tbody data-warehouse-name="Bodega Local (Centro)">
                    <tr><td colspan="4" style="text-align:center; color:#73777e;">Sin existencias cargadas.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section style="grid-column:span 12 / span 12;">
            <div class="catalog-card" style="padding:1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; gap:1rem;">
                <h4 style="margin:0; font-size:1.15rem; color:#002542;">Historial de Remisiones</h4>
                <button id="open-remission-history-modal" class="ghost-button" type="button" style="color:#1b3b5a; font-weight:700;">Ver todo el historial</button>
              </div>
              <div id="remission-history-preview" style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:1rem; color:#73777e;">Sin remisiones cargadas.</div>
            </div>
          </section>

          <section style="grid-column:span 12 / span 12;">
            <div class="catalog-card" style="padding:1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; gap:1rem;">
                <h4 style="margin:0; font-size:1.15rem; color:#002542;">Historial de Ingresos</h4>
                <button id="open-incoming-history-modal" class="ghost-button" type="button" style="color:#1b3b5a; font-weight:700;">Ver todo el historial</button>
              </div>
              <div id="incoming-history-preview" style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:1rem; color:#73777e;">Sin ingresos cargados.</div>
            </div>
          </section>
        </div>

        <div id="inventory-remission-modal" class="inventory-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.2); backdrop-filter:blur(10px); z-index:60; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.3s ease;">
          <div class="catalog-card" style="width:100%; max-width:56rem; overflow:hidden; border-radius:1.25rem;">
            <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e6e8ea; display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.25rem; color:#002542;">Nueva Remisión de Stock</h4>
                <p style="margin:0.35rem 0 0; color:#43474d; font-size:0.82rem;">Mover existencias entre ubicaciones de confianza</p>
              </div>
              <button class="icon-button inventory-modal-close" type="button"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div style="padding:1.5rem; display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem;">
              <div class="field-group">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Bodega Origen</label>
                <select class="field-select" id="remission-origin-warehouse">
                  <option>Bodega Principal</option>
                  <option>Bodega Local (Centro)</option>
                </select>
              </div>
              <div class="field-group">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Bodega Destino</label>
                <select class="field-select" id="remission-target-warehouse">
                  <option>Bodega Local (Centro)</option>
                  <option>Bodega Principal</option>
                </select>
              </div>

              <div class="field-group">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Cantidad a Remitir</label>
                <input id="remission-qty" class="field-input" type="number" min="1" value="1" />
              </div>

              <div class="field-group" style="grid-column:span 2 / span 2;">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Buscar Producto por Código</label>
                <div style="position:relative;">
                  <input id="remission-product-search" class="search-input" type="text" placeholder="Ej: ATL-045, LB-LN, WT-BT..." autocomplete="off" />
                  <div id="remission-product-dropdown" style="position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #e6e8ea; border-radius:0.5rem; max-height:300px; overflow-y:auto; display:none; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Los resultados aparecerán aquí -->
                  </div>
                </div>
                <div id="remission-product-match" class="field-input" style="margin-top:0.5rem; min-height:2.8rem; display:flex; align-items:center; color:#43474d;">Escribe un código para buscar el producto más parecido.</div>
              </div>

              <div style="grid-column:span 2 / span 2; display:flex; justify-content:flex-end;">
                <button id="add-remission-item" class="cta-button" type="button">Agregar Producto con Cantidad</button>
              </div>

              <div class="field-group" style="grid-column:span 2 / span 2; gap:0.7rem;">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Productos a Remitir</label>
                <div id="remission-items" style="display:grid; gap:0.65rem;"></div>
              </div>
            </div>
            <div style="padding:1rem 1.5rem 1.5rem; display:flex; justify-content:flex-end; gap:0.75rem; background:#f2f4f6;">
              <button class="ghost-button inventory-modal-close" type="button">Cancelar</button>
              <button id="execute-remission-move" class="cta-button" type="button">Ejecutar Movimiento</button>
            </div>
          </div>
        </div>

        <div id="inventory-incoming-modal" class="inventory-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.2); backdrop-filter:blur(10px); z-index:60; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.3s ease;">
          <div class="catalog-card" style="width:100%; max-width:56rem; overflow:hidden; border-radius:1.25rem;">
            <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e6e8ea; display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.25rem; color:#002542;">Nuevo Ingreso de Inventario</h4>
                <p style="margin:0.35rem 0 0; color:#43474d; font-size:0.82rem;">Busca productos por código y registra cantidades de entrada</p>
              </div>
              <button class="icon-button inventory-modal-close" type="button"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div style="padding:1.5rem; display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem;">
              <div class="field-group">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Bodega Destino</label>
                <select class="field-select" id="incoming-target-warehouse">
                  <option>Bodega Principal</option>
                  <option>Bodega Local (Centro)</option>
                </select>
              </div>
              <div class="field-group">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Cantidad a Ingresar</label>
                <input id="incoming-qty" class="field-input" type="number" min="1" value="1" />
              </div>
              <div class="field-group">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Costo Unitario</label>
                <input id="incoming-cost" class="field-input" type="number" min="0" step="0.01" value="0" placeholder="Costo por unidad" />
              </div>
              <div style="display:flex; align-items:flex-end;">
                <div class="field-group" style="width:100%;">
                  <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Costo Total</label>
                  <div id="incoming-total-cost" class="field-input" style="background:#f2f4f6; display:flex; align-items:center; justify-content:flex-end; font-weight:700; color:#002542;">$0.00</div>
                </div>
              </div>

              <div class="field-group" style="grid-column:span 2 / span 2;">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Buscar Proveedor</label>
                <div style="position:relative;">
                  <input id="incoming-provider-search" class="search-input" type="text" placeholder="Ej: Distribuidora Central, Suministros..." autocomplete="off" />
                  <div id="incoming-provider-dropdown" style="position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #e6e8ea; border-radius:0.5rem; max-height:240px; overflow-y:auto; display:none; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);"></div>
                </div>
                <div id="incoming-provider-match" class="field-input" style="margin-top:0.5rem; min-height:2.8rem; display:flex; align-items:center; color:#43474d;">Escribe el nombre del proveedor para buscar.</div>
              </div>

              <div class="field-group" style="grid-column:span 2 / span 2;">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Buscar Producto por Código</label>
                <div style="position:relative;">
                  <input id="incoming-product-search" class="search-input" type="text" placeholder="Ej: ATL-045, LB-LN, WT-BT..." autocomplete="off" />
                  <div id="incoming-product-dropdown" style="position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #e6e8ea; border-radius:0.5rem; max-height:300px; overflow-y:auto; display:none; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Los resultados aparecerán aquí -->
                  </div>
                </div>
                <div id="incoming-product-match" class="field-input" style="margin-top:0.5rem; min-height:2.8rem; display:flex; align-items:center; color:#43474d;">Escribe un código para buscar el producto más parecido.</div>
              </div>

              <div style="grid-column:span 2 / span 2; display:flex; justify-content:flex-end;">
                <button id="add-incoming-item" class="cta-button" type="button">Agregar Producto con Cantidad</button>
              </div>

              <div class="field-group" style="grid-column:span 2 / span 2; gap:0.7rem;">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Productos a Ingresar</label>
                <div id="incoming-items" style="display:grid; gap:0.65rem; max-height:12rem; overflow-y:auto; padding-right:0.2rem;"></div>
              </div>

              <div class="field-group" style="grid-column:span 2 / span 2;">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Stock Mínimo (Opcional)</label>
                <input id="incoming-stock-minimo" class="field-input" type="number" min="0" value="" placeholder="Ej: 10 (dejar vacío para no modificar)" />
                <p style="margin:0.35rem 0 0; color:#73777e; font-size:0.75rem;">Si lo ingresa, se actualizará el stock mínimo para este producto en esta bodega.</p>
              </div>
            </div>
            <div style="padding:1rem 1.5rem 1.5rem; display:flex; justify-content:flex-end; gap:0.75rem; background:#f2f4f6;">
              <button class="ghost-button inventory-modal-close" type="button">Cancelar</button>
              <button id="confirm-incoming-stock" class="cta-button" type="button">Confirmar Ingreso</button>
            </div>
          </div>
        </div>

        <div id="remission-history-modal" class="inventory-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.2); backdrop-filter:blur(10px); z-index:60; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.3s ease;">
          <div class="catalog-card" style="width:100%; max-width:62rem; overflow:hidden; border-radius:1.25rem; max-height:88vh; display:grid; grid-template-rows:auto 1fr auto;">
            <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e6e8ea; display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.25rem; color:#002542;">Historial Completo de Remisiones</h4>
                <p style="margin:0.35rem 0 0; color:#43474d; font-size:0.82rem;">Consulta cada movimiento entre bodegas.</p>
              </div>
              <button class="icon-button inventory-modal-close" type="button"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div style="padding:1rem 1.5rem; overflow:auto;">
              <div class="table-wrap">
                <table class="invoice-table">
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Fecha</th>
                      <th>Origen</th>
                      <th>Destino</th>
                      <th>Detalle</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colspan="6" style="text-align:center; color:#73777e;">Sin historial de remisiones cargado.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style="padding:1rem 1.5rem 1.5rem; display:flex; justify-content:flex-end; gap:0.75rem; background:#f2f4f6;">
              <button class="ghost-button inventory-modal-close" type="button">Cerrar</button>
              <button id="print-remission-history-report" class="cta-button" type="button">Crear Reporte</button>
            </div>
          </div>
        </div>

        <div id="incoming-history-modal" class="inventory-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.2); backdrop-filter:blur(10px); z-index:60; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.3s ease;">
          <div class="catalog-card" style="width:100%; max-width:62rem; overflow:hidden; border-radius:1.25rem; max-height:88vh; display:grid; grid-template-rows:auto 1fr auto;">
            <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e6e8ea; display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.25rem; color:#002542;">Historial Completo de Ingresos</h4>
                <p style="margin:0.35rem 0 0; color:#43474d; font-size:0.82rem;">Consulta todos los ingresos registrados por bodega.</p>
              </div>
              <button class="icon-button inventory-modal-close" type="button"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div style="padding:1rem 1.5rem; overflow:auto;">
              <div class="table-wrap">
                <table class="invoice-table">
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Fecha</th>
                      <th>Bodega</th>
                      <th>Proveedor</th>
                      <th>Producto</th>
                      <th style="text-align:center;">Cantidad</th>
                      <th style="text-align:right;">Costo Unitario</th>
                      <th style="text-align:right;">Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colspan="9" style="text-align:center; color:#73777e;">Sin historial de ingresos cargado.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style="padding:1rem 1.5rem 1.5rem; display:flex; justify-content:flex-end; gap:0.75rem; background:#f2f4f6;">
              <button class="ghost-button inventory-modal-close" type="button">Cerrar</button>
              <button id="print-incoming-history-report" class="cta-button" type="button">Crear Reporte</button>
            </div>
          </div>
        </div>

        <div id="inventory-min-stock-modal" class="inventory-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.2); backdrop-filter:blur(10px); z-index:60; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.3s ease;">
          <div class="catalog-card" style="width:100%; max-width:56rem; overflow:hidden; border-radius:1.25rem;">
            <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e6e8ea; display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.25rem; color:#002542;">Gestionar Stock Mínimo</h4>
                <p style="margin:0.35rem 0 0; color:#43474d; font-size:0.82rem;">Ajusta el stock mínimo de alerta para cada producto en bodega</p>
              </div>
              <button class="icon-button inventory-modal-close" type="button" data-modal-id="inventory-min-stock-modal"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div style="padding:1.5rem; display:grid; gap:1rem;">
              <div class="field-group" style="grid-column:span 2 / span 2;">
                <label style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.16em; color:#73777e;">Buscar Producto</label>
                <input id="min-stock-search" class="search-input" type="text" placeholder="Busca por código o nombre del producto..." />
              </div>

              <div style="max-height:400px; overflow-y:auto; border:1px solid #e6e8ea; border-radius:0.5rem;">
                <div id="min-stock-products-list" style="display:grid; gap:0;">
                  <div style="padding:1rem; text-align:center; color:#73777e;">Ingresa un término de búsqueda para ver productos disponibles.</div>
                </div>
              </div>
            </div>
            <div style="padding:1rem 1.5rem 1.5rem; display:flex; justify-content:flex-end; gap:0.75rem; background:#f2f4f6;">
              <button class="ghost-button inventory-modal-close" type="button" data-modal-id="inventory-min-stock-modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  bind(root) {
    const api = window.appApi;
    const loadCatalogProducts = async () => {
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

    const remissionModal = root.querySelector('#inventory-remission-modal');
    const incomingModal = root.querySelector('#inventory-incoming-modal');
    const remissionHistoryModal = root.querySelector('#remission-history-modal');
    const incomingHistoryModal = root.querySelector('#incoming-history-modal');
    const openRemissionButton = root.querySelector('#open-remission-modal');
    const openIncomingButton = root.querySelector('#open-incoming-modal');
    const openRemissionHistoryButton = root.querySelector('#open-remission-history-modal');
    const openIncomingHistoryButton = root.querySelector('#open-incoming-history-modal');

    const setModalState = (modal, isOpen) => {
      if (!modal) return;
      if (!isOpen) {
        const activeElement = document.activeElement;
        if (activeElement && modal.contains(activeElement) && typeof activeElement.blur === 'function') {
          activeElement.blur();
        }
      }
      modal.style.opacity = isOpen ? '1' : '0';
      modal.style.pointerEvents = isOpen ? 'auto' : 'none';
      modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    };

    const closeModal = (modal) => setModalState(modal, false);
    const openModal = (modal) => setModalState(modal, true);

    const attachCloseHandlers = (modal) => {
      if (!modal) return;
      modal.querySelectorAll('.inventory-modal-close').forEach((button) => {
        button.addEventListener('click', () => closeModal(modal));
      });
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal(modal);
      });
    };

    attachCloseHandlers(remissionModal);
    attachCloseHandlers(incomingModal);
    attachCloseHandlers(remissionHistoryModal);
    attachCloseHandlers(incomingHistoryModal);

    const remissionQty = root.querySelector('#remission-qty');
    const remissionSearch = root.querySelector('#remission-product-search');
    const remissionMatch = root.querySelector('#remission-product-match');
    const remissionItems = root.querySelector('#remission-items');
    const addRemissionItemButton = root.querySelector('#add-remission-item');

    let currentRemissionMatch = null;
    let currentIncomingMatch = null;
    let currentIncomingProviderMatch = null;

    const incomingProviderSearch = root.querySelector('#incoming-provider-search');
    const incomingProviderMatch = root.querySelector('#incoming-provider-match');
    const incomingSearch = root.querySelector('#incoming-product-search');
    const incomingQty = root.querySelector('#incoming-qty');
    const incomingCost = root.querySelector('#incoming-cost');
    const incomingTotalCost = root.querySelector('#incoming-total-cost');
    const incomingMatch = root.querySelector('#incoming-product-match');
    const addIncomingItemButton = root.querySelector('#add-incoming-item');
    const incomingItems = root.querySelector('#incoming-items');
    const inventoryStockKpi = root.querySelector('#inventory-stock-kpi');
    const inventoryTables = Array.from(root.querySelectorAll('.invoice-table tbody'));
    console.log('[Inventory] Elementos encontrados:', { 
      inventoryStockKpi: !!inventoryStockKpi,
      inventoryTables: inventoryTables.length,
      tablas: inventoryTables.map(t => ({ 
        warehouseName: t.dataset.warehouseName,
        exists: !!t 
      }))
    });
    const remissionHistoryBody = inventoryTables[2];
    const incomingHistoryBody = inventoryTables[3];
    const remissionConfirmButton = root.querySelector('#execute-remission-move');
    const incomingConfirmButton = root.querySelector('#confirm-incoming-stock');
    const remissionOriginWarehouse = root.querySelector('#remission-origin-warehouse');
    const remissionTargetWarehouse = root.querySelector('#remission-target-warehouse');
    const incomingTargetWarehouse = root.querySelector('#incoming-target-warehouse');
    const remissionHistoryPreview = root.querySelector('#remission-history-preview');
    const incomingHistoryPreview = root.querySelector('#incoming-history-preview');
    const warehouseCapacityChips = Array.from(root.querySelectorAll('[data-capacity-chip]'));
    const warehousePrincipalSearch = root.querySelector('#warehouse-principal-search');
    const warehouseLocalSearch = root.querySelector('#warehouse-local-search');
    const minStockModal = root.querySelector('#inventory-min-stock-modal');
    const minStockSearch = root.querySelector('#min-stock-search');
    const minStockProductsList = root.querySelector('#min-stock-products-list');
    const openMinStockModalButton = root.querySelector('#open-min-stock-modal');
    const incomingStockMinimo = root.querySelector('#incoming-stock-minimo');

    let warehousePrincipalData = [];
    let warehouseLocalData = [];
    let minStockProductsCache = [];

    // Adjuntar manejadores de cierre a minStockModal después de declararlo
    if (minStockModal) {
      attachCloseHandlers(minStockModal);
    }

    const escapeHtml = (value) => String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const normalizeWarehouseName = (value) => String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s*\([^)]*\)\s*/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const formatMoney = (value) => `C$${Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatDateTime = (value) => new Date(value).toLocaleString('es-ES');

    const populateWarehouseSelect = (selectElement, warehouses, preferredValue) => {
      if (!selectElement) return;

      const previousValue = selectElement.value;
      const options = (warehouses || []).map((warehouse) => {
        const name = warehouse.NombreBodega || `Bodega ${warehouse.BodegaID}`;
        return `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`;
      });

      selectElement.innerHTML = options.join('');

      if (previousValue && (warehouses || []).some((warehouse) => (warehouse.NombreBodega || '') === previousValue)) {
        selectElement.value = previousValue;
      } else if (preferredValue && (warehouses || []).some((warehouse) => (warehouse.NombreBodega || '') === preferredValue)) {
        selectElement.value = preferredValue;
      }
    };

    // Función debounce - Declarar ANTES de usarla
    const debounce = (fn, delay = 300) => {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };

    const filterAndRenderWarehouse = (searchInput, bodyElement, allData) => {
      if (!searchInput || !bodyElement) return;

      const searchTerm = searchInput.value.trim().toLowerCase();
      let filtered = allData;

      if (searchTerm) {
        filtered = allData.filter((row) => {
          const nombre = String(row.NombreProducto || '').toLowerCase();
          const codigo = String(row.CodigoProducto || '').toLowerCase();
          return nombre.includes(searchTerm) || codigo.includes(searchTerm);
        });
      }

      if (filtered.length === 0) {
        bodyElement.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#73777e;">Sin productos coinciden con la búsqueda.</td></tr>';
        return;
      }

      bodyElement.innerHTML = filtered.map((row) => `
        <tr>
          <td>${escapeHtml(row.NombreProducto)}</td>
          <td>${escapeHtml(row.CodigoProducto)}</td>
          <td style="text-align:right;">${Number(row.Existencia || 0)}</td>
          <td style="text-align:center; color:${Number(row.Existencia || 0) < 10 ? '#ba1a1a' : '#002a05'}; font-weight:700;">${escapeHtml(row.Estado)}</td>
        </tr>
      `).join('');
    };

    const renderInventoryTables = async () => {
      console.log('[Inventory] renderInventoryTables iniciado');
      const inventory = api?.listInventory ? await api.listInventory().catch((e) => { console.error('[Inventory] Error listInventory:', e); return []; }) : [];
      console.log('[Inventory] Datos inventario:', inventory);
      const warehouses = api?.listWarehouses ? await api.listWarehouses().catch((e) => { console.error('[Inventory] Error listWarehouses:', e); return []; }) : [];
      console.log('[Inventory] Bodegas:', warehouses);
      const incomingHistory = api?.listIncoming ? await api.listIncoming().catch((e) => { console.error('[Inventory] Error listIncoming:', e); return []; }) : [];
      const remissionsHistory = api?.listRemissions ? await api.listRemissions().catch((e) => { console.error('[Inventory] Error listRemissions:', e); return []; }) : [];

      populateWarehouseSelect(remissionOriginWarehouse, warehouses, 'Bodega Principal');
      populateWarehouseSelect(remissionTargetWarehouse, warehouses, 'Bodega Local (Centro)');
      populateWarehouseSelect(incomingTargetWarehouse, warehouses, 'Bodega Principal');

      if (inventoryStockKpi) {
        const totalValue = inventory.reduce((sum, row) => sum + (Number(row.Existencia || 0) * Number(row.Precio || 0)), 0);
        inventoryStockKpi.textContent = formatMoney(totalValue);
      }

      const byWarehouse = new Map();
      inventory.forEach((row) => {
        const key = row.NombreBodega || `Bodega ${row.BodegaID}`;
        if (!byWarehouse.has(key)) {
          byWarehouse.set(key, []);
        }
        byWarehouse.get(key).push(row);
      });

      const findWarehouseRows = (warehouseName) => {
        const normalizedTarget = normalizeWarehouseName(warehouseName);
        if (!normalizedTarget) return [];

        const exactMatch = byWarehouse.get(warehouseName);
        if (exactMatch && exactMatch.length) {
          return exactMatch;
        }

        const normalizedExact = Array.from(byWarehouse.entries()).find(([name]) => normalizeWarehouseName(name) === normalizedTarget);
        if (normalizedExact?.[1]) {
          return normalizedExact[1];
        }

        const partialMatch = Array.from(byWarehouse.entries()).find(([name]) => {
          const normalizedName = normalizeWarehouseName(name);
          return normalizedName === normalizedTarget
            || normalizedName.startsWith(normalizedTarget)
            || normalizedTarget.startsWith(normalizedName);
        });

        return partialMatch?.[1] || [];
      };

      warehouseCapacityChips.forEach((chip) => {
        const warehouseName = (chip.dataset.capacityChip || '').trim();
        const warehouseRows = findWarehouseRows(warehouseName);
        const ocupacion = warehouseRows.reduce((sum, row) => sum + Math.max(0, Number(row.Existencia || 0)), 0);

        chip.textContent = `${ocupacion} u`;
        chip.style.background = '#e6e8ea';
        chip.style.color = '#43474d';
        chip.style.borderColor = '#c3c6ce';
      });

      const warehouseBodies = inventoryTables.slice(0, 2);
      warehouseBodies.forEach((body) => {
        if (!body) return;

        const preferredWarehouseName = (body.dataset.warehouseName || '').trim();
        const rows = preferredWarehouseName
          ? findWarehouseRows(preferredWarehouseName).filter((row) => Number(row.Existencia || 0) > 0)
          : [];

        if (preferredWarehouseName === 'Bodega Principal') {
          warehousePrincipalData = rows;
        } else if (preferredWarehouseName === 'Bodega Local (Centro)') {
          warehouseLocalData = rows;
        }

        if (rows.length === 0) {
          body.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#73777e;">Sin existencias disponibles (stock > 0).</td></tr>';
          return;
        }

        body.innerHTML = rows.map((row) => `
          <tr>
            <td>${escapeHtml(row.NombreProducto)}</td>
            <td>${escapeHtml(row.CodigoProducto)}</td>
            <td style="text-align:right;">${Number(row.Existencia || 0)}</td>
            <td style="text-align:center; color:${Number(row.Existencia || 0) < 10 ? '#ba1a1a' : '#002a05'}; font-weight:700;">${escapeHtml(row.Estado)}</td>
          </tr>
        `).join('');
      });

      if (remissionHistoryBody) {
        if (remissionsHistory.length === 0) {
          remissionHistoryBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#73777e;">Sin historial de remisiones cargado.</td></tr>';
        } else {
          remissionHistoryBody.innerHTML = remissionsHistory.map((item) => `
            <tr>
              <td>#${item.RemisionID}</td>
              <td>${new Date(item.FechaRemision).toLocaleString('es-ES')}</td>
              <td>${escapeHtml(item.NombreOrigen)}</td>
              <td>${escapeHtml(item.NombreDestino)}</td>
              <td>${escapeHtml(item.CodigoProducto)} - ${escapeHtml(item.NombreProducto)} (${Number(item.Cantidad || 0)})</td>
              <td>Registrada</td>
            </tr>
          `).join('');
        }
      }

      if (incomingHistoryBody) {
        if (incomingHistory.length === 0) {
          incomingHistoryBody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#73777e;">Sin historial de ingresos cargado.</td></tr>';
        } else {
          incomingHistoryBody.innerHTML = incomingHistory.map((item) => `
            <tr>
              <td>#${item.IngresoID}</td>
              <td>${new Date(item.FechaIngreso).toLocaleString('es-ES')}</td>
              <td>${escapeHtml(item.NombreBodega)}</td>
              <td>${escapeHtml(item.NombreProveedor || 'N/D')}</td>
              <td>${escapeHtml(item.CodigoProducto)} - ${escapeHtml(item.NombreProducto)}</td>
              <td style="text-align:center;">${Number(item.Cantidad || 0)}</td>
              <td style="text-align:right;">${formatMoney(item.Costo || 0)}</td>
              <td style="text-align:right;">${formatMoney(item.TotalCosto || 0)}</td>
              <td>Registrado</td>
            </tr>
          `).join('');
        }
      }

      if (remissionHistoryPreview) {
        const preview = remissionsHistory.slice(0, 3);
        if (preview.length === 0) {
          remissionHistoryPreview.innerHTML = 'Sin remisiones cargadas.';
        } else {
          remissionHistoryPreview.innerHTML = preview.map((item) => `
            <div class="field-input" style="display:grid; gap:0.25rem; color:#1b3b5a;">
              <strong style="color:#002542;">#${item.RemisionID} · ${escapeHtml(item.CodigoProducto)}</strong>
              <span style="font-size:0.82rem; color:#43474d;">${escapeHtml(item.NombreOrigen)} → ${escapeHtml(item.NombreDestino)}</span>
              <span style="font-size:0.78rem; color:#73777e;">${Number(item.Cantidad || 0)} unidades · ${formatDateTime(item.FechaRemision)}</span>
            </div>
          `).join('');
        }
      }

      if (incomingHistoryPreview) {
        const preview = incomingHistory.slice(0, 3);
        if (preview.length === 0) {
          incomingHistoryPreview.innerHTML = 'Sin ingresos cargados.';
        } else {
          incomingHistoryPreview.innerHTML = preview.map((item) => `
            <div class="field-input" style="display:grid; gap:0.25rem; color:#1b3b5a;">
              <strong style="color:#002542;">#${item.IngresoID} · ${escapeHtml(item.CodigoProducto)}</strong>
              <span style="font-size:0.82rem; color:#43474d;">${escapeHtml(item.NombreBodega)} · ${escapeHtml(item.NombreProducto)} · Prov: ${escapeHtml(item.NombreProveedor || 'N/D')}</span>
              <span style="font-size:0.78rem; color:#73777e;">${Number(item.Cantidad || 0)} unidades · ${formatDateTime(item.FechaIngreso)}</span>
            </div>
          `).join('');
        }
      }
    };

    const findClosestProduct = (products, query) => {
      const normalized = (query || '').trim().toUpperCase();
      if (!normalized) return null;

      const catalogProducts = products || [];
      if (catalogProducts.length === 0) return null;

      const scored = catalogProducts.map((product) => {
        const sku = (product.CodigoProducto || product.codigoProducto || product.sku || '').toUpperCase();
        let score = 0;
        if (sku === normalized) score = 100;
        else if (sku.startsWith(normalized)) score = 80 - (sku.length - normalized.length);
        else if (sku.includes(normalized)) score = 60 - sku.indexOf(normalized);
        else {
          let prefix = 0;
          while (prefix < normalized.length && prefix < sku.length && normalized[prefix] === sku[prefix]) {
            prefix += 1;
          }
          score = prefix * 10;
        }
        return { product, score };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored[0].score > 0 ? scored[0].product : null;
    };

    const getProductCode = (product) => product?.CodigoProducto || product?.codigoProducto || product?.sku || '';

    const renderIncomingItems = () => {
      if (!incomingItems) return;
      if (incomingItems.children.length === 0) {
        incomingItems.innerHTML = '<div class="field-input" data-empty="true" style="color:#73777e;">Aún no hay productos agregados.</div>';
      }
    };

    const renderRemissionItems = () => {
      if (!remissionItems) return;
      if (remissionItems.children.length === 0) {
        remissionItems.innerHTML = '<div class="field-input" data-empty="true" style="color:#73777e;">Aún no hay productos agregados.</div>';
      }
    };

    let cachedProducts = [];
    let cachedProviders = [];

    const refreshCatalogCache = async () => {
      cachedProducts = await loadCatalogProducts();
    };

    const refreshProvidersCache = async () => {
      cachedProviders = api?.listProviders ? await api.listProviders().catch(() => []) : [];
    };

    const remissionProductDropdown = root.querySelector('#remission-product-dropdown');

    const performRemissionSearch = async (query) => {
      if (!query || query.trim().length < 1) {
        remissionProductDropdown.style.display = 'none';
        remissionMatch.textContent = 'Escribe un código o nombre para buscar.';
        currentRemissionMatch = null;
        return;
      }

      try {
        const results = await window.appApi.searchProducts(query);
        
        if (!Array.isArray(results) || results.length === 0) {
          remissionProductDropdown.style.display = 'none';
          remissionMatch.textContent = 'No se encontraron productos. Intenta con otra búsqueda.';
          currentRemissionMatch = null;
          return;
        }

        // Mostrar dropdown con resultados
        remissionProductDropdown.innerHTML = results.map((product, idx) => `
          <div class="search-result-item" data-index="${idx}" style="padding:0.75rem 1rem; border-bottom:1px solid #f0f0f0; cursor:pointer; transition:background 0.2s;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <strong style="color:#002542;">${escapeHtml(product.CodigoProducto)}</strong>
                <div style="color:#43474d; font-size:0.82rem; margin-top:0.2rem;">${escapeHtml(product.NombreProducto)}</div>
                <div style="color:#73777e; font-size:0.75rem; margin-top:0.2rem;">PPP: <strong>C$${Number(product.Precio || 0).toFixed(2)}</strong></div>
              </div>
            </div>
          </div>
        `).join('');

        // Agregar hover effect
        Array.from(remissionProductDropdown.querySelectorAll('.search-result-item')).forEach((item) => {
          item.addEventListener('mouseenter', () => item.style.background = '#f2f4f6');
          item.addEventListener('mouseleave', () => item.style.background = 'white');
          item.addEventListener('click', () => {
            const idx = Number(item.dataset.index);
            const selected = results[idx];
            if (selected) {
              currentRemissionMatch = selected;
              remissionSearch.value = selected.CodigoProducto;
              remissionMatch.innerHTML = `<strong style="color:#002542;">${escapeHtml(selected.CodigoProducto)}</strong> - ${escapeHtml(selected.NombreProducto)}`;
              remissionProductDropdown.style.display = 'none';
            }
          });
        });

        remissionProductDropdown.style.display = 'block';
      } catch (error) {
        console.error('[SearchRemissionProducts] Error:', error);
        remissionProductDropdown.style.display = 'none';
        remissionMatch.textContent = 'Error al buscar. Intenta de nuevo.';
        currentRemissionMatch = null;
      }
    };

    const debouncedRemissionSearch = debounce(performRemissionSearch, 300);

    remissionSearch?.addEventListener('input', () => {
      debouncedRemissionSearch(remissionSearch.value);
    });

    remissionSearch?.addEventListener('blur', () => {
      setTimeout(() => {
        remissionProductDropdown.style.display = 'none';
      }, 200);
    });

    addRemissionItemButton?.addEventListener('click', () => {
      if (!remissionItems || !currentRemissionMatch) return;
      const qty = Math.max(1, Number(remissionQty?.value || 1));
      remissionItems.querySelector('[data-empty="true"]')?.remove();
      const productCode = getProductCode(currentRemissionMatch);

      const existing = Array.from(remissionItems.querySelectorAll('[data-sku]')).find((item) => item.dataset.sku === productCode);
      if (existing) {
        const qtyHolder = existing.querySelector('[data-qty]');
        const previous = Number(qtyHolder?.getAttribute('data-qty') || '0');
        const nextQty = previous + qty;
        if (qtyHolder) {
          qtyHolder.setAttribute('data-qty', String(nextQty));
          qtyHolder.textContent = `${nextQty} unidades`;
        }
        return;
      }

      const item = document.createElement('div');
      item.className = 'field-input';
      item.dataset.sku = productCode;
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.innerHTML = `<span><strong style="color:#002542;">${escapeHtml(currentRemissionMatch.CodigoProducto || currentRemissionMatch.sku)}</strong> - ${escapeHtml(currentRemissionMatch.NombreProducto || currentRemissionMatch.name)}</span><strong data-qty="${qty}">${qty} unidades</strong>`;
      remissionItems.appendChild(item);
    });

    const incomingProductDropdown = root.querySelector('#incoming-product-dropdown');
    const incomingProviderDropdown = root.querySelector('#incoming-provider-dropdown');

    const performIncomingProviderSearch = async (query) => {
      if (!incomingProviderDropdown || !incomingProviderMatch) return;

      const normalized = String(query || '').trim().toLowerCase();
      if (!normalized) {
        incomingProviderDropdown.style.display = 'none';
        incomingProviderMatch.textContent = 'Escribe el nombre del proveedor para buscar.';
        currentIncomingProviderMatch = null;
        return;
      }

      const matches = (cachedProviders || []).filter((provider) =>
        String(provider.NombreProveedor || '').toLowerCase().includes(normalized)
      );

      if (!matches.length) {
        incomingProviderDropdown.style.display = 'none';
        incomingProviderMatch.textContent = 'No se encontraron proveedores. Intenta con otra búsqueda.';
        currentIncomingProviderMatch = null;
        return;
      }

      incomingProviderDropdown.innerHTML = matches.map((provider, idx) => `
        <div class="search-result-item" data-index="${idx}" style="padding:0.75rem 1rem; border-bottom:1px solid #f0f0f0; cursor:pointer; transition:background 0.2s;">
          <strong style="color:#002542;">${escapeHtml(provider.NombreProveedor)}</strong>
          <div style="color:#73777e; font-size:0.75rem; margin-top:0.2rem;">ID: ${escapeHtml(provider.ProveedorID)}</div>
        </div>
      `).join('');

      Array.from(incomingProviderDropdown.querySelectorAll('.search-result-item')).forEach((item) => {
        item.addEventListener('mouseenter', () => item.style.background = '#f2f4f6');
        item.addEventListener('mouseleave', () => item.style.background = 'white');
        item.addEventListener('click', () => {
          const idx = Number(item.dataset.index);
          const selected = matches[idx];
          if (!selected) return;
          currentIncomingProviderMatch = selected;
          incomingProviderSearch.value = selected.NombreProveedor;
          incomingProviderMatch.innerHTML = `<strong style="color:#002542;">${escapeHtml(selected.NombreProveedor)}</strong> <span style="color:#73777e;">(ID: ${escapeHtml(selected.ProveedorID)})</span>`;
          incomingProviderDropdown.style.display = 'none';
        });
      });

      incomingProviderDropdown.style.display = 'block';
    };

    const performIncomingSearch = async (query) => {
      if (!query || query.trim().length < 1) {
        incomingProductDropdown.style.display = 'none';
        incomingMatch.textContent = 'Escribe un código o nombre para buscar.';
        currentIncomingMatch = null;
        return;
      }

      try {
        const results = await window.appApi.searchProducts(query);
        
        if (!Array.isArray(results) || results.length === 0) {
          incomingProductDropdown.style.display = 'none';
          incomingMatch.textContent = 'No se encontraron productos. Intenta con otra búsqueda.';
          currentIncomingMatch = null;
          return;
        }

        // Mostrar dropdown con resultados
        incomingProductDropdown.innerHTML = results.map((product, idx) => `
          <div class="search-result-item" data-index="${idx}" style="padding:0.75rem 1rem; border-bottom:1px solid #f0f0f0; cursor:pointer; transition:background 0.2s;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <strong style="color:#002542;">${escapeHtml(product.CodigoProducto)}</strong>
                <div style="color:#43474d; font-size:0.82rem; margin-top:0.2rem;">${escapeHtml(product.NombreProducto)}</div>
                <div style="color:#73777e; font-size:0.75rem; margin-top:0.2rem;">PPP: <strong>C$${Number(product.Precio || 0).toFixed(2)}</strong></div>
              </div>
            </div>
          </div>
        `).join('');

        // Agregar hover effect
        Array.from(incomingProductDropdown.querySelectorAll('.search-result-item')).forEach((item) => {
          item.addEventListener('mouseenter', () => item.style.background = '#f2f4f6');
          item.addEventListener('mouseleave', () => item.style.background = 'white');
          item.addEventListener('click', () => {
            const idx = Number(item.dataset.index);
            const selected = results[idx];
            if (selected) {
              currentIncomingMatch = selected;
              incomingSearch.value = selected.CodigoProducto;
              incomingMatch.innerHTML = `<strong style="color:#002542;">${escapeHtml(selected.CodigoProducto)}</strong> - ${escapeHtml(selected.NombreProducto)}`;
              incomingProductDropdown.style.display = 'none';
            }
          });
        });

        incomingProductDropdown.style.display = 'block';
      } catch (error) {
        console.error('[SearchIncomingProducts] Error:', error);
        incomingProductDropdown.style.display = 'none';
        incomingMatch.textContent = 'Error al buscar. Intenta de nuevo.';
        currentIncomingMatch = null;
      }
    };

    const debouncedIncomingSearch = debounce(performIncomingSearch, 300);
    const debouncedIncomingProviderSearch = debounce(performIncomingProviderSearch, 300);

    incomingProviderSearch?.addEventListener('input', () => {
      debouncedIncomingProviderSearch(incomingProviderSearch.value);
    });

    incomingProviderSearch?.addEventListener('blur', () => {
      setTimeout(() => {
        if (incomingProviderDropdown) incomingProviderDropdown.style.display = 'none';
      }, 200);
    });

    incomingSearch?.addEventListener('input', () => {
      debouncedIncomingSearch(incomingSearch.value);
    });

    incomingSearch?.addEventListener('blur', () => {
      setTimeout(() => {
        incomingProductDropdown.style.display = 'none';
      }, 200);
    });

    // Calcular costo total cuando cambien cantidad o costo
    const updateTotalCost = () => {
      if (!incomingQty || !incomingCost || !incomingTotalCost) return;
      const qty = Number(incomingQty.value || 0);
      const cost = Number(incomingCost.value || 0);
      const total = qty * cost;
      incomingTotalCost.textContent = formatMoney(total);
    };

    incomingQty?.addEventListener('change', updateTotalCost);
    incomingQty?.addEventListener('input', updateTotalCost);
    incomingCost?.addEventListener('change', updateTotalCost);
    incomingCost?.addEventListener('input', updateTotalCost);

    addIncomingItemButton?.addEventListener('click', () => {
      if (!incomingItems || !currentIncomingMatch) return;
      if (!currentIncomingProviderMatch) {
        window.showAlert('Selecciona un proveedor antes de agregar el producto.', 'warning');
        return;
      }
      const qty = Math.max(1, Number(incomingQty?.value || 1));
      const cost = Math.max(0, Number(incomingCost?.value || 0));
      incomingItems.querySelector('[data-empty="true"]')?.remove();
      const productCode = getProductCode(currentIncomingMatch);
      const providerId = String(currentIncomingProviderMatch.ProveedorID);
      const providerName = currentIncomingProviderMatch.NombreProveedor || '';
      const itemKey = `${productCode}::${providerId}`;

      const existing = Array.from(incomingItems.querySelectorAll('[data-entry-key]')).find((item) => item.dataset.entryKey === itemKey);
      if (existing) {
        const qtyHolder = existing.querySelector('[data-qty]');
        const previous = Number(qtyHolder?.getAttribute('data-qty') || '0');
        const nextQty = previous + qty;
        if (qtyHolder) {
          qtyHolder.setAttribute('data-qty', String(nextQty));
          qtyHolder.setAttribute('data-cost', String(cost));
          const totalCost = nextQty * cost;
          qtyHolder.textContent = `${nextQty} unidades - ${formatMoney(totalCost)}`;
        }
        return;
      }

      const item = document.createElement('div');
      item.className = 'field-input';
      item.dataset.sku = productCode;
      item.dataset.providerId = providerId;
      item.dataset.entryKey = itemKey;
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      const totalCost = qty * cost;
      item.innerHTML = `<span style="display:grid; gap:0.2rem;"><strong style="color:#002542;">${escapeHtml(currentIncomingMatch.CodigoProducto || currentIncomingMatch.sku)}</strong> - ${escapeHtml(currentIncomingMatch.NombreProducto || currentIncomingMatch.name)}<span style="color:#73777e; font-size:0.78rem;">Proveedor: ${escapeHtml(providerName)}</span></span><strong data-qty="${qty}" data-cost="${cost}">${qty} unidades - ${formatMoney(totalCost)}</strong>`;
      incomingItems.appendChild(item);
      
      // Resetear valores para próximo ingreso
      incomingQty.value = 1;
      incomingCost.value = 0;
      updateTotalCost();
    });

    warehousePrincipalSearch?.addEventListener('input', debounce(() => {
      const principalBody = inventoryTables[0];
      filterAndRenderWarehouse(warehousePrincipalSearch, principalBody, warehousePrincipalData);
    }, 300));

    warehouseLocalSearch?.addEventListener('input', debounce(() => {
      const localBody = inventoryTables[1];
      filterAndRenderWarehouse(warehouseLocalSearch, localBody, warehouseLocalData);
    }, 300));

    openRemissionButton?.addEventListener('click', () => {
      openModal(remissionModal);
      renderRemissionItems();
    });
    openIncomingButton?.addEventListener('click', () => {
      openModal(incomingModal);
      renderIncomingItems();
    });
    openRemissionHistoryButton?.addEventListener('click', () => {
      openModal(remissionHistoryModal);
    });
    openIncomingHistoryButton?.addEventListener('click', () => {
      openModal(incomingHistoryModal);
    });

    openMinStockModalButton?.addEventListener('click', () => {
      openModal(minStockModal);
      minStockSearch.value = '';
      minStockProductsList.innerHTML = '<div style="padding:1rem; text-align:center; color:#73777e;">Ingresa un término de búsqueda para ver productos disponibles.</div>';
    });

    const renderMinStockProducts = (products) => {
      if (!products || products.length === 0) {
        minStockProductsList.innerHTML = '<div style="padding:1rem; text-align:center; color:#73777e;">No hay productos que coincidan con tu búsqueda.</div>';
        return;
      }

      minStockProductsList.innerHTML = products.map((product) => `
        <div style="padding:0.75rem 1rem; border-bottom:1px solid #e6e8ea; display:grid; gap:0.35rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#002542;">${escapeHtml(product.CodigoProducto)}</strong> - ${escapeHtml(product.NombreProducto)}
              <div style="color:#73777e; font-size:0.75rem; margin-top:0.2rem;">${escapeHtml(product.NombreBodega)} • Stock: ${Number(product.Existencia)}</div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <input type="number" min="0" value="${Number(product.StockMinimo)}" style="width:80px; padding:0.35rem; border:1px solid #e6e8ea; border-radius:0.35rem;" data-inventory-id="${product.InventarioID}" class="min-stock-input" />
              <button type="button" class="cta-button" style="padding:0.35rem 0.75rem; font-size:0.85rem; white-space:nowrap;" data-inventory-id="${product.InventarioID}" class="save-min-stock-btn">Guardar</button>
            </div>
          </div>
        </div>
      `).join('');

      minStockProductsList.querySelectorAll('.save-min-stock-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const inventarioId = Number(btn.dataset.inventoryId);
          const input = minStockProductsList.querySelector(`input[data-inventory-id="${inventarioId}"]`);
          const stockMinimo = Number(input.value);

          if (!Number.isFinite(stockMinimo) || stockMinimo < 0) {
            window.showAlert('El stock mínimo debe ser un número válido.', 'error');
            return;
          }

          try {
            await api.updateInventoryMinStock(inventarioId, stockMinimo);
            window.showAlert(`Stock mínimo actualizado a ${stockMinimo} unidades.`, 'success');
            await renderInventoryTables();
            await checkStockAlerts();
          } catch (error) {
            window.showAlert(error.message || 'No fue posible actualizar el stock mínimo.', 'error');
          }
        });
      });
    };

    minStockSearch?.addEventListener('input', debounce(async () => {
      const searchTerm = minStockSearch.value.trim();
      
      if (searchTerm.length < 1) {
        minStockProductsList.innerHTML = '<div style="padding:1rem; text-align:center; color:#73777e;">Ingresa un término de búsqueda para ver productos disponibles.</div>';
        return;
      }

      try {
        const products = await api.getInventoryProductsWithStock(searchTerm);
        minStockProductsCache = products;
        renderMinStockProducts(products);
      } catch (error) {
        console.error('Error buscando productos:', error);
        minStockProductsList.innerHTML = `<div style="padding:1rem; text-align:center; color:#ba1a1a;">Error: ${escapeHtml(error.message)}</div>`;
      }
    }, 300));

    root.querySelector('#print-remission-history-report')?.addEventListener('click', () => {
      window.print();
    });

    root.querySelector('#print-incoming-history-report')?.addEventListener('click', () => {
      window.print();
    });

    remissionConfirmButton?.addEventListener('click', async () => {
      if (!api?.createRemission) {
        window.showAlert('La API no está disponible.');
        return;
      }

      const items = Array.from(remissionItems?.querySelectorAll('[data-sku]') || []).map((item) => ({
        productId: item.dataset.sku,
        cantidad: Number(item.querySelector('[data-qty]')?.getAttribute('data-qty') || '0'),
      }));

      if (items.length === 0) {
        window.showAlert('Agrega al menos un producto para remitir.');
        return;
      }

      try {
        await api.createRemission({
          bodegaOrigen: root.querySelector('#remission-origin-warehouse')?.value,
          bodegaDestino: root.querySelector('#remission-target-warehouse')?.value,
          items,
        });
        await renderInventoryTables();
        await checkStockAlerts();
        closeModal(remissionModal);
      } catch (error) {
        window.showAlert(error.message || 'No fue posible registrar la remisión.', 'error');
      }
    });

    incomingConfirmButton?.addEventListener('click', async () => {
      if (!api?.createIncome) {
        window.showAlert('La API no está disponible.');
        return;
      }

      const items = Array.from(incomingItems?.querySelectorAll('[data-sku]') || []).map((item) => {
        const qtyHolder = item.querySelector('[data-qty]');
        return {
          productId: item.dataset.sku,
          proveedorId: Number(item.dataset.providerId),
          cantidad: Number(qtyHolder?.getAttribute('data-qty') || '0'),
          costo: Number(qtyHolder?.getAttribute('data-cost') || '0'),
        };
      });

      if (items.length === 0) {
        window.showAlert('Agrega al menos un producto para ingresar.');
        return;
      }

      try {
        const stockMinimoValue = incomingStockMinimo?.value;
        const stockMinimo = (stockMinimoValue && stockMinimoValue.trim() !== '') ? Math.max(0, Math.trunc(Number(stockMinimoValue))) : undefined;

        for (const item of items) {
          await api.createIncome({
            bodegaId: root.querySelector('#incoming-target-warehouse')?.value,
            productId: item.productId,
            proveedorId: item.proveedorId,
            cantidad: item.cantidad,
            costo: item.costo,
            ...(stockMinimo !== undefined && { stockMinimo }),
          });
        }
        await renderInventoryTables();
        await checkStockAlerts();
        
        // Limpiar el campo de stock mínimo después de confirmar
        if (incomingStockMinimo) {
          incomingStockMinimo.value = '';
        }
        
        closeModal(incomingModal);
      } catch (error) {
        window.showAlert(error.message || 'No fue posible registrar el ingreso.', 'error');
      }
    });

    const refreshInventoryData = async () => {
      await refreshCatalogCache();
      await refreshProvidersCache();
      await renderInventoryTables();
      await checkStockAlerts();
    };

    const checkStockAlerts = async () => {
      try {
        if (!api?.getStockAlerts) {
          return;
        }

        const alerts = await api.getStockAlerts();
        if (!alerts || alerts.length === 0) {
          window.stockAlerts = [];
          window.updateStockAlertsUI?.();
          return;
        }

        // Guardar alertas en variable global en lugar de mostrar notificaciones
        window.stockAlerts = alerts;
        window.updateStockAlertsUI?.();
      } catch (error) {
        console.error('[Inventory] Error checking stock alerts:', error);
      }
    };

    // Cargar datos iniciales
    (async () => {
      try {
        console.log('[Inventory] Iniciando carga de datos...');
        await refreshInventoryData();
        console.log('[Inventory] Datos cargados exitosamente');
      } catch (error) {
        console.error('[Inventory] Error al cargar datos:', error);
        window.showAlert(error.message || 'Error al cargar el inventario. Intenta recargar la página.', 'error');
      }
    })();
  }
};
