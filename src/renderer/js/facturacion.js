// Invoice View - uses buildInvoiceModal and openInvoiceModal from pedidos.js

if (!window.invoiceView) {
  window.invoiceView = {
    title: 'Historial de Facturas',
    subtitle: 'Consulta todas las facturas emitidas, visualiza detalles e imprime cuando lo necesites.',
    render: function() {
      return `
        <div class="view-wrap invoices-view">
          <div class="orders-toolbar no-print" style="display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap;">
            <div>
              <span class="eyebrow">Documentos</span>
              <h3 style="margin:0.25rem 0 0; font-size:2rem; color:#002542;">Facturas Emitidas</h3>
              <p style="margin:0.4rem 0 0; color:#43474d; max-width:56rem;">Revisa el registro completo de facturas, visualiza detalles e imprime cuando lo necesites.</p>
            </div>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center;">
              <button id="export-invoices" class="cta-button" type="button" style="display:flex; align-items:center; gap:0.45rem;"><span class="material-symbols-outlined">download</span><span>Exportar Excel</span></button>
            </div>
          </div>

          <section class="catalog-card" style="padding:1.25rem; margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:end; gap:1rem; margin-bottom:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.35rem; color:#002542;">Facturas pendientes</h4>
                <p style="margin:0.25rem 0 0; color:#43474d;">Documentos pendientes por confirmar.</p>
              </div>
              <span id="invoices-count-pending" style="font-weight:700; color:#002542;">Mostrando 0-0 de 0 facturas pendientes</span>
            </div>
            <div class="table-wrap">
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th style="text-align:right;">Total</th>
                    <th style="text-align:center;">Acción</th>
                  </tr>
                </thead>
                <tbody id="invoices-grid-pending">
                  <tr><td colspan="6" style="text-align:center; color:#73777e; padding:2rem;">Cargando facturas pendientes...</td></tr>
                </tbody>
              </table>
            </div>
            <div id="invoices-pagination-pending" class="no-print" style="display:flex; justify-content:flex-end; gap:0.4rem; flex-wrap:wrap; margin-top:0.85rem;"></div>
          </section>

          <section class="catalog-card" style="padding:1.25rem; margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:end; gap:1rem; margin-bottom:1rem;">
              <div>
                <h4 style="margin:0; font-size:1.35rem; color:#002542;">Facturas confirmadas</h4>
                <p style="margin:0.25rem 0 0; color:#43474d;">Facturas emitidas y confirmadas en el sistema.</p>
              </div>
              <span id="invoices-count-confirmed" style="font-weight:700; color:#002542;">Mostrando 0-0 de 0 facturas confirmadas</span>
            </div>
            <div class="table-wrap">
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th style="text-align:right;">Total</th>
                    <th style="text-align:center;">Acción</th>
                  </tr>
                </thead>
                <tbody id="invoices-grid-confirmed">
                  <tr><td colspan="6" style="text-align:center; color:#73777e; padding:2rem;">Cargando facturas confirmadas...</td></tr>
                </tbody>
              </table>
            </div>
            <div id="invoices-pagination-confirmed" class="no-print" style="display:flex; justify-content:flex-end; gap:0.4rem; flex-wrap:wrap; margin-top:0.85rem;"></div>
          </section>
        </div>
      `;
    },
    bind: function(root) {
      const api = window.appApi;
      const invoicesGridPending = root?.querySelector('#invoices-grid-pending');
      const invoicesGridConfirmed = root?.querySelector('#invoices-grid-confirmed');
      const invoicesCountPending = root?.querySelector('#invoices-count-pending');
      const invoicesCountConfirmed = root?.querySelector('#invoices-count-confirmed');
      const invoicesPaginationPending = root?.querySelector('#invoices-pagination-pending');
      const invoicesPaginationConfirmed = root?.querySelector('#invoices-pagination-confirmed');
      const exportInvoicesButton = root?.querySelector('#export-invoices');
      let cachedInvoices = [];
      let pendingPage = 1;
      let confirmedPage = 1;
      const invoicesPerPage = 10;
      
      if (!invoicesGridPending || !invoicesGridConfirmed || !api) {
        console.error('[invoiceView] Missing DOM or API');
        return;
      }

      const formatMoney = (value) => `C$${Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const currencyFormat = '"C$" #,##0.00';

      exportInvoicesButton?.addEventListener('click', async () => {
        const invoices = cachedInvoices.length > 0 ? cachedInvoices : await api.listInvoices().catch(() => []);

        if (!invoices.length) {
          window.showAlert('No hay facturas para exportar.', 'warning');
          return;
        }

        const resumenRows = invoices.map((invoice) => ({
          'ID Factura': Number(invoice.FacturaID || 0),
          'Cliente': invoice.NombreCliente || '',
          'Fecha Emision': invoice.FechaEmision ? new Date(invoice.FechaEmision).toLocaleDateString('es-ES') : '',
          'Estado': invoice.Estado || 'Emitida',
          'Subtotal (C$)': Number(invoice.Subtotal || 0),
          'Impuestos (C$)': Number(invoice.Impuestos || 0),
          'Retencion (C$)': Number(invoice.Retencion || 0),
          'Total (C$)': Number(invoice.Total || 0),
        }));

        const detallesByInvoice = await Promise.all(
          invoices.map(async (invoice) => {
            try {
              const detail = await api.getInvoice(invoice.FacturaID);
              const lines = Array.isArray(detail?.items) ? detail.items : [];
              if (!lines.length) {
                return [{
                  'ID Factura': Number(invoice.FacturaID || 0),
                  'Cliente': invoice.NombreCliente || '',
                  'Fecha Emision': invoice.FechaEmision ? new Date(invoice.FechaEmision).toLocaleDateString('es-ES') : '',
                  'Codigo Producto': '',
                  'Producto': '',
                  'Cantidad': 0,
                  'Precio Unitario (C$)': 0,
                  'Descuento (C$)': 0,
                  'Total Linea (C$)': 0,
                }];
              }

              return lines.map((line) => {
                const cantidad = Number(line.Cantidad || 0);
                const precio = Number(line.PrecioUnit || 0);
                const descuento = Number(line.Descuento || 0);
                const totalLinea = Number(line.TotalLinea || (cantidad * precio) - descuento);

                return {
                  'ID Factura': Number(invoice.FacturaID || 0),
                  'Cliente': invoice.NombreCliente || '',
                  'Fecha Emision': invoice.FechaEmision ? new Date(invoice.FechaEmision).toLocaleDateString('es-ES') : '',
                  'Codigo Producto': line.CodigoProducto || '',
                  'Producto': line.NombreProducto || '',
                  'Cantidad': cantidad,
                  'Precio Unitario (C$)': precio,
                  'Descuento (C$)': descuento,
                  'Total Linea (C$)': totalLinea,
                };
              });
            } catch {
              return [];
            }
          })
        );

        const detalleRows = detallesByInvoice.flat();

        const wb = XLSX.utils.book_new();
        const wsResumen = XLSX.utils.json_to_sheet(resumenRows);
        const wsDetalle = XLSX.utils.json_to_sheet(detalleRows);

        wsResumen['!cols'] = [
          { wch: 11 },
          { wch: 28 },
          { wch: 14 },
          { wch: 12 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
          { wch: 16 },
        ];

        wsDetalle['!cols'] = [
          { wch: 11 },
          { wch: 24 },
          { wch: 14 },
          { wch: 16 },
          { wch: 40 },
          { wch: 10 },
          { wch: 18 },
          { wch: 16 },
          { wch: 16 },
        ];

        wsResumen['!autofilter'] = { ref: `A1:H${Math.max(1, resumenRows.length + 1)}` };
        wsDetalle['!autofilter'] = { ref: `A1:I${Math.max(1, detalleRows.length + 1)}` };

        const setCurrencyCol = (sheet, colLetter, fromRow, toRow) => {
          for (let row = fromRow; row <= toRow; row += 1) {
            const cell = sheet[`${colLetter}${row}`];
            if (cell) cell.z = currencyFormat;
          }
        };

        setCurrencyCol(wsResumen, 'E', 2, resumenRows.length + 1);
        setCurrencyCol(wsResumen, 'F', 2, resumenRows.length + 1);
        setCurrencyCol(wsResumen, 'G', 2, resumenRows.length + 1);
        setCurrencyCol(wsResumen, 'H', 2, resumenRows.length + 1);

        setCurrencyCol(wsDetalle, 'G', 2, detalleRows.length + 1);
        setCurrencyCol(wsDetalle, 'H', 2, detalleRows.length + 1);
        setCurrencyCol(wsDetalle, 'I', 2, detalleRows.length + 1);

        const styleHeader = (sheet, columns, headerColor) => {
          for (let idx = 0; idx < columns.length; idx += 1) {
            const ref = `${columns[idx]}1`;
            if (!sheet[ref]) continue;
            sheet[ref].s = {
              font: { bold: true, color: { rgb: 'FFFFFF' } },
              fill: { fgColor: { rgb: headerColor } },
              alignment: { horizontal: 'center', vertical: 'center' },
            };
          }
        };

        styleHeader(wsResumen, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], '002542');
        styleHeader(wsDetalle, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], '1B3B5A');

        XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Facturas');
        XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Facturas');
        XLSX.writeFile(wb, 'facturas.xlsx');
      });

      const isPendingInvoice = (invoice) => String(invoice?.Estado || '').trim().toLowerCase() === 'pendiente';

      const renderPager = (host, currentPage, totalPages, type) => {
        if (!host) return;
        if (totalPages <= 1) {
          host.innerHTML = '';
          return;
        }

        const buttons = [];
        buttons.push(`<button class="ghost-button" type="button" data-invoice-page-nav="prev" data-invoice-page-type="${type}" ${currentPage === 1 ? 'disabled' : ''} style="min-width:2.25rem; padding:0.35rem 0.6rem;">‹</button>`);
        for (let page = 1; page <= totalPages; page += 1) {
          buttons.push(`<button class="${page === currentPage ? 'filter-button active' : 'filter-button'}" type="button" data-invoice-page-number="${page}" data-invoice-page-type="${type}" style="min-width:2.25rem;">${page}</button>`);
        }
        buttons.push(`<button class="ghost-button" type="button" data-invoice-page-nav="next" data-invoice-page-type="${type}" ${currentPage === totalPages ? 'disabled' : ''} style="min-width:2.25rem; padding:0.35rem 0.6rem;">›</button>`);
        host.innerHTML = buttons.join('');
      };

      const renderInvoiceTable = ({ gridHost, countHost, pagerHost, rows, emptyMessage, type, page }) => {
        if (!gridHost || !countHost) return page;

        const totalRows = rows.length;
        const totalPages = Math.max(1, Math.ceil(totalRows / invoicesPerPage));
        const safePage = Math.min(Math.max(1, page), totalPages);
        const startIndex = (safePage - 1) * invoicesPerPage;
        const pageRows = rows.slice(startIndex, startIndex + invoicesPerPage);
        const showingFrom = totalRows === 0 ? 0 : startIndex + 1;
        const showingTo = Math.min(startIndex + invoicesPerPage, totalRows);

        countHost.textContent = `Mostrando ${showingFrom}-${showingTo} de ${totalRows} facturas ${type === 'pending' ? 'pendientes' : 'confirmadas'}`;

        if (!pageRows.length) {
          gridHost.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#73777e; padding:2rem;">${emptyMessage}</td></tr>`;
          if (pagerHost) pagerHost.innerHTML = '';
          return safePage;
        }

        gridHost.innerHTML = pageRows.map((invoice) => {
          const fecha = invoice.FechaEmision ? new Date(invoice.FechaEmision).toLocaleDateString('es-ES') : '--';
          const estado = invoice.Estado || 'Emitida';

          return `
            <tr>
              <td><strong>#${invoice.FacturaID || '--'}</strong></td>
              <td>${escapeHtml(invoice.NombreCliente || 'Cliente')}</td>
              <td>${fecha}</td>
              <td><span class="chip active">${estado}</span></td>
              <td style="text-align:right;"><strong>${formatMoney(invoice.Total || 0)}</strong></td>
              <td style="text-align:center;">
                <button class="icon-button view-invoice" data-id="${invoice.FacturaID}" type="button" title="Ver factura"><span class="material-symbols-outlined">visibility</span></button>
              </td>
            </tr>
          `;
        }).join('');

        renderPager(pagerHost, safePage, totalPages, type);
        return safePage;
      };

      const renderInvoices = async () => {
        if (!root.isConnected) return;
        try {
          const invoices = await api.listInvoices();
          cachedInvoices = Array.isArray(invoices) ? invoices : [];
          console.log('[invoiceView] Loaded:', invoices?.length || 0, 'invoices');

          const pendingInvoices = cachedInvoices.filter((invoice) => isPendingInvoice(invoice));
          const confirmedInvoices = cachedInvoices.filter((invoice) => !isPendingInvoice(invoice));

          pendingPage = renderInvoiceTable({
            gridHost: invoicesGridPending,
            countHost: invoicesCountPending,
            pagerHost: invoicesPaginationPending,
            rows: pendingInvoices,
            emptyMessage: 'No hay facturas pendientes.',
            type: 'pending',
            page: pendingPage,
          });

          confirmedPage = renderInvoiceTable({
            gridHost: invoicesGridConfirmed,
            countHost: invoicesCountConfirmed,
            pagerHost: invoicesPaginationConfirmed,
            rows: confirmedInvoices,
            emptyMessage: 'No hay facturas confirmadas.',
            type: 'confirmed',
            page: confirmedPage,
          });
        } catch (error) {
          console.error('[invoiceView] Failed to load:', error);
          invoicesGridPending.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ba1a1a; padding:2rem;">Error: ${escapeHtml(error.message)}</td></tr>`;
          invoicesGridConfirmed.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ba1a1a; padding:2rem;">Error: ${escapeHtml(error.message)}</td></tr>`;
        }
      };

      root?.addEventListener('click', async (event) => {
        const pageBtn = event.target.closest('[data-invoice-page-number]');
        if (pageBtn) {
          const type = pageBtn.dataset.invoicePageType;
          const page = Number(pageBtn.dataset.invoicePageNumber || '1');
          if (type === 'pending') pendingPage = page;
          if (type === 'confirmed') confirmedPage = page;
          renderInvoices();
          return;
        }

        const navBtn = event.target.closest('[data-invoice-page-nav]');
        if (navBtn) {
          const type = navBtn.dataset.invoicePageType;
          const nav = navBtn.dataset.invoicePageNav;
          if (type === 'pending') {
            if (nav === 'prev') pendingPage = Math.max(1, pendingPage - 1);
            if (nav === 'next') pendingPage += 1;
          }
          if (type === 'confirmed') {
            if (nav === 'prev') confirmedPage = Math.max(1, confirmedPage - 1);
            if (nav === 'next') confirmedPage += 1;
          }
          renderInvoices();
          return;
        }

        const viewBtn = event.target.closest('.view-invoice');
        if (!viewBtn) return;
        const invoiceId = viewBtn.dataset.id;
        if (!invoiceId) return;

        try {
          const invoiceData = await api.getInvoice(invoiceId);
          console.log('[invoiceView] Invoice data:', invoiceData);

          if (!invoiceData) {
            window.showAlert('No se pudieron cargar los datos.');
            return;
          }

          const itemsSubtotal = (invoiceData.items || []).reduce((sum, item) => sum + (Number(item.Cantidad || 0) * Number(item.PrecioUnit || 0)), 0);
          const ivaRate = Number(localStorage.getItem('ivaRate') || 0) / 100;
          const calculatedIva = itemsSubtotal * ivaRate;
          const discuentoTotal = invoiceData.descuento || 0;
          const formatted = {
            documentNumber: `#FAC-${invoiceData.invoice?.FacturaID || invoiceId}`,
            issueDate: invoiceData.invoice?.FechaEmision,
            clientName: invoiceData.invoice?.NombreCliente,
            subtotal: itemsSubtotal,
            impuestos: invoiceData.invoice?.Impuestos || calculatedIva,
            retencion: invoiceData.invoice?.Retencion || 0,
            descuento: discuentoTotal,
            descuentoNombre: '',
            total: invoiceData.invoice?.Total || (itemsSubtotal + (invoiceData.invoice?.Impuestos || calculatedIva) - (invoiceData.invoice?.Retencion || 0) - discuentoTotal),
            items: invoiceData.items || [],
          };

          if (typeof openInvoiceModal === 'function') {
            openInvoiceModal(formatted);
          } else {
            window.showAlert('Modal no disponible.');
          }
        } catch (error) {
          console.error('[invoiceView] Error:', error);
          window.showAlert('Error: ' + error.message);
        }
      });

      renderInvoices();
    }
  };
}

