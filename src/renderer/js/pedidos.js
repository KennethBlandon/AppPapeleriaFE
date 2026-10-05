const normalizePaymentType = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'credito' || normalized === 'crédito' ? 'Credito' : 'Contado';
};

const buildInvoiceModal = (invoiceData) => {
  const formatMoney = (value) => `C$ ${Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const safeText = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const invoiceItems = Array.isArray(invoiceData?.items) ? invoiceData.items : [];
  const subtotal = invoiceData?.subtotal ?? invoiceItems.reduce((sum, item) => sum + (Number(item.total) || (Number(item.qty ?? item.Cantidad ?? 0) * Number(item.price ?? item.PrecioUnit ?? 0))), 0);
  const ivaRate = Number(localStorage.getItem('ivaRate') || 0) / 100;
  const impuestos = invoiceData?.impuestos ?? (subtotal * ivaRate);
  const retentionValueAmount = Number(invoiceData?.retencion ?? invoiceData?.retentionValueAmount ?? 0);
  const discountValueAmount = Number(invoiceData?.descuento ?? 0);
  const total = invoiceData?.total ?? (subtotal + impuestos - retentionValueAmount - discountValueAmount);

  const issueDate = invoiceData?.issueDate ? new Date(invoiceData.issueDate) : new Date();
  const day = String(issueDate.getDate()).padStart(2, '0');
  const month = String(issueDate.getMonth() + 1).padStart(2, '0');
  const year = String(issueDate.getFullYear());
  const documentNumber = String(invoiceData?.documentNumber || `FAC-${invoiceData?.FacturaID || '--'}`).replace('#', '');
  const clientName = invoiceData?.clientName || invoiceData?.NombreCliente || 'Cliente no especificado';
  const paymentType = normalizePaymentType(invoiceData?.paymentType || invoiceData?.TipoPago);

  const rowCount = 11;
  const rows = Array.from({ length: rowCount }).map((_, index) => {
    const item = invoiceItems[index];
    if (!item) {
      return `
        <tr>
        <td style="border:1px solid #222; height:1.45rem;"></td>
        <td style="border:1px solid #222;"></td>
        <td style="border:1px solid #222;"></td>
        <td style="border:1px solid #222;"></td>
      </tr>
      `;
    }

    const qty = Number(item.qty ?? item.Cantidad ?? 0);
    const unitPrice = Number(item.price ?? item.PrecioUnit ?? 0);
    const lineTotal = Number(item.total ?? (qty * unitPrice));
    const description = `${item.name || item.NombreProducto || 'Producto'}${(item.sku || item.CodigoProducto) ? ` (${item.sku || item.CodigoProducto})` : ''}`;

    return `
      <tr>
      <td style="border:1px solid #222; text-align:center;">${qty}</td>
      <td style="border:1px solid #222;">${safeText(description)}</td>
      <td style="border:1px solid #222; text-align:right;">${formatMoney(unitPrice)}</td>
      <td style="border:1px solid #222; text-align:right;">${formatMoney(lineTotal)}</td>
    </tr>
    `;
  }).join('');

  return `
    <div id="invoice-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(8px); z-index:99; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
      <div class="catalog-card" style="width:100%; max-width:95rem; max-height:95vh; display:grid; grid-template-rows:auto 1fr auto; overflow:hidden; padding:0;">
        <div style="padding:1rem 1.25rem; border-bottom:1px solid #e6e8ea; display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;" class="no-print">
          <div>
            <h4 style="margin:0; font-size:1.2rem; color:#002542;">Formato de Factura</h4>
            <p style="margin:0.2rem 0 0; color:#43474d;">Diseño tipo papeleria fisica para impresion.</p>
          </div>
          <button id="close-invoice-modal" class="icon-button" type="button" aria-label="Cerrar factura"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div style="overflow:auto; padding:1rem; background:#f2f4f6;">
          <section class="invoice-canvas" style="background:#fff; color:#111; width:100%; max-width:1300px; margin:0 auto; border:2px solid #111; padding:0.65rem 0.75rem; font-family:'Times New Roman', Times, serif; font-size:13px; line-height:1.2;">
            <div style="display:grid; grid-template-columns:1fr auto; gap:0.75rem; align-items:start; border-bottom:2px solid #111; padding-bottom:0.35rem; margin-bottom:0.35rem;">
              <div>
                <div style="font-size:2rem; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">Papeleras Industriales</div>
                <div style="font-size:0.9rem; margin-top:0.2rem;">RUC: 1662205840001M </div>
                <div style="font-size:0.9rem;">Direccion: De la ITR 25vrs abajo, Ciudad Jardin, Managua. Nic. </div>
                <div style="font-size:0.9rem;">Tel: 2250-7977 / Cel: 8624-5246, 8380-5015</div>
              </div>
              <div style="text-align:center; min-width:205px;">
                <div style="font-size:2.2rem; font-weight:700; text-transform:uppercase; letter-spacing:0.03em;">Factura</div>
                <div style="margin-top:0.2rem; font-size:2rem; color:#bf1b1b; font-weight:700; letter-spacing:0.07em;">${safeText(documentNumber)}</div>
                <div style="display:flex; justify-content:center; gap:0.25rem; margin-top:0.35rem;">
                  <label style="font-size:0.9rem; display:flex; align-items:center; gap:0.2rem;"><input type="checkbox" ${paymentType === 'Contado' ? 'checked' : ''} style="transform:scale(0.85);"> Contado</label>
                  <label style="font-size:0.9rem; display:flex; align-items:center; gap:0.2rem;"><input type="checkbox" ${paymentType === 'Credito' ? 'checked' : ''} style="transform:scale(0.85);"> Crédito</label>
                </div>
              </div>
            </div>

          <div style="display:grid; grid-template-columns:auto 50px auto 50px auto 50px; 
            align-items:center; gap:0.25rem; margin-bottom:0.35rem; 
            justify-content:start; font-size:0.8rem;">
  <strong style="font-weight:600;">Dia</strong>
  <div style="border:1px solid #222; min-height:1rem; min-width:40px; 
              display:flex; align-items:center; justify-content:flex-start; 
              padding:0 0.25rem;">${day}</div>

  <strong style="font-weight:600;">Mes</strong>
  <div style="border:1px solid #222; min-height:1rem; min-width:40px; 
              display:flex; align-items:center; justify-content:flex-start; 
              padding:0 0.25rem;">${month}</div>

  <strong style="font-weight:600;">Año</strong>
  <div style="border:1px solid #222; min-height:1rem; min-width:40px; 
              display:flex; align-items:center; justify-content:flex-start; 
              padding:0 0.25rem;">${year}</div>
</div>

            <div style="display:grid; grid-template-columns:auto 1fr; gap:0.35rem; align-items:center; margin-bottom:0.25rem;">
              <strong>Cliente:</strong>
              <div style="border-bottom:1px solid #222; min-height:1.2rem;">${safeText(clientName)}</div>
            </div>
            <div style="display:grid; grid-template-columns:auto 1fr auto 1fr; gap:0.35rem; align-items:center; margin-bottom:0.5rem;">
              <strong>RUC:</strong>
              <div style="border-bottom:1px solid #222; min-height:1.2rem;"></div>
              <strong>Telefono:</strong>
              <div style="border-bottom:1px solid #222; min-height:1.2rem;"></div>
            </div>

            <table style="width:100%; border-collapse:collapse; table-layout:fixed; border:1px solid #222; margin-bottom:0.45rem;">
              <thead>
                <tr style="background:#2b2b2b; color:#fff; font-size:0.92rem; text-transform:uppercase; letter-spacing:0.02em;">
                  <th style="width:10%; border:1px solid #222; border-right:2px solid #222; padding:0.35rem 0.25rem;">Cantidad</th>
                  <th style="width:56%; border:1px solid #222; border-right:2px solid #222; padding:0.35rem 0.3rem;">Descripcion</th>
                  <th style="width:17%; border:1px solid #222; border-right:2px solid #222; padding:0.35rem 0.3rem;">Precio Unitario</th>
                  <th style="width:17%; border:1px solid #222; padding:0.35rem 0.3rem;">Total</th>
                </tr>
              </thead>
              <tbody style="font-size:0.9rem;">
                ${rows}
              </tbody>
            </table>

            <div style="display:grid; grid-template-columns:1fr 280px; gap:0.55rem; align-items:start; margin-bottom:0.35rem;">
              <div style="font-size:0.78rem; line-height:1.25; text-align:justify; border:1px solid #222; padding:0.45rem; min-height:5.7rem;">
                <strong>PAGARE:</strong> Debo y pagare incondicionalmente a la orden de PAPELERAS INDUSTRIALES en esta ciudad o donde se me
                requiera, el valor de esta factura en la fecha acordada. Si no efectuara el pago en la fecha estipulada, reconocere un interes
                moratorio del 5% mensual sobre el saldo insoluto, sin necesidad de requerimiento judicial o extrajudicial. En caso de cobro
                judicial, pagare ademas costas procesales, honorarios y gastos administrativos que se originen. Este documento constituye
                obligacion mercantil valida y exigible conforme a derecho.
              </div>

              <table style="width:100%; border-collapse:collapse; border:1px solid #222; font-size:0.9rem;">
                <tbody>
                  <tr>
                    <td style="border:1px solid #222; padding:0.35rem; font-weight:700;">SUB TOTAL C$</td>
                    <td style="border:1px solid #222; padding:0.35rem; text-align:right;">${formatMoney(subtotal)}</td>
                  </tr>
                  <tr>
                    <td style="border:1px solid #222; padding:0.35rem; font-weight:700;">DESCUENTO</td>
                    <td style="border:1px solid #222; padding:0.35rem; text-align:right;">- ${formatMoney(discountValueAmount)}</td>
                  </tr>
                  <tr>
                    <td style="border:1px solid #222; padding:0.35rem; font-weight:700;">I.V.A.</td>
                    <td style="border:1px solid #222; padding:0.35rem; text-align:right;">${formatMoney(impuestos)}</td>
                  </tr>
                  <tr>
                    <td style="border:1px solid #222; padding:0.35rem; font-weight:700;">RETENCION</td>
                    <td style="border:1px solid #222; padding:0.35rem; text-align:right;">- ${formatMoney(retentionValueAmount)}</td>
                  </tr>
                  <tr>
                    <td style="border:1px solid #222; padding:0.35rem; font-weight:700;">TOTAL C$</td>
                    <td style="border:1px solid #222; padding:0.35rem; text-align:right; font-size:1rem; font-weight:700;">${formatMoney(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-top:0.9rem; text-align:center; font-weight:700; font-size:0.9rem; max-width:700px; margin-right:auto;">
              <div>
                <div style="border-top:1px solid #222; padding-top:0.2rem; ">Recibi Conforme</div>
              </div>
              <div>
                <div style="border-top:1px solid #222; padding-top:0.2rem; ">Entregue Conforme</div>
              </div>
              <div>
                <div style="border-top:1px solid #222; padding-top:0.2rem; ">Firma Cliente</div>
              </div>
            </div>
          </section>
        </div>

        <div style="padding:1rem 1.25rem; border-top:1px solid #e6e8ea; background:#f2f4f6; display:flex; justify-content:flex-end; gap:0.65rem;" class="no-print">
          <button id="export-invoice-modal" class="ghost-button" type="button" style="display:flex; align-items:center; gap:0.4rem; border:1px solid #c3c6ce;">
            <span class="material-symbols-outlined">download</span>
            <span>Exportar Excel</span>
          </button>
          <button id="print-invoice-modal" class="cta-button" type="button" style="display:flex; align-items:center; gap:0.4rem;">
            <span class="material-symbols-outlined">print</span>
            <span>Imprimir</span>
          </button>
          <button id="close-invoice-modal-footer" class="ghost-button" type="button">Cerrar</button>
        </div>
      </div>
    </div>
  `;
};

const openInvoiceModal = (invoiceData) => {
  const modalHtml = buildInvoiceModal(invoiceData);
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  const modal = document.getElementById('invoice-modal');
  const closeButtons = [document.getElementById('close-invoice-modal'), document.getElementById('close-invoice-modal-footer')];
  const printButton = document.getElementById('print-invoice-modal');
  const exportExcelButton = document.getElementById('export-invoice-modal');

  const showModal = () => {
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.setAttribute('aria-hidden', 'false');
  };

  const hideModal = () => {
    const activeElement = document.activeElement;
    if (activeElement && modal.contains(activeElement) && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.setAttribute('aria-hidden', 'true');
    // Remover inmediatamente para limpiar listeners
    modalContainer.remove();
  };

  closeButtons.forEach((btn) => btn?.addEventListener('click', hideModal));
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) hideModal();
  });

  printButton?.addEventListener('click', () => {
    const element = document.querySelector('.invoice-canvas');
    if (element && window.html2pdf) {
      const opt = {
        margin: 0.2,
        filename: `factura-${invoiceData?.documentNumber?.replace('#', '') || 'documento'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
      window.html2pdf().set(opt).from(element).save();
    }
  });

  exportExcelButton?.addEventListener('click', () => {
    if (!window.XLSX) {
      window.showAlert('No se pudo cargar el módulo de Excel.', 'error');
      return;
    }

    const currencyFormat = '"C$" #,##0.00';
    const asNumber = (value) => Number(value || 0);
    const issueDate = invoiceData?.issueDate ? new Date(invoiceData.issueDate) : new Date();
    const issueDateText = Number.isNaN(issueDate.getTime()) ? '' : issueDate.toLocaleDateString('es-ES');
    const documentNumber = String(invoiceData?.documentNumber || `FAC-${invoiceData?.FacturaID || '--'}`).replace('#', '');
    const items = Array.isArray(invoiceData?.items) ? invoiceData.items : [];

    const subtotal = asNumber(invoiceData?.subtotal ?? items.reduce((sum, item) => {
      const qty = asNumber(item.qty ?? item.Cantidad);
      const price = asNumber(item.price ?? item.PrecioUnit);
      return sum + (asNumber(item.total ?? item.TotalLinea) || (qty * price));
    }, 0));
    const impuestos = asNumber(invoiceData?.impuestos);
    const retencion = asNumber(invoiceData?.retencion ?? invoiceData?.retentionValueAmount);
    const descuento = asNumber(invoiceData?.descuento);
    const total = asNumber(invoiceData?.total ?? (subtotal + impuestos - retencion - descuento));

    const resumenRows = [{
      'Documento': documentNumber,
      'Cliente': invoiceData?.clientName || invoiceData?.NombreCliente || '',
      'Fecha Emision': issueDateText,
      'Subtotal (C$)': subtotal,
      'Impuestos (C$)': impuestos,
      'Retencion (C$)': retencion,
      'Descuento (C$)': descuento,
      'Total (C$)': total,
    }];

    const detalleRows = items.map((item) => {
      const qty = asNumber(item.qty ?? item.Cantidad);
      const unitPrice = asNumber(item.price ?? item.PrecioUnit);
      const lineDiscount = asNumber(item.descuento ?? item.Descuento);
      const lineTotal = asNumber(item.total ?? item.TotalLinea ?? ((qty * unitPrice) - lineDiscount));

      return {
        'Documento': documentNumber,
        'Codigo Producto': item.sku || item.CodigoProducto || '',
        'Producto': item.name || item.NombreProducto || '',
        'Cantidad': qty,
        'Precio Unitario (C$)': unitPrice,
        'Descuento (C$)': lineDiscount,
        'Total Linea (C$)': lineTotal,
      };
    });

    const contabilidadRows = [{
      'Documento': documentNumber,
      'Fecha Emision': issueDateText,
      'Cliente': invoiceData?.clientName || invoiceData?.NombreCliente || '',
      'Base Imponible (C$)': subtotal,
      'I.V.A. (C$)': impuestos,
      'Retencion (C$)': retencion,
      'Descuento (C$)': descuento,
      'Total Factura (C$)': total,
      'Estado': 'Emitida',
    }];

    const wb = XLSX.utils.book_new();
    const wsResumen = XLSX.utils.json_to_sheet(resumenRows);
    const wsDetalle = XLSX.utils.json_to_sheet(detalleRows.length ? detalleRows : [{
      'Documento': documentNumber,
      'Codigo Producto': '',
      'Producto': '',
      'Cantidad': 0,
      'Precio Unitario (C$)': 0,
      'Descuento (C$)': 0,
      'Total Linea (C$)': 0,
    }]);
    const wsContabilidad = XLSX.utils.json_to_sheet(contabilidadRows);

    wsResumen['!cols'] = [
      { wch: 16 },
      { wch: 28 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
    ];
    wsDetalle['!cols'] = [
      { wch: 16 },
      { wch: 16 },
      { wch: 42 },
      { wch: 10 },
      { wch: 18 },
      { wch: 16 },
      { wch: 16 },
    ];
    wsContabilidad['!cols'] = [
      { wch: 16 },
      { wch: 14 },
      { wch: 26 },
      { wch: 18 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 12 },
    ];

    const setCurrencyCol = (sheet, colLetter, fromRow, toRow) => {
      for (let row = fromRow; row <= toRow; row += 1) {
        const cell = sheet[`${colLetter}${row}`];
        if (cell) cell.z = currencyFormat;
      }
    };

    setCurrencyCol(wsResumen, 'D', 2, 2);
    setCurrencyCol(wsResumen, 'E', 2, 2);
    setCurrencyCol(wsResumen, 'F', 2, 2);
    setCurrencyCol(wsResumen, 'G', 2, 2);
    setCurrencyCol(wsResumen, 'H', 2, 2);

    setCurrencyCol(wsDetalle, 'E', 2, detalleRows.length + 1);
    setCurrencyCol(wsDetalle, 'F', 2, detalleRows.length + 1);
    setCurrencyCol(wsDetalle, 'G', 2, detalleRows.length + 1);

    setCurrencyCol(wsContabilidad, 'D', 2, 2);
    setCurrencyCol(wsContabilidad, 'E', 2, 2);
    setCurrencyCol(wsContabilidad, 'F', 2, 2);
    setCurrencyCol(wsContabilidad, 'G', 2, 2);
    setCurrencyCol(wsContabilidad, 'H', 2, 2);

    wsResumen['!autofilter'] = { ref: 'A1:H2' };
    wsDetalle['!autofilter'] = { ref: `A1:G${Math.max(2, detalleRows.length + 1)}` };
    wsContabilidad['!autofilter'] = { ref: 'A1:I2' };

    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Factura');
    XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Factura');
    XLSX.utils.book_append_sheet(wb, wsContabilidad, 'Contabilidad');

    XLSX.writeFile(wb, `factura-${documentNumber || 'documento'}.xlsx`);
  });

  showModal();
};

const buildOrderPreviewModal = (orderData, options = {}) => {
  const canConfirm = Boolean(options.canConfirm);
  const formatMoney = (value) => `C$${Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const items = Array.isArray(orderData?.items) ? orderData.items : [];
  const subtotal = Number(orderData?.Total ?? items.reduce((sum, item) => sum + (Number(item.TotalLinea) || (Number(item.Cantidad || 0) * Number(item.PrecioUnit || 0))), 0));
  const fecha = orderData?.FechaEmision ? new Date(orderData.FechaEmision).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '--';
  const estado = orderData?.Estado || 'Pendiente';
  const paymentType = normalizePaymentType(orderData?.TipoPago);
  const selectedDiscount = options.selectedDiscount || null;
  const selectedDiscountRate = Number(selectedDiscount?.rate || 0);
  
  // Calcula descuentos: usa nuevos si están seleccionados, sino usa los persistidos
  const persistedTotalDiscount = items.reduce((sum, item) => sum + (Number(item.Descuento || 0)), 0);
  const selectedNewDiscountAmount = subtotal * (selectedDiscountRate / 100);
  const discountAmount = selectedDiscount ? selectedNewDiscountAmount : persistedTotalDiscount;
  const previewTotal = subtotal - discountAmount;

  const discountSectionHtml = selectedDiscount 
    ? `<div style="display:grid; gap:0.3rem; padding:0.5rem 0; border-top:1px solid #e6e8ea; border-bottom:1px solid #e6e8ea;"><span style="font-size:0.85rem; color:#43474d;">Descuento ${escapeHtml(selectedDiscount.name)} (${selectedDiscountRate.toFixed(2)}%)</span><span style="font-size:0.9rem; color:#ba1a1a; font-weight:700;">- ${formatMoney(discountAmount)}</span></div>`
    : (persistedTotalDiscount > 0 ? `<div style="display:grid; gap:0.3rem; padding:0.5rem 0; border-top:1px solid #e6e8ea; border-bottom:1px solid #e6e8ea;"><span style="font-size:0.85rem; color:#43474d;">Descuento Aplicado</span><span style="font-size:0.9rem; color:#ba1a1a; font-weight:700;">- ${formatMoney(persistedTotalDiscount)}</span></div>` : '');

  return `
    <div id="order-preview-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(8px); z-index:99; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
      <div class="catalog-card" style="width:100%; max-width:72rem; max-height:92vh; display:grid; grid-template-rows:auto 1fr auto; overflow:hidden; padding:0;">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e6e8ea; display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;">
          <div>
            <h4 style="margin:0; font-size:1.3rem; color:#002542;">Pedido #${orderData?.PedidoID || '--'}</h4>
            <p style="margin:0.3rem 0 0; color:#43474d;">Vista previa en modo solo lectura.</p>
          </div>
          <button id="close-order-preview-modal" class="icon-button" type="button" aria-label="Cerrar vista previa del pedido"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div style="overflow:auto; padding:1.5rem; display:flex; flex-direction:column; gap:1rem;">
          <section class="catalog-card" style="padding:1.25rem; box-shadow:none;">
            <div class="grid-4" style="grid-template-columns: repeat(4, minmax(0, 1fr));">
              <div>
                <p style="margin:0; color:#73777e; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em;">Cliente</p>
                <strong style="color:#002542;">${escapeHtml(orderData?.NombreCliente || 'Cliente no identificado')}</strong>
              </div>
              <div>
                <p style="margin:0; color:#73777e; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em;">Fecha</p>
                <strong style="color:#002542;">${fecha}</strong>
              </div>
              <div>
                <p style="margin:0; color:#73777e; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em;">Estado</p>
                <span class="chip ${estado === 'Confirmado' ? 'active' : ''}" style="display:inline-flex;">${estado}</span>
              </div>
              <div>
                <p style="margin:0; color:#73777e; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em;">Tipo de pago</p>
                <span class="chip" style="display:inline-flex; background:${paymentType === 'Credito' ? '#fde68a' : '#d1fae5'}; color:#002542;">${paymentType}</span>
              </div>
            </div>
          </section>

          <section class="catalog-card" style="padding:1.25rem; box-shadow:none;">
            <div class="table-wrap">
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Producto</th>
                    <th style="text-align:center;">Cantidad</th>
                    <th style="text-align:right;">Precio Unit.</th>
                    <th style="text-align:right;">Descuento</th>
                    <th style="text-align:right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.length ? items.map((item) => `
                    <tr>
                      <td>${escapeHtml(item.CodigoProducto || '--')}</td>
                      <td>${escapeHtml(item.NombreProducto || 'Producto')}</td>
                      <td style="text-align:center;">${Number(item.Cantidad || 0)}</td>
                      <td style="text-align:right;">${formatMoney(item.PrecioUnit)}</td>
                      <td style="text-align:right; color:#ba1a1a;">${formatMoney(item.Descuento || 0)}</td>
                      <td style="text-align:right; font-weight:700; color:#002542;">${formatMoney(item.TotalLinea)}</td>
                    </tr>
                  `).join('') : '<tr><td colspan="6" style="text-align:center; color:#73777e;">Este pedido no tiene líneas de detalle registradas.</td></tr>'}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div style="padding:1rem 1.5rem; border-top:1px solid #e6e8ea; background:#f2f4f6; display:flex; justify-content:space-between; align-items:flex-end; gap:1rem;">
          <div style="display:grid; gap:0.5rem;">
            <div style="display:flex; justify-content:space-between; gap:1rem;"><span style="color:#43474d;">Subtotal:</span><strong style="color:#002542;">${formatMoney(subtotal)}</strong></div>
            ${discountSectionHtml}
            <div style="display:flex; justify-content:space-between; gap:1rem; align-items:baseline;"><span style="font-weight:800; color:#002542;">Total del Pedido:</span><strong style="font-size:1.35rem; color:#002542;">${formatMoney(previewTotal)}</strong></div>
          </div>
          <div style="display:flex; gap:0.65rem; align-items:center; flex-wrap:wrap; justify-content:flex-end;">
            ${canConfirm ? '<button id="add-discount-preview-modal" class="secondary-btn" type="button">Agregar descuento</button>' : ''}
            ${canConfirm ? `<button id="confirm-order-preview-modal" class="cta-button" type="button">${paymentType === 'Credito' ? 'Confirmar crédito' : 'Confirmar pedido'}</button>` : ''}
            <button id="close-order-preview-modal-footer" class="ghost-button" type="button">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

const openOrderPreviewModal = (orderData, options = {}) => {
  const modalHtml = buildOrderPreviewModal(orderData, options);
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  const modal = document.getElementById('order-preview-modal');
  const closeButtons = [
    document.getElementById('close-order-preview-modal'),
    document.getElementById('close-order-preview-modal-footer'),
  ];
  const confirmButton = document.getElementById('confirm-order-preview-modal');
  const addDiscountButton = document.getElementById('add-discount-preview-modal');
  const selectedDiscount = options.selectedDiscount || null;

  const showModal = () => {
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.setAttribute('aria-hidden', 'false');
  };

  const hideModal = () => {
    const activeElement = document.activeElement;
    if (activeElement && modal.contains(activeElement) && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    modal.setAttribute('aria-hidden', 'true');
    // Remover inmediatamente para limpiar listeners, evitar conflictos
    modalContainer.remove();
  };

  closeButtons.forEach((btn) => btn?.addEventListener('click', hideModal));
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) hideModal();
  });

  addDiscountButton?.addEventListener('click', () => {
    const loadDiscounts = () => {
      try {
        const raw = localStorage.getItem('orderDiscounts');
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };

    const discounts = loadDiscounts();
    if (!discounts.length) {
      window.showAlert('No hay descuentos creados. Primero crea descuentos desde Ajustes.', 'warning');
      return;
    }

    const pickerContainer = document.createElement('div');
    pickerContainer.innerHTML = `
      <div id="discount-picker-modal" aria-hidden="false" style="position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:110; display:flex; align-items:center; justify-content:center; padding:1.5rem;">
        <div class="catalog-card" style="width:100%; max-width:32rem; padding:1.25rem; display:grid; gap:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem;">
            <h4 style="margin:0; color:#002542;">Seleccionar descuento</h4>
            <button id="close-discount-picker" class="icon-button" type="button" aria-label="Cerrar selector de descuento"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="field-group">
            <label for="discount-picker-select">Descuentos disponibles</label>
            <select id="discount-picker-select" class="field-select">
              ${discounts.map((discount) => `<option value="${escapeHtml(discount.id)}" ${selectedDiscount?.id === discount.id ? 'selected' : ''}>${escapeHtml(discount.name)} (${Number(discount.rate || 0).toFixed(2)}%)</option>`).join('')}
            </select>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.65rem;">
            <button id="discount-picker-cancel" class="ghost-button" type="button">Cancelar</button>
            <button id="discount-picker-apply" class="cta-button" type="button">Aplicar descuento</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(pickerContainer);
    const pickerModal = pickerContainer.querySelector('#discount-picker-modal');
    const pickerSelect = pickerContainer.querySelector('#discount-picker-select');
    const closePicker = () => pickerContainer.remove();

    pickerContainer.querySelector('#close-discount-picker')?.addEventListener('click', closePicker);
    pickerContainer.querySelector('#discount-picker-cancel')?.addEventListener('click', closePicker);
    pickerModal?.addEventListener('click', (event) => {
      if (event.target === pickerModal) closePicker();
    });

    pickerContainer.querySelector('#discount-picker-apply')?.addEventListener('click', () => {
      const selectedId = pickerSelect?.value;
      const discount = discounts.find((item) => item.id === selectedId) || null;
      closePicker();
      hideModal();
      openOrderPreviewModal(orderData, {
        ...options,
        selectedDiscount: discount,
      });
    });
  });

  confirmButton?.addEventListener('click', async () => {
    if (typeof options.onConfirm !== 'function') return;
    try {
      confirmButton.disabled = true;
      confirmButton.style.opacity = '0.65';
      const shouldClose = await options.onConfirm(selectedDiscount);
      if (shouldClose !== false) {
        hideModal();
      }
    } finally {
      confirmButton.disabled = false;
      confirmButton.style.opacity = '';
    }
  });

  showModal();
};

window.ordersView = {
  title: 'Gestión de Pedidos',
  subtitle: 'Consulta pedidos en pendiente o confirmados y crea nuevos pedidos en HOLD.',
  render() {
    return `
      <div class="view-wrap orders-view">
        <div class="orders-toolbar no-print" style="display:grid; gap:1rem; margin-bottom:1.5rem;">
          <div>
            <span class="eyebrow">Operaciones de Venta</span>
            <h3 style="margin:0.25rem 0 0; font-size:2rem; color:#002542;">Pedidos Realizados</h3>
            <p style="margin:0.4rem 0 0; color:#43474d; max-width:56rem;">Revisa los pedidos, confirma los pendientes o elimina los que ya no se necesiten.</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:nowrap;">
            <div style="display:flex; gap:0.6rem; align-items:center; flex-wrap:nowrap;">
              <button id="export-orders" class="secondary-btn" type="button" style="display:flex; align-items:center; gap:0.45rem;">
              <span class="material-symbols-outlined">download</span>
              <span>Exportar Excel</span>
            </button>
              <button id="open-new-order-modal" class="cta-button" type="button" style="border-radius:9999px; padding: 0.5rem 2rem; display:flex; align-items:center; gap:0.45rem;">
              <span class="material-symbols-outlined">add_circle</span>
              <span>Nuevo Pedido</span>
            </button>
            </div>
            <span style="font-weight:700; color:#002542;">Pedidos Pendientes y Confirmados</span>
          </div>
        </div>

        <section class="catalog-card" style="padding:1.25rem; margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:end; gap:1rem; margin-bottom:1rem;">
            <div>
              <h4 style="margin:0; font-size:1.35rem; color:#002542;">Pedidos pendientes</h4>
              <p style="margin:0.25rem 0 0; color:#43474d;">Pedidos en espera de confirmación.</p>
            </div>
            <span id="orders-count-pending" style="font-weight:700; color:#002542;">Mostrando 0-0 de 0 pedidos pendientes</span>
          </div>
          <div class="table-wrap">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th style="text-align:right;">Total</th>
                  <th style="text-align:center; width:14rem;">Acciones</th>
                </tr>
              </thead>
              <tbody id="orders-grid-pending">
                <tr><td colspan="6" style="text-align:center; color:#73777e;">Cargando pedidos pendientes...</td></tr>
              </tbody>
            </table>
          </div>
          <div id="orders-pagination-pending" class="no-print" style="display:flex; justify-content:flex-end; gap:0.4rem; flex-wrap:wrap; margin-top:0.85rem;"></div>
        </section>

        <section class="catalog-card" style="padding:1.25rem; margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:end; gap:1rem; margin-bottom:1rem;">
            <div>
              <h4 style="margin:0; font-size:1.35rem; color:#002542;">Pedidos confirmados</h4>
              <p style="margin:0.25rem 0 0; color:#43474d;">Pedidos ya confirmados en el sistema.</p>
            </div>
            <span id="orders-count-confirmed" style="font-weight:700; color:#002542;">Mostrando 0-0 de 0 pedidos confirmados</span>
          </div>
          <div class="table-wrap">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th style="text-align:right;">Total</th>
                  <th style="text-align:center; width:14rem;">Acciones</th>
                </tr>
              </thead>
              <tbody id="orders-grid-confirmed">
                <tr><td colspan="6" style="text-align:center; color:#73777e;">Cargando pedidos confirmados...</td></tr>
              </tbody>
            </table>
          </div>
          <div id="orders-pagination-confirmed" class="no-print" style="display:flex; justify-content:flex-end; gap:0.4rem; flex-wrap:wrap; margin-top:0.85rem;"></div>
        </section>

        <div id="new-order-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:65; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card" style="width:100%; max-width:82rem; max-height:90vh; overflow:auto; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <h4 style="margin:0; color:#002542; font-size:1.35rem;">Nuevo Pedido en HOLD</h4>
                <p style="margin:0.3rem 0 0; color:#43474d;">El pedido se guardará como pendiente hasta que lo confirmes desde el grid.</p>
              </div>
              <button id="close-new-order-modal" class="round-button" type="button" aria-label="Cerrar ventana de nuevo pedido"><span class="material-symbols-outlined">close</span></button>
            </div>

            <div class="catalog-layout" style="grid-template-columns:minmax(0, 2fr) minmax(0, 1fr); gap:1.25rem;">
              <div class="catalog-main">
                <section class="catalog-card" style="padding:1.25rem; margin-bottom:1rem;">
                  <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
                    <span class="material-symbols-outlined" style="color:#002542;">person</span>
                    <h4 style="margin:0; color:#002542; font-size:1.05rem;">Información del Cliente</h4>
                  </div>
                  <div class="grid-3">
                    <div class="field-group">
                      <label>Cliente Seleccionado</label>
                      <input id="client-select" class="field-input" type="text" list="client-list" placeholder="Escribe para buscar cliente" />
                      <datalist id="client-list">
                        <option value="Cliente 1">
                        <option value="Cliente 2">
                        <option value="Cliente VIP">
                      </datalist>
                    </div>
                    <div class="field-group">
                      <label>Fecha del Pedido</label>
                      <input id="order-date" class="field-input" type="date" required />
                    </div>
                    <div class="field-group">
                      <label>Estado</label>
                      <input class="field-input" type="text" value="Pendiente" readonly />
                    </div>
                    <div class="field-group" style="grid-column:1 / -1;">
                      <label>Tipo de Pago</label>
                      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <button id="payment-type-contado" class="chip payment-type-option active" type="button" data-payment-type="Contado" style="border:none; cursor:pointer;">Contado</button>
                        <button id="payment-type-credito" class="chip payment-type-option" type="button" data-payment-type="Credito" style="border:none; cursor:pointer;">Crédito</button>
                      </div>
                      <p id="payment-type-helper" style="margin:0.35rem 0 0; color:#43474d; font-size:0.82rem;">Contado mantiene el flujo actual. Crédito crea una cuenta por cobrar al confirmar el pedido.</p>
                    </div>
                  </div>
                </section>

                <section class="catalog-card" style="padding:1.25rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1rem;">
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                      <span class="material-symbols-outlined" style="color:#002542;">edit_document</span>
                      <h4 style="margin:0; color:#002542; font-size:1.05rem;">Detalle de Productos</h4>
                    </div>
                    <button id="add-order-row" class="cta-button" type="button" style="border-radius:9999px; padding:0.7rem 0.95rem; display:flex; align-items:center; gap:0.45rem;">
                      <span class="material-symbols-outlined">add_circle</span>
                      <span>Agregar producto</span>
                    </button>
                  </div>
                  <div class="table-wrap">
                    <table class="invoice-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th style="text-align:center; width:6rem;">Cant.</th>
                          <th style="text-align:right; width:8rem;">Precio Unit.</th>
                          <th style="text-align:right; width:8rem;">Subtotal</th>
                          <th style="width:3rem;"></th>
                        </tr>
                      </thead>
                      <tbody id="order-rows"></tbody>
                    </table>
                  </div>
                </section>
              </div>

              <div class="catalog-side no-print">
                <section class="catalog-card side-panel" style="background:#002542; color:#fff; position:sticky; top:1rem;">
                  <h4 style="color:#fff; margin-top:0;">Resumen Financiero</h4>
                  <div class="invoice-summary" style="gap:1rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; color:rgba(255,255,255,0.75);">
                      <span>Subtotal Pedido</span>
                      <strong id="summary-subtotal">$0.00</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; color:rgba(255,255,255,0.75); padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.12);">
                      <span>Valor Retención</span>
                      <strong id="summary-retention">- $0.00</strong>
                    </div>
                    <div style="padding-top:1rem; border-top:1px solid rgba(255,255,255,0.18); margin-top:0.25rem;">
                      <div style="display:flex; justify-content:space-between; align-items:end; margin-bottom:0.3rem;">
                        <span style="font-size:0.9rem; opacity:0.65;">Total Final</span>
                        <strong id="summary-total" style="font-size:2.3rem; line-height:1;">$0.00</strong>
                      </div>
                      <p style="margin:0; text-align:right; font-size:0.68rem; opacity:0.55;">La retención se aplica sobre el subtotal del pedido.</p>
                    </div>
                  </div>
                  <button id="save-order" class="w-full mt-8 py-3 bg-tertiary-fixed text-on-tertiary-fixed font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-tertiary-fixed-dim transition-all shadow-lg active:scale-[0.98]" type="button">
                    <span class="material-symbols-outlined">save</span>
                    Guardar Pedido
                  </button>
                  <button id="cancel-order" class="ghost-button w-full mt-3" type="button">Cancelar</button>
                </section>
              </div>
            </div>
          </div>
        </div>

        <div id="add-product-modal" aria-hidden="true" style="position:fixed; inset:0; background:rgba(0,37,66,0.24); backdrop-filter:blur(8px); z-index:66; display:flex; align-items:center; justify-content:center; padding:1.5rem; opacity:0; pointer-events:none; transition:opacity 0.25s ease;">
          <div class="catalog-card" style="width:100%; max-width:38rem; max-height:88vh; overflow:auto; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem; margin-bottom:1rem;">
              <div>
                <h4 style="margin:0; color:#002542;">Agregar producto al pedido</h4>
                <p style="margin:0.3rem 0 0; color:#43474d;">Filtra por código y agrega la cantidad requerida.</p>
              </div>
              <button id="close-add-product-modal" class="round-button" type="button" aria-label="Cerrar ventana"><span class="material-symbols-outlined">close</span></button>
            </div>

            <div class="field-group" style="margin-bottom:0.8rem;">
              <label>Buscar por código o nombre</label>
              <div style="position:relative;">
                <input id="order-product-search" class="search-input" type="text" placeholder="Ej: PA-300, TC-BLK, CUA-XL o Papel..." autocomplete="off" />
                <div id="order-product-dropdown" style="position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #e6e8ea; border-radius:0.5rem; max-height:300px; overflow-y:auto; display:none; z-index:100; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                  <!-- Los resultados aparecerán aquí -->
                </div>
              </div>
              <div id="order-product-match" class="field-input" style="margin-top:0.5rem; min-height:2.8rem; display:flex; align-items:center; color:#43474d;">Escribe un código o nombre para buscar.</div>
            </div>

            <div class="field-group" style="margin-bottom:1rem;">
              <label>Cantidad</label>
              <input id="order-product-qty" class="field-input" type="number" min="1" value="1" />
            </div>

            <div class="field-group" style="margin-bottom:1rem;">
              <label>Vista previa</label>
              <div id="order-product-preview" style="display:grid; gap:0.65rem;">
                <div class="field-input" data-empty="true" style="color:#73777e;">Aún no has agregado productos a la vista previa.</div>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.65rem; flex-wrap:wrap;">
              <button id="cancel-add-product" class="ghost-button" type="button">Cancelar</button>
              <button id="confirm-add-product" class="cta-button" type="button">Agregar a vista previa</button>
              <button id="finalize-add-product" class="cta-button" type="button">Finalizar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  bind(root) {
    const api = window.appApi;
    const ordersGridPending = root.querySelector('#orders-grid-pending');
    const ordersGridConfirmed = root.querySelector('#orders-grid-confirmed');
    const ordersCountPending = root.querySelector('#orders-count-pending');
    const ordersCountConfirmed = root.querySelector('#orders-count-confirmed');
    const ordersPaginationPending = root.querySelector('#orders-pagination-pending');
    const ordersPaginationConfirmed = root.querySelector('#orders-pagination-confirmed');
    const openNewOrderModal = root.querySelector('#open-new-order-modal');
    const exportOrdersButton = root.querySelector('#export-orders');
    const newOrderModal = root.querySelector('#new-order-modal');
    const closeNewOrderModal = root.querySelector('#close-new-order-modal');
    const cancelOrderButton = root.querySelector('#cancel-order');
    const saveOrderButton = root.querySelector('#save-order');
    const clientSelect = root.querySelector('#client-select');
    const clientList = root.querySelector('#client-list');
    const orderDate = root.querySelector('#order-date');
    const subtotalOutput = root.querySelector('#summary-subtotal');
    const retentionOutput = root.querySelector('#summary-retention');
    const totalOutput = root.querySelector('#summary-total');
    const orderRows = root.querySelector('#order-rows');
    const addRowButton = root.querySelector('#add-order-row');
    const addProductModal = root.querySelector('#add-product-modal');
    const productSearch = root.querySelector('#order-product-search');
    const productQty = root.querySelector('#order-product-qty');
    const productMatch = root.querySelector('#order-product-match');
    const productPreview = root.querySelector('#order-product-preview');

    let currentMatch = null;
    let cachedProducts = [];
    let cachedClients = [];
    let pendingPage = 1;
    let confirmedPage = 1;
    const ordersPerPage = 10;
    let currentPaymentType = 'Contado';

    const formatMoney = (value) => `C$${Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const toISODateInputValue = (date) => {
      const instance = date instanceof Date ? date : new Date(date);
      if (Number.isNaN(instance.getTime())) return '';
      const offset = instance.getTimezoneOffset() * 60000;
      return new Date(instance.getTime() - offset).toISOString().slice(0, 10);
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

    const openStockDecisionModal = ({ productName, warehouseName, available = 0, required = 0, insufficient = false }) => new Promise((resolve) => {
      const existing = document.getElementById('stock-check-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'stock-check-modal';
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,37,66,0.32); backdrop-filter:blur(8px); z-index:120; display:flex; align-items:center; justify-content:center; padding:1.5rem;';

      const title = insufficient
        ? `Stock insuficiente de ${productName}`
        : `Producto sin existencias`;

      const detail = insufficient
        ? `Producto sin existencias en bodega "${warehouseName}". Disponible: ${available}. Requerido: ${required}.`
        : `Producto sin existencias en bodega "${warehouseName}".`;

      modal.innerHTML = `
        <div class="catalog-card" style="width:100%; max-width:34rem; padding:1.2rem; display:grid; gap:0.9rem;">
          <div style="display:flex; gap:0.7rem; align-items:flex-start;">
            <span class="material-symbols-outlined" style="color:#ba1a1a; font-size:1.7rem;">warning</span>
            <div>
              <h4 style="margin:0; color:#002542;">${title}</h4>
              <p style="margin:0.35rem 0 0; color:#43474d;">${detail}</p>
              <p style="margin:0.35rem 0 0; color:#43474d; font-weight:600;">¿Desea modificar o cancelar el pedido?</p>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.6rem; flex-wrap:wrap;">
            <button id="stock-decision-modify" class="secondary-btn" type="button">Modificar pedido</button>
            <button id="stock-decision-cancel" class="ghost-button" type="button" style="color:#ba1a1a; border-color:#ffc2c2;">Cancelar pedido</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const close = (decision) => {
        modal.remove();
        resolve(decision);
      };

      modal.querySelector('#stock-decision-modify')?.addEventListener('click', () => close('modify'));
      modal.querySelector('#stock-decision-cancel')?.addEventListener('click', () => close('cancel'));
      modal.addEventListener('click', (event) => {
        if (event.target === modal) close('modify');
      });
    });

    const validateStockBeforeSave = async (items) => {
      if (!api?.listInventory) {
        return { ok: true };
      }

      const inventoryRows = await api.listInventory().catch(() => []);
      if (!Array.isArray(inventoryRows) || inventoryRows.length === 0) {
        return { ok: true };
      }

      const groupedBySku = inventoryRows.reduce((acc, row) => {
        const sku = String(row.CodigoProducto || '').trim().toUpperCase();
        if (!sku) return acc;
        if (!acc[sku]) acc[sku] = [];
        acc[sku].push(row);
        return acc;
      }, {});

      for (const item of items) {
        const sku = String(item.sku || '').trim().toUpperCase();
        if (!sku) continue;

        const rows = groupedBySku[sku] || [];
        const totalAvailable = rows.reduce((sum, row) => sum + Number(row.Existencia || 0), 0);
        const preferredWarehouse = rows.length
          ? rows.slice().sort((a, b) => Number(b.Existencia || 0) - Number(a.Existencia || 0))[0].NombreBodega
          : 'Sin bodega asignada';

        if (totalAvailable <= 0) {
          return {
            ok: false,
            productName: item.name || sku,
            warehouseName: preferredWarehouse || 'Sin bodega asignada',
            insufficient: false,
            available: totalAvailable,
            required: Number(item.qty || 0),
          };
        }

        if (totalAvailable < Number(item.qty || 0)) {
          return {
            ok: false,
            productName: item.name || sku,
            warehouseName: preferredWarehouse || 'Sin bodega asignada',
            insufficient: true,
            available: totalAvailable,
            required: Number(item.qty || 0),
          };
        }
      }

      return { ok: true };
    };

    const updatePaymentTypeButtons = () => {
      Array.from(root.querySelectorAll('.payment-type-option')).forEach((button) => {
        const isActive = normalizePaymentType(button.dataset.paymentType) === currentPaymentType;
        button.classList.toggle('active', isActive);
        button.style.background = isActive ? '#002542' : '#f2f4f6';
        button.style.color = isActive ? '#ffffff' : '#002542';
        button.style.boxShadow = isActive ? '0 8px 18px rgba(0,37,66,0.18)' : 'none';
      });

      const helper = root.querySelector('#payment-type-helper');
      if (helper) {
        helper.textContent = currentPaymentType === 'Credito'
          ? 'Crédito genera una cuenta por cobrar cuando confirmes el pedido.'
          : 'Contado mantiene el flujo actual y no crea cuentas por cobrar.';
      }
    };

    const setPaymentType = (value) => {
      currentPaymentType = normalizePaymentType(value);
      updatePaymentTypeButtons();
    };

    const resetOrderBuilder = () => {
      if (clientSelect) clientSelect.value = '';
      if (orderDate) orderDate.value = toISODateInputValue(new Date());
      if (orderRows) {
        orderRows.innerHTML = '<tr id="order-empty-row"><td colspan="5" style="text-align:center; color:#73777e;">Sin productos en el pedido. Usa "Agregar producto".</td></tr>';
      }
      if (productPreview) {
        productPreview.innerHTML = '<div class="field-input" data-empty="true" style="color:#73777e;">Aún no has agregado productos a la vista previa.</div>';
      }
      if (productSearch) productSearch.value = '';
      if (productQty) productQty.value = '1';
      currentMatch = null;
      currentPaymentType = 'Contado';
      updatePaymentTypeButtons();
      recalc();
    };

    const recalc = () => {
      let subtotal = 0;

      root.querySelectorAll('.order-row').forEach((row) => {
        const qty = Number(row.querySelector('.order-qty')?.value || 0);
        const price = Number(row.querySelector('.order-price')?.value || 0);
        const rowTotal = qty * price;
        const subtotalCell = row.querySelector('.order-subtotal');

        subtotal += rowTotal;
        if (subtotalCell) subtotalCell.textContent = formatMoney(rowTotal);
      });

      const retentionRate = Number(localStorage.getItem('retentionRate') || 0) / 100;
      const retentionValueAmount = subtotal * retentionRate;
      const total = subtotal - retentionValueAmount;

      if (subtotalOutput) subtotalOutput.textContent = formatMoney(subtotal);
      if (retentionOutput) retentionOutput.textContent = `- ${formatMoney(retentionValueAmount)}`;
      if (totalOutput) totalOutput.textContent = formatMoney(total);
    };

    const loadClients = async () => {
      if (!api?.listClients) return [];
      try { return await api.listClients(); } catch { return []; }
    };

    const loadCatalogProducts = async () => {
      if (!api?.listProducts) return [];
      try { return await api.listProducts(); } catch { return []; }
    };

    const loadLookups = async () => {
      cachedClients = await loadClients();
      cachedProducts = await loadCatalogProducts();

      if (clientList && cachedClients.length > 0) {
        clientList.innerHTML = cachedClients.map((client) => {
          const name = client.NombreCliente || client.name || '';
          const cedula = client.Cedula || client.id || '';
          return `<option value="${escapeHtml(name)}"><option value="${escapeHtml(cedula)}">`;
        }).join('');
      }
    };

    const isPendingOrder = (order) => String(order?.Estado || 'Pendiente').trim().toLowerCase() === 'pendiente';

    const renderPager = (host, currentPage, totalPages, type) => {
      if (!host) return;
      if (totalPages <= 1) {
        host.innerHTML = '';
        return;
      }

      const buttons = [];
      buttons.push(`<button class="ghost-button" type="button" data-page-nav="prev" data-page-type="${type}" ${currentPage === 1 ? 'disabled' : ''} style="min-width:2.25rem; padding:0.35rem 0.6rem;">‹</button>`);
      for (let page = 1; page <= totalPages; page += 1) {
        buttons.push(`<button class="${page === currentPage ? 'filter-button active' : 'filter-button'}" type="button" data-page-number="${page}" data-page-type="${type}" style="min-width:2.25rem;">${page}</button>`);
      }
      buttons.push(`<button class="ghost-button" type="button" data-page-nav="next" data-page-type="${type}" ${currentPage === totalPages ? 'disabled' : ''} style="min-width:2.25rem; padding:0.35rem 0.6rem;">›</button>`);
      host.innerHTML = buttons.join('');
    };

    const renderOrderTable = ({ gridHost, countHost, pagerHost, rows, emptyMessage, type, page }) => {
      if (!gridHost || !countHost) return page;

      const totalRows = rows.length;
      const totalPages = Math.max(1, Math.ceil(totalRows / ordersPerPage));
      const safePage = Math.min(Math.max(1, page), totalPages);
      const startIndex = (safePage - 1) * ordersPerPage;
      const pageRows = rows.slice(startIndex, startIndex + ordersPerPage);
      const showingFrom = totalRows === 0 ? 0 : startIndex + 1;
      const showingTo = Math.min(startIndex + ordersPerPage, totalRows);

      countHost.textContent = `Mostrando ${showingFrom}-${showingTo} de ${totalRows} pedidos ${type === 'pending' ? 'pendientes' : 'confirmados'}`;

      if (!pageRows.length) {
        gridHost.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#73777e;">${emptyMessage}</td></tr>`;
        if (pagerHost) pagerHost.innerHTML = '';
        return safePage;
      }

      gridHost.innerHTML = pageRows.map((order) => {
        const estado = order.Estado || 'Pendiente';
        const fecha = order.FechaEmision ? new Date(order.FechaEmision).toLocaleDateString('es-ES') : '--';
        const badgeClass = estado === 'Confirmado' ? 'active' : '';
        const paymentType = normalizePaymentType(order.TipoPago);
        return `
          <tr>
            <td>#${order.PedidoID}</td>
            <td>${escapeHtml(order.NombreCliente || 'Cliente')}</td>
            <td>${fecha}</td>
            <td>
              <div style="display:grid; gap:0.35rem; justify-items:start;">
                <span class="chip ${badgeClass}" style="display:inline-flex;">${estado}</span>
                <span class="chip" style="display:inline-flex; background:${paymentType === 'Credito' ? '#fde68a' : '#d1fae5'}; color:#002542; font-size:0.72rem;">${paymentType}</span>
              </div>
            </td>
            <td style="text-align:right;">${formatMoney(order.Total)}</td>
            <td>
              <div class="row-actions" style="justify-content:center; flex-wrap:wrap; gap:0.45rem;">
                <button class="icon-button" type="button" data-order-action="preview" data-order-id="${order.PedidoID}" aria-label="Ver pedido en solo lectura"><span class="material-symbols-outlined">visibility</span></button>
                ${estado === 'Pendiente' ? `<button class="icon-button" type="button" data-order-action="confirm" data-order-id="${order.PedidoID}" aria-label="Confirmar pedido"><span class="material-symbols-outlined">task_alt</span></button>` : ''}
                <button class="icon-button" type="button" data-order-action="delete" data-order-id="${order.PedidoID}" aria-label="Eliminar pedido"><span class="material-symbols-outlined">delete</span></button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      renderPager(pagerHost, safePage, totalPages, type);
      return safePage;
    };

    const renderOrders = async () => {
      if (!root.isConnected) return;
      if (!ordersGridPending || !ordersGridConfirmed) return;
      const orders = api?.listOrders ? await api.listOrders().catch(() => []) : [];
      const pendingOrders = orders.filter((order) => isPendingOrder(order));
      const confirmedOrders = orders.filter((order) => !isPendingOrder(order));

      pendingPage = renderOrderTable({
        gridHost: ordersGridPending,
        countHost: ordersCountPending,
        pagerHost: ordersPaginationPending,
        rows: pendingOrders,
        emptyMessage: 'No hay pedidos pendientes.',
        type: 'pending',
        page: pendingPage,
      });

      confirmedPage = renderOrderTable({
        gridHost: ordersGridConfirmed,
        countHost: ordersCountConfirmed,
        pagerHost: ordersPaginationConfirmed,
        rows: confirmedOrders,
        emptyMessage: 'No hay pedidos confirmados.',
        type: 'confirmed',
        page: confirmedPage,
      });
    };

    const exportOrdersToExcel = async () => {
      if (!window.XLSX) {
        window.showAlert('No se pudo cargar el módulo de Excel.', 'error');
        return;
      }

      const orders = api?.listOrders ? await api.listOrders().catch(() => []) : [];
      if (!orders.length) {
        window.showAlert('No hay pedidos para exportar.', 'warning');
        return;
      }

      const toRows = (source) => source.map((order) => ({
        'ID Pedido': order.PedidoID || '',
        'Cliente': order.NombreCliente || 'Cliente',
        'Fecha Emision': order.FechaEmision ? new Date(order.FechaEmision).toLocaleDateString('es-ES') : '',
        'Estado': order.Estado || 'Pendiente',
        'Tipo Pago': normalizePaymentType(order.TipoPago),
        'Total (C$)': Number(order.Total || 0),
      }));

      const pendingRows = toRows(orders.filter((order) => isPendingOrder(order)));
      const confirmedRows = toRows(orders.filter((order) => !isPendingOrder(order)));

      const ensureSheetRows = (rows) => rows.length ? rows : [{ 'ID Pedido': '', 'Cliente': '', 'Fecha Emision': '', 'Estado': '', 'Tipo Pago': '', 'Total (C$)': 0 }];
      const wsPending = XLSX.utils.json_to_sheet(ensureSheetRows(pendingRows));
      const wsConfirmed = XLSX.utils.json_to_sheet(ensureSheetRows(confirmedRows));

      const configureSheet = (ws, count) => {
        ws['!cols'] = [
          { wch: 12 },
          { wch: 30 },
          { wch: 16 },
          { wch: 14 },
          { wch: 14 },
          { wch: 14 },
        ];

        for (let i = 2; i <= count + 1; i += 1) {
          const cell = ws[`F${i}`];
          if (cell) cell.z = '"C$" #,##0.00';
        }

        ws['!autofilter'] = { ref: `A1:F${Math.max(2, count + 1)}` };
      };

      configureSheet(wsPending, pendingRows.length);
      configureSheet(wsConfirmed, confirmedRows.length);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsPending, 'Pendientes');
      XLSX.utils.book_append_sheet(wb, wsConfirmed, 'Confirmados');
      XLSX.writeFile(wb, 'pedidos.xlsx');
    };

    const createRowFromProduct = (product, qty) => {
      if (!orderRows) return;
      const row = document.createElement('tr');
      row.className = 'order-row';
      const sku = product.CodigoProducto || product.codigoProducto || product.sku || '';
      const name = product.NombreProducto || product.nombreProducto || product.name || '';
      const price = Number(product.Precio ?? product.precio ?? 0);

      row.innerHTML = `
        <td>
          <div class="product-meta">
            <div class="thumb"></div>
            <div>
              <p class="order-product-name" style="margin:0; font-weight:700; color:#002542;">${escapeHtml(name)}</p>
              <p class="order-product-sku" style="margin:0.2rem 0 0; font-size:0.72rem; color:#43474d;">SKU: ${escapeHtml(sku)}</p>
            </div>
          </div>
        </td>
        <td style="text-align:center;"><input class="field-input order-qty" type="number" min="1" value="${qty}" style="text-align:center; padding:0.45rem; width:5rem; margin:0 auto;" /></td>
        <td style="text-align:right;"><input class="field-input order-price" type="number" min="0" step="0.01" value="${price}" readonly style="text-align:right; padding:0.45rem; width:7rem; margin-left:auto;" /></td>
        <td class="order-subtotal" style="text-align:right; font-weight:700; color:#002542;">$0.00</td>
        <td style="text-align:right;"><button class="delete-order-row icon-button" type="button"><span class="material-symbols-outlined text-error">delete</span></button></td>
      `;

      orderRows.querySelector('#order-empty-row')?.remove();
      orderRows.appendChild(row);
      row.querySelector('.order-qty')?.addEventListener('input', recalc);
      row.querySelector('.delete-order-row')?.addEventListener('click', () => {
        row.remove();
        recalc();
      });
      recalc();
    };

    const createPreviewItem = (product, qty) => {
      const item = document.createElement('div');
      item.className = 'field-input';
      item.dataset.sku = product.CodigoProducto || product.codigoProducto || product.sku;
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.style.gap = '0.75rem';
      item.innerHTML = `
        <span style="display:grid; gap:0.15rem;">
          <strong style="color:#002542;">${escapeHtml(product.CodigoProducto || product.sku)}</strong>
          <span style="color:#43474d; font-size:0.82rem;">${escapeHtml(product.NombreProducto || product.name)}</span>
        </span>
        <span style="display:flex; align-items:center; gap:0.75rem;">
          <strong data-qty="${qty}" style="color:#002542;">${qty} unidades</strong>
          <button class="delete-preview-item icon-button" type="button" aria-label="Quitar producto de la vista previa"><span class="material-symbols-outlined text-error">delete</span></button>
        </span>
      `;

      item.querySelector('.delete-preview-item')?.addEventListener('click', () => {
        item.remove();
        if (productPreview && productPreview.children.length === 0) {
          productPreview.innerHTML = '<div class="field-input" data-empty="true" style="color:#73777e;">Aún no has agregado productos a la vista previa.</div>';
        }
      });

      return item;
    };

    const addProductToPreview = () => {
      if (!currentMatch || !productPreview) return;
      const qty = Math.max(1, Number(productQty?.value || 1));
      productPreview.querySelector('[data-empty="true"]')?.remove();

      const sku = currentMatch.CodigoProducto || currentMatch.codigoProducto || currentMatch.sku;
      const existing = Array.from(productPreview.querySelectorAll('[data-sku]')).find((item) => item.dataset.sku === sku);
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

      productPreview.appendChild(createPreviewItem(currentMatch, qty));
    };

    const finalizePreview = () => {
      if (!productPreview) return;
      Array.from(productPreview.querySelectorAll('[data-sku]')).forEach((item) => {
        const sku = item.dataset.sku || '';
        const product = cachedProducts.find((entry) => (entry.CodigoProducto || entry.codigoProducto || entry.sku) === sku);
        const qty = Number(item.querySelector('[data-qty]')?.getAttribute('data-qty') || '1');
        if (product) createRowFromProduct(product, qty);
      });

      productPreview.innerHTML = '<div class="field-input" data-empty="true" style="color:#73777e;">Aún no has agregado productos a la vista previa.</div>';
      hideModal(addProductModal);
    };

    const createNewOrder = async () => {
      if (!api?.createOrder) {
        window.showAlert('La API no está disponible.', 'error');
        return;
      }

      const orderDateValue = orderDate?.value?.trim();
      if (!orderDateValue) {
        window.showAlert('Debes indicar la fecha del pedido antes de guardarlo.', 'warning');
        orderDate?.focus();
        return;
      }

      const items = Array.from(root.querySelectorAll('.order-row')).map((row) => ({
        name: row.querySelector('.order-product-name')?.textContent?.trim() || 'Producto',
        sku: row.querySelector('.order-product-sku')?.textContent?.replace(/^SKU:\s*/i, '').trim() || '',
        qty: Number(row.querySelector('.order-qty')?.value || 0),
        price: Number(row.querySelector('.order-price')?.value || 0),
      })).filter((item) => item.qty > 0);

      if (!clientSelect?.value) {
        window.showAlert('Selecciona un cliente antes de guardar el pedido.', 'warning');
        return;
      }

      if (items.length === 0) {
        window.showAlert('Agrega al menos un producto al pedido.', 'warning');
        return;
      }

      const stockValidation = await validateStockBeforeSave(items);
      if (!stockValidation.ok) {
        const decision = await openStockDecisionModal(stockValidation);
        if (decision === 'cancel') {
          hideModal(addProductModal);
          hideModal(newOrderModal);
          resetOrderBuilder();
          return;
        }

        showModal(newOrderModal);
        addRowButton?.focus();
        return;
      }

      try {
        await api.createOrder({ clientIdentifier: clientSelect.value, orderDate: orderDateValue, fechaEmision: orderDateValue, paymentType: currentPaymentType, tipoPago: currentPaymentType, items });
        hideModal(newOrderModal);
        resetOrderBuilder();
        await renderOrders();
      } catch (error) {
        window.showAlert(error.message || 'No fue posible guardar el pedido.', 'error');
      }
    };

    openNewOrderModal?.addEventListener('click', () => {
      resetOrderBuilder();
      showModal(newOrderModal);
    });

    root.querySelectorAll('.payment-type-option').forEach((button) => {
      button.addEventListener('click', () => setPaymentType(button.dataset.paymentType || 'Contado'));
    });

    closeNewOrderModal?.addEventListener('click', () => hideModal(newOrderModal));
    cancelOrderButton?.addEventListener('click', () => hideModal(newOrderModal));
    newOrderModal?.addEventListener('click', (event) => {
      if (event.target === newOrderModal) hideModal(newOrderModal);
    });

    addRowButton?.addEventListener('click', () => showModal(addProductModal));
    root.querySelector('#close-add-product-modal')?.addEventListener('click', () => hideModal(addProductModal));
    root.querySelector('#cancel-add-product')?.addEventListener('click', () => hideModal(addProductModal));
    addProductModal?.addEventListener('click', (event) => {
      if (event.target === addProductModal) hideModal(addProductModal);
    });

    // Debounce helper
    const debounce = (fn, delay = 300) => {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    };

    const productDropdown = root.querySelector('#order-product-dropdown');

    const performSearch = async (query) => {
      if (!query || query.trim().length < 1) {
        productDropdown.style.display = 'none';
        productMatch.textContent = 'Escribe un código o nombre para buscar.';
        currentMatch = null;
        return;
      }

      try {
        const results = await window.appApi.searchProducts(query);
        
        if (!Array.isArray(results) || results.length === 0) {
          productDropdown.style.display = 'none';
          productMatch.textContent = 'No se encontraron productos. Intenta con otra búsqueda.';
          currentMatch = null;
          return;
        }

        // Mostrar dropdown con resultados
        productDropdown.innerHTML = results.map((product, idx) => `
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
        Array.from(productDropdown.querySelectorAll('.search-result-item')).forEach((item) => {
          item.addEventListener('mouseenter', () => item.style.background = '#f2f4f6');
          item.addEventListener('mouseleave', () => item.style.background = 'white');
          item.addEventListener('click', () => {
            const idx = Number(item.dataset.index);
            const selected = results[idx];
            if (selected) {
              currentMatch = selected;
              productSearch.value = selected.CodigoProducto;
              productMatch.innerHTML = `<strong style="color:#002542;">${escapeHtml(selected.CodigoProducto)}</strong> - ${escapeHtml(selected.NombreProducto)}`;
              productDropdown.style.display = 'none';
            }
          });
        });

        productDropdown.style.display = 'block';
      } catch (error) {
        console.error('[SearchProducts] Error:', error);
        productDropdown.style.display = 'none';
        productMatch.textContent = 'Error al buscar. Intenta de nuevo.';
        currentMatch = null;
      }
    };

    const debouncedSearch = debounce(performSearch, 300);

    productSearch?.addEventListener('input', () => {
      debouncedSearch(productSearch.value);
    });

    productSearch?.addEventListener('blur', () => {
      setTimeout(() => {
        productDropdown.style.display = 'none';
      }, 200);
    });

    root.querySelector('#confirm-add-product')?.addEventListener('click', addProductToPreview);
    root.querySelector('#finalize-add-product')?.addEventListener('click', finalizePreview);
    exportOrdersButton?.addEventListener('click', exportOrdersToExcel);
    saveOrderButton?.addEventListener('click', createNewOrder);

    const confirmOrderById = async (orderId, discount = null) => {
      if (!api?.confirmOrder) {
        window.showAlert('La API no está disponible.');
        return false;
      }

      try {
        const discountRate = Number(discount?.rate || 0) / 100;
        const invoicePayload = await api.confirmOrder(orderId, {
          retentionRate: Number(localStorage.getItem('retentionRate') || 0) / 100,
          ivaRate: Number(localStorage.getItem('ivaRate') || 0) / 100,
          discountRate,
          discountName: discount?.name || '',
        });

        if (invoicePayload) {
          const normalizedInvoice = invoicePayload.items ? invoicePayload : {
            ...invoicePayload,
            documentNumber: invoicePayload.documentNumber || `#FAC-${invoicePayload.invoice?.FacturaID || '--'}`,
            issueDate: invoicePayload.issueDate || invoicePayload.invoice?.FechaEmision,
            clientName: invoicePayload.clientName || invoicePayload.invoice?.NombreCliente,
            subtotal: invoicePayload.subtotal ?? 0,
            impuestos: invoicePayload.impuestos ?? invoicePayload.invoice?.Impuestos ?? 0,
            retencion: invoicePayload.retencion ?? invoicePayload.invoice?.Retencion ?? 0,
            descuento: invoicePayload.descuento ?? 0,
            descuentoNombre: invoicePayload.descuentoNombre || '',
            total: invoicePayload.total ?? invoicePayload.invoice?.Total ?? 0,
            items: invoicePayload.items || [],
          };

          openInvoiceModal(normalizedInvoice);
          await renderOrders();
          return true;
        }

        await renderOrders();
        return true;
      } catch (error) {
        console.error('Error confirmando pedido:', error);
        window.showAlert(error.message || 'No fue posible confirmar el pedido.', 'error');
        return false;
      }
    };

    root.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-order-action]');
      if (!button) return;

      const orderId = button.dataset.orderId;
      const action = button.dataset.orderAction;
      if (!orderId) return;

      if (action === 'preview') {
        if (!api?.getOrder) {
          window.showAlert('La API de detalle de pedidos no está disponible.', 'error');
          return;
        }

        try {
          button.disabled = true;
          button.style.opacity = '0.6';
          button.style.pointerEvents = 'none';

          const orderDetail = await api.getOrder(orderId);
          openOrderPreviewModal(orderDetail);
        } catch (error) {
          window.showAlert(error.message || 'No fue posible cargar la vista previa del pedido.', 'error');
        } finally {
          button.disabled = false;
          button.style.opacity = '';
          button.style.pointerEvents = '';
        }
        return;
      }

      if (action === 'confirm') {
        if (!api?.getOrder) {
          window.showAlert('La API de detalle de pedidos no está disponible.', 'error');
          return;
        }

        try {
          button.disabled = true;
          button.style.opacity = '0.6';
          button.style.pointerEvents = 'none';

          const orderDetail = await api.getOrder(orderId);
          openOrderPreviewModal(orderDetail, {
            canConfirm: true,
            onConfirm: async (discount) => confirmOrderById(orderId, discount),
          });
        } catch (error) {
          window.showAlert(error.message || 'No fue posible cargar la vista previa para confirmar el pedido.', 'error');
        } finally {
          button.disabled = false;
          button.style.opacity = '';
          button.style.pointerEvents = '';
        }
        return;
      }

      if (action === 'delete') {
        if (!api?.deleteOrder) {
          window.showAlert('La API no está disponible.', 'error');
          return;
        }

        if (!window.confirm('¿Eliminar definitivamente este pedido?')) return;

        try {
          await api.deleteOrder(orderId);
          await renderOrders();
        } catch (error) {
          window.showAlert(error.message || 'No fue posible eliminar el pedido.', 'error');
        }
      }
    });

    root.addEventListener('click', (event) => {
      const pageButton = event.target.closest('[data-page-number]');
      const navButton = event.target.closest('[data-page-nav]');

      if (pageButton) {
        const pageType = pageButton.dataset.pageType;
        const page = Number(pageButton.dataset.pageNumber || '1');
        if (pageType === 'pending') pendingPage = page;
        if (pageType === 'confirmed') confirmedPage = page;
        renderOrders();
        return;
      }

      if (navButton) {
        const pageType = navButton.dataset.pageType;
        if (pageType === 'pending') {
          if (navButton.dataset.pageNav === 'prev') pendingPage = Math.max(1, pendingPage - 1);
          if (navButton.dataset.pageNav === 'next') pendingPage += 1;
        }
        if (pageType === 'confirmed') {
          if (navButton.dataset.pageNav === 'prev') confirmedPage = Math.max(1, confirmedPage - 1);
          if (navButton.dataset.pageNav === 'next') confirmedPage += 1;
        }
        renderOrders();
      }
    });

    loadLookups().then(() => {
      if (clientSelect && cachedClients.length > 0 && !clientSelect.value) {
        clientSelect.value = cachedClients[0].NombreCliente || cachedClients[0].name || '';
      }
    });

    resetOrderBuilder();
    renderOrders();
  }
};


