window.reportesView = {
  title: 'Reportes Personalizados',
  subtitle: 'Genera reportes filtrados por cliente, proveedor, producto, fechas y estado operativo.',
  render() {
    return `
      <div class="view-wrap reportes-view">
        <div class="no-print" style="display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap;">
          <div>
            <span class="eyebrow">Análisis Operativo</span>
            <h3 style="margin:0.25rem 0 0; font-size:2rem; color:#002542;">Módulo de Reportes</h3>
            <p style="margin:0.4rem 0 0; color:#43474d; max-width:52rem;">Personaliza la información que necesitas con filtros por cliente, proveedor, producto, estado y rango de fechas.</p>
          </div>
          <button id="export-custom-report" class="cta-button" type="button" style="display:inline-flex; align-items:center; gap:0.45rem;">
            <span class="material-symbols-outlined">download</span>
            Exportar Excel
          </button>
        </div>

        <section class="catalog-card" style="padding:1rem 1.15rem; margin-bottom:1.25rem;">
          <div class="grid-2" style="grid-template-columns:repeat(2, minmax(0, 1fr)); gap:0.9rem; align-items:end;">
            <div class="field-group" style="margin:0;">
              <label>Tipo de reporte</label>
              <select id="report-type" class="field-select">
                <option value="pedidos_cliente">Pedidos por cliente</option>
                <option value="ingresos_proveedor">Ingresos por proveedor</option>
                <option value="ingresos_producto">Ingresos por código de producto</option>
                <option value="facturas_cliente">Facturas por cliente</option>
                <option value="cxc_cliente">Cuentas por cobrar por cliente</option>
                <option value="pedidos_pendientes">Pedidos pendientes</option>
                <option value="pedidos_confirmados">Pedidos confirmados</option>
                <option value="utilidades_cliente">Utilidades por cliente</option>
                <option value="utilidades_producto">Utilidades por producto</option>
              </select>
            </div>
            <div style="display:flex; gap:0.6rem; justify-content:flex-end; flex-wrap:wrap;">
              <button id="run-custom-report" class="cta-button" type="button">Generar reporte</button>
            </div>
          </div>

          <div class="grid-2" style="grid-template-columns:repeat(3, minmax(0, 1fr)); gap:0.9rem; margin-top:0.9rem;">
            <div id="report-client-wrap" class="field-group" style="margin:0;">
              <label>Cliente</label>
              <select id="report-client" class="field-select"><option value="">Selecciona un cliente...</option></select>
            </div>
            <div id="report-provider-wrap" class="field-group" style="margin:0; display:none;">
              <label>Proveedor</label>
              <select id="report-provider" class="field-select"><option value="">Selecciona un proveedor...</option></select>
            </div>
            <div id="report-product-wrap" class="field-group" style="margin:0; display:none;">
              <label>Código de producto</label>
              <input id="report-product-code" class="field-input" type="text" list="report-product-codes" placeholder="Ej: SKU-001" />
              <datalist id="report-product-codes"></datalist>
            </div>
          </div>

          <div class="grid-2" style="grid-template-columns:repeat(2, minmax(0, 1fr)); gap:0.9rem; margin-top:0.35rem;">
            <div class="field-group" style="margin:0;"><label>Fecha desde</label><input id="report-date-from" class="field-input" type="date" /></div>
            <div class="field-group" style="margin:0;"><label>Fecha hasta</label><input id="report-date-to" class="field-input" type="date" /></div>
          </div>
        </section>

        <section class="catalog-card" style="padding:1rem 1.15rem; margin-bottom:1.25rem;">
          <div class="grid-2" style="grid-template-columns:repeat(2, minmax(0, 1fr)); gap:0.9rem;">
            <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
              <p style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Filas del reporte</p>
              <strong id="report-row-count" style="font-size:2rem; color:#002542;">0</strong>
            </div>
            <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#f2f4f6;">
              <p id="report-total-label" style="margin:0 0 0.25rem; text-transform:uppercase; letter-spacing:0.16em; font-size:0.7rem; font-weight:800; color:#73777e;">Total</p>
              <strong id="report-total-value" style="font-size:2rem; color:#002542;">C$0.00</strong>
            </div>
          </div>
        </section>

        <section class="catalog-card">
          <div style="padding:1rem 1.15rem 0.5rem; display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; flex-wrap:wrap;">
            <div>
              <h4 id="report-title" style="margin:0; color:#002542; font-size:1.25rem;">Pedidos por cliente</h4>
              <p id="report-subtitle" style="margin:0.25rem 0 0; color:#43474d;">Selecciona filtros y genera el reporte.</p>
            </div>
            <span id="report-meta" style="color:#73777e; font-size:0.85rem;">Sin datos cargados.</span>
          </div>
          <div class="table-wrap">
            <table class="catalog-table">
              <thead id="report-table-head"></thead>
              <tbody id="report-table-body"><tr><td style="text-align:center; color:#73777e;">Genera un reporte para visualizar datos.</td></tr></tbody>
            </table>
          </div>
        </section>

        <section class="catalog-card" style="padding:1rem 1.15rem; margin-top:1.25rem;">
          <div class="grid-2" style="grid-template-columns:repeat(2, minmax(0, 1fr)); gap:0.9rem;">
            <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff; border:1px solid #e6e8ea;">
              <p id="report-chart-main-title" style="margin:0 0 0.65rem; color:#002542; font-weight:700;">Distribución principal</p>
              <canvas id="report-chart-main" height="190" style="width:100%;"></canvas>
            </div>
            <div class="catalog-card" style="padding:1rem; box-shadow:none; background:#ffffff; border:1px solid #e6e8ea;">
              <p style="margin:0 0 0.65rem; color:#002542; font-weight:700;">Tendencia por fecha</p>
              <canvas id="report-chart-trend" height="190" style="width:100%;"></canvas>
            </div>
          </div>
        </section>
      </div>
    `;
  },
  bind(root) {
    const api = window.appApi;

    const reportConfig = {
      pedidos_cliente: { title: 'Pedidos por cliente', subtitle: 'Listado de pedidos realizados por un cliente específico.', totalLabel: 'Monto total pedidos', totalField: 'Total', chartLabelField: 'PedidoID', chartLabelName: 'pedido', dateField: 'FechaEmision', needsClient: true, columns: [
        { key: 'PedidoID', label: 'Pedido', type: 'id', align: 'left' }, { key: 'NombreCliente', label: 'Cliente', type: 'text', align: 'left' }, { key: 'Cedula', label: 'Cédula', type: 'text', align: 'left' }, { key: 'FechaEmision', label: 'Fecha', type: 'date', align: 'left' }, { key: 'Estado', label: 'Estado', type: 'text', align: 'left' }, { key: 'TipoPago', label: 'Tipo pago', type: 'text', align: 'left' }, { key: 'Lineas', label: 'Líneas', type: 'number', align: 'right' }, { key: 'Total', label: 'Total', type: 'money', align: 'right' },
      ] },
      ingresos_proveedor: { title: 'Ingresos por proveedor', subtitle: 'Entradas de inventario realizadas por un proveedor específico.', totalLabel: 'Costo total ingresos', totalField: 'TotalCosto', chartLabelField: 'CodigoProducto', chartLabelName: 'producto', dateField: 'FechaIngreso', needsProvider: true, columns: [
        { key: 'IngresoID', label: 'Ingreso', type: 'id', align: 'left' }, { key: 'FechaIngreso', label: 'Fecha', type: 'date', align: 'left' }, { key: 'NombreProveedor', label: 'Proveedor', type: 'text', align: 'left' }, { key: 'CodigoProducto', label: 'Código', type: 'text', align: 'left' }, { key: 'NombreProducto', label: 'Producto', type: 'text', align: 'left' }, { key: 'NombreBodega', label: 'Bodega', type: 'text', align: 'left' }, { key: 'Cantidad', label: 'Cantidad', type: 'number', align: 'right' }, { key: 'Costo', label: 'Costo unitario', type: 'money', align: 'right' }, { key: 'TotalCosto', label: 'Costo total', type: 'money', align: 'right' },
      ] },
      ingresos_producto: { title: 'Ingresos por código de producto', subtitle: 'Entradas de inventario filtradas por código de producto.', totalLabel: 'Costo total ingresos', totalField: 'TotalCosto', chartLabelField: 'NombreProveedor', chartLabelName: 'proveedor', dateField: 'FechaIngreso', needsProductCode: true, columns: [
        { key: 'IngresoID', label: 'Ingreso', type: 'id', align: 'left' }, { key: 'FechaIngreso', label: 'Fecha', type: 'date', align: 'left' }, { key: 'CodigoProducto', label: 'Código', type: 'text', align: 'left' }, { key: 'NombreProducto', label: 'Producto', type: 'text', align: 'left' }, { key: 'NombreProveedor', label: 'Proveedor', type: 'text', align: 'left' }, { key: 'NombreBodega', label: 'Bodega', type: 'text', align: 'left' }, { key: 'Cantidad', label: 'Cantidad', type: 'number', align: 'right' }, { key: 'Costo', label: 'Costo unitario', type: 'money', align: 'right' }, { key: 'TotalCosto', label: 'Costo total', type: 'money', align: 'right' },
      ] },
      facturas_cliente: { title: 'Facturas por cliente', subtitle: 'Facturas emitidas a un cliente específico.', totalLabel: 'Monto total facturado', totalField: 'Total', chartLabelField: 'FacturaID', chartLabelName: 'factura', dateField: 'FechaEmision', needsClient: true, columns: [
        { key: 'FacturaID', label: 'Factura', type: 'id', align: 'left' }, { key: 'PedidoID', label: 'Pedido', type: 'id', align: 'left' }, { key: 'FechaEmision', label: 'Fecha', type: 'date', align: 'left' }, { key: 'NombreCliente', label: 'Cliente', type: 'text', align: 'left' }, { key: 'Cedula', label: 'Cédula', type: 'text', align: 'left' }, { key: 'Estado', label: 'Estado', type: 'text', align: 'left' }, { key: 'Impuestos', label: 'Impuestos', type: 'money', align: 'right' }, { key: 'Retencion', label: 'Retención', type: 'money', align: 'right' }, { key: 'Total', label: 'Total', type: 'money', align: 'right' },
      ] },
      cxc_cliente: { title: 'Cuentas por cobrar por cliente', subtitle: 'CxC asociadas a un cliente, con saldos y abonos.', totalLabel: 'Saldo pendiente total', totalField: 'SaldoPendiente', chartLabelField: 'NombreCuenta', chartLabelName: 'cuenta', dateField: 'FechaCreacion', needsClient: true, columns: [
        { key: 'CxCID', label: 'Cuenta', type: 'id', align: 'left' }, { key: 'NombreCuenta', label: 'Nombre cuenta', type: 'text', align: 'left' }, { key: 'NombreCliente', label: 'Cliente', type: 'text', align: 'left' }, { key: 'Cedula', label: 'Cédula', type: 'text', align: 'left' }, { key: 'FacturaID', label: 'Factura', type: 'id', align: 'left' }, { key: 'FechaCreacion', label: 'Creación', type: 'date', align: 'left' }, { key: 'Estado', label: 'Estado', type: 'text', align: 'left' }, { key: 'MontoOriginal', label: 'Monto original', type: 'money', align: 'right' }, { key: 'TotalAbonado', label: 'Total abonado', type: 'money', align: 'right' }, { key: 'SaldoPendiente', label: 'Saldo pendiente', type: 'money', align: 'right' }, { key: 'UltimoAbono', label: 'Último abono', type: 'date', align: 'right' },
      ] },
      pedidos_pendientes: { title: 'Pedidos pendientes', subtitle: 'Pedidos con estado pendiente.', totalLabel: 'Monto total pendiente', totalField: 'Total', chartLabelField: 'PedidoID', chartLabelName: 'pedido', dateField: 'FechaEmision', columns: [
        { key: 'PedidoID', label: 'Pedido', type: 'id', align: 'left' }, { key: 'FechaEmision', label: 'Fecha', type: 'date', align: 'left' }, { key: 'NombreCliente', label: 'Cliente', type: 'text', align: 'left' }, { key: 'Cedula', label: 'Cédula', type: 'text', align: 'left' }, { key: 'TipoPago', label: 'Tipo pago', type: 'text', align: 'left' }, { key: 'Lineas', label: 'Líneas', type: 'number', align: 'right' }, { key: 'Total', label: 'Total', type: 'money', align: 'right' },
      ] },
      pedidos_confirmados: { title: 'Pedidos confirmados', subtitle: 'Pedidos con estado confirmado.', totalLabel: 'Monto total confirmado', totalField: 'Total', chartLabelField: 'PedidoID', chartLabelName: 'pedido', dateField: 'FechaEmision', columns: [
        { key: 'PedidoID', label: 'Pedido', type: 'id', align: 'left' }, { key: 'FechaEmision', label: 'Fecha', type: 'date', align: 'left' }, { key: 'NombreCliente', label: 'Cliente', type: 'text', align: 'left' }, { key: 'Cedula', label: 'Cédula', type: 'text', align: 'left' }, { key: 'TipoPago', label: 'Tipo pago', type: 'text', align: 'left' }, { key: 'Lineas', label: 'Líneas', type: 'number', align: 'right' }, { key: 'Total', label: 'Total', type: 'money', align: 'right' },
      ] },
      utilidades_cliente: { title: 'Utilidades por cliente', subtitle: 'Ganancia por línea de producto para un cliente.', totalLabel: 'Ganancia total', totalField: 'GananciaTotal', chartLabelField: 'CodigoProducto', chartLabelName: 'producto', dateField: 'FechaEmision', needsClient: true, columns: [
        { key: 'FacturaID', label: 'Factura', type: 'id', align: 'left' }, { key: 'FechaEmision', label: 'Fecha', type: 'date', align: 'left' }, { key: 'NombreCliente', label: 'Cliente', type: 'text', align: 'left' }, { key: 'CodigoProducto', label: 'Código', type: 'text', align: 'left' }, { key: 'NombreProducto', label: 'Producto', type: 'text', align: 'left' }, { key: 'Cantidad', label: 'Cantidad', type: 'number', align: 'right' }, { key: 'CostoPromedioPonderado', label: 'Costo PPP', type: 'money', align: 'right' }, { key: 'PrecioVenta', label: 'Precio venta', type: 'money', align: 'right' }, { key: 'GananciaUnitaria', label: 'Ganancia unitaria', type: 'money', align: 'right' }, { key: 'GananciaTotal', label: 'Ganancia total', type: 'money', align: 'right' }, { key: 'MargenPorcentaje', label: 'Margen %', type: 'number', align: 'right' },
      ] },
      utilidades_producto: { title: 'Utilidades por producto', subtitle: 'Ganancia de un producto en distintos clientes.', totalLabel: 'Ganancia total', totalField: 'GananciaTotal', chartLabelField: 'NombreCliente', chartLabelName: 'cliente', dateField: 'FechaEmision', needsProductCode: true, columns: [
        { key: 'FacturaID', label: 'Factura', type: 'id', align: 'left' }, { key: 'FechaEmision', label: 'Fecha', type: 'date', align: 'left' }, { key: 'NombreCliente', label: 'Cliente', type: 'text', align: 'left' }, { key: 'Cedula', label: 'Cédula', type: 'text', align: 'left' }, { key: 'CodigoProducto', label: 'Código', type: 'text', align: 'left' }, { key: 'NombreProducto', label: 'Producto', type: 'text', align: 'left' }, { key: 'Cantidad', label: 'Cantidad', type: 'number', align: 'right' }, { key: 'CostoPromedioPonderado', label: 'Costo PPP', type: 'money', align: 'right' }, { key: 'PrecioVenta', label: 'Precio venta', type: 'money', align: 'right' }, { key: 'GananciaUnitaria', label: 'Ganancia unitaria', type: 'money', align: 'right' }, { key: 'GananciaTotal', label: 'Ganancia total', type: 'money', align: 'right' }, { key: 'MargenPorcentaje', label: 'Margen %', type: 'number', align: 'right' },
      ] },
    };

    const elements = {
      type: root.querySelector('#report-type'),
      clientWrap: root.querySelector('#report-client-wrap'),
      client: root.querySelector('#report-client'),
      providerWrap: root.querySelector('#report-provider-wrap'),
      provider: root.querySelector('#report-provider'),
      productWrap: root.querySelector('#report-product-wrap'),
      productCode: root.querySelector('#report-product-code'),
      productCodes: root.querySelector('#report-product-codes'),
      dateFrom: root.querySelector('#report-date-from'),
      dateTo: root.querySelector('#report-date-to'),
      run: root.querySelector('#run-custom-report'),
      exportExcel: root.querySelector('#export-custom-report'),
      rowCount: root.querySelector('#report-row-count'),
      totalLabel: root.querySelector('#report-total-label'),
      totalValue: root.querySelector('#report-total-value'),
      title: root.querySelector('#report-title'),
      subtitle: root.querySelector('#report-subtitle'),
      meta: root.querySelector('#report-meta'),
      tableHead: root.querySelector('#report-table-head'),
      tableBody: root.querySelector('#report-table-body'),
      chartMainTitle: root.querySelector('#report-chart-main-title'),
      chartMain: root.querySelector('#report-chart-main'),
      chartTrend: root.querySelector('#report-chart-trend'),
    };

    let currentRows = [];
    let currentConfig = reportConfig.pedidos_cliente;

    const formatMoney = (value) => `C$${Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const formatDate = (value) => {
      if (!value) return '--';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '--';
      return date.toLocaleDateString('es-ES');
    };

    const columnLetter = (index) => {
      let value = index;
      let result = '';
      while (value > 0) {
        const mod = (value - 1) % 26;
        result = String.fromCharCode(65 + mod) + result;
        value = Math.floor((value - 1) / 26);
      }
      return result;
    };

    const setSelectOptions = (element, placeholder, items, getValue, getLabel) => {
      const rows = Array.isArray(items) ? items : [];
      element.innerHTML = `<option value="">${placeholder}</option>` + rows.map((item) => `
        <option value="${escapeHtml(getValue(item))}">${escapeHtml(getLabel(item))}</option>
      `).join('');
    };

    const clearChart = (canvas, message) => {
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      const width = canvas.clientWidth || 460;
      const height = canvas.height || 190;
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#9aa0a6';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(message, width / 2, height / 2);
    };

    const drawBarChart = (canvas, labels, values, color) => {
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      const width = canvas.clientWidth || 460;
      const height = canvas.height || 190;
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);

      if (!labels.length || !values.length) {
        clearChart(canvas, 'Sin datos para graficar.');
        return;
      }

      const max = Math.max(...values, 0);
      if (max <= 0) {
        clearChart(canvas, 'Sin valores positivos para graficar.');
        return;
      }

      const padding = { top: 16, right: 8, bottom: 52, left: 44 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;
      const gap = Math.max(8, chartW / (labels.length * 4));
      const barW = Math.max(14, (chartW - (gap * (labels.length + 1))) / labels.length);

      ctx.strokeStyle = '#d9dde3';
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top);
      ctx.lineTo(padding.left, padding.top + chartH);
      ctx.lineTo(padding.left + chartW, padding.top + chartH);
      ctx.stroke();

      ctx.fillStyle = '#7b828a';
      ctx.font = '11px Inter';
      ctx.textAlign = 'right';
      ctx.fillText('0', padding.left - 6, padding.top + chartH + 4);
      ctx.fillText(formatMoney(max), padding.left - 6, padding.top + 4);

      labels.forEach((label, i) => {
        const val = values[i];
        const h = Math.max(2, (val / max) * chartH);
        const x = padding.left + gap + i * (barW + gap);
        const y = padding.top + chartH - h;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, barW, h);

        ctx.fillStyle = '#55606b';
        ctx.font = '10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(String(label || '').slice(0, 12), x + barW / 2, padding.top + chartH + 14);
      });
    };

    const refreshCharts = (rows, config) => {
      if (!rows.length) {
        clearChart(elements.chartMain, 'Genera un reporte para visualizar el gráfico.');
        clearChart(elements.chartTrend, 'Genera un reporte para visualizar el gráfico.');
        return;
      }

      const groupedMain = rows.reduce((acc, row) => {
        const key = String(row[config.chartLabelField] ?? '--');
        acc[key] = (acc[key] || 0) + Number(row[config.totalField] || 0);
        return acc;
      }, {});
      const mainPairs = Object.entries(groupedMain).sort((a, b) => b[1] - a[1]).slice(0, 8);
      elements.chartMainTitle.textContent = `Distribución por ${config.chartLabelName || 'criterio principal'}`;
      drawBarChart(elements.chartMain, mainPairs.map((x) => x[0]), mainPairs.map((x) => x[1]), '#2f80a5');

      if (!config.dateField) {
        clearChart(elements.chartTrend, 'Este reporte no tiene tendencia por fecha.');
        return;
      }

      const groupedTrend = rows.reduce((acc, row) => {
        const key = formatDate(row[config.dateField]);
        if (key === '--') return acc;
        acc[key] = (acc[key] || 0) + Number(row[config.totalField] || 0);
        return acc;
      }, {});
      const trendPairs = Object.entries(groupedTrend).sort((a, b) => {
        const [ad, am, ay] = a[0].split('/').map(Number);
        const [bd, bm, by] = b[0].split('/').map(Number);
        return new Date(ay, am - 1, ad) - new Date(by, bm - 1, bd);
      }).slice(-10);
      drawBarChart(elements.chartTrend, trendPairs.map((x) => x[0]), trendPairs.map((x) => x[1]), '#4a9d68');
    };

    const renderTable = (rows, columns) => {
      elements.tableHead.innerHTML = `<tr>${columns.map((col) => `<th style="text-align:${col.align || 'left'};">${col.label}</th>`).join('')}</tr>`;
      if (!rows.length) {
        elements.tableBody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align:center; color:#73777e;">No hay datos para mostrar.</td></tr>`;
        return;
      }

      const cell = (row, col) => {
        const value = row[col.key];
        if (col.type === 'money') return formatMoney(value);
        if (col.type === 'date') return formatDate(value);
        if (col.type === 'id') return value ? `#${value}` : '--';
        if (col.type === 'number') return Number(value || 0).toLocaleString('es-ES');
        return String(value ?? '--');
      };

      elements.tableBody.innerHTML = rows.map((row) => `<tr>${columns.map((col) => `<td style="text-align:${col.align || 'left'};">${cell(row, col)}</td>`).join('')}</tr>`).join('');
    };

    const updateReportHeader = (config) => {
      elements.title.textContent = config.title;
      elements.subtitle.textContent = config.subtitle;
      elements.totalLabel.textContent = config.totalLabel;
      elements.totalValue.textContent = 'C$0.00';
      elements.rowCount.textContent = '0';
      elements.meta.textContent = 'Sin datos cargados.';
      elements.chartMainTitle.textContent = 'Distribución principal';
    };

    const refreshKpis = (rows, config) => {
      const total = rows.reduce((sum, row) => sum + Number(row[config.totalField] || 0), 0);
      elements.rowCount.textContent = String(rows.length);
      elements.totalValue.textContent = formatMoney(total);
      elements.meta.textContent = rows.length
        ? `Reporte generado: ${new Date().toLocaleDateString('es-ES')} (${rows.length} filas).`
        : 'No se encontraron resultados para los filtros aplicados.';
    };

    const updateFilterVisibility = () => {
      const config = reportConfig[elements.type.value] || reportConfig.pedidos_cliente;
      elements.clientWrap.style.display = config.needsClient ? '' : 'none';
      elements.providerWrap.style.display = config.needsProvider ? '' : 'none';
      elements.productWrap.style.display = config.needsProductCode ? '' : 'none';
      currentConfig = config;
      currentRows = [];
      updateReportHeader(config);
      renderTable([], config.columns);
      refreshCharts([], config);
    };

    const buildParams = () => {
      const config = currentConfig;
      const params = { tipo: elements.type.value, fechaDesde: elements.dateFrom.value, fechaHasta: elements.dateTo.value };
      if (config.needsClient) params.clienteId = elements.client.value;
      if (config.needsProvider) params.proveedorId = elements.provider.value;
      if (config.needsProductCode) params.codigoProducto = (elements.productCode.value || '').trim();
      return params;
    };

    const validateRequiredFilters = (params) => {
      if (currentConfig.needsClient && !params.clienteId) {
        window.showAlert('Selecciona un cliente para generar este reporte.', 'warning');
        return false;
      }
      if (currentConfig.needsProvider && !params.proveedorId) {
        window.showAlert('Selecciona un proveedor para generar este reporte.', 'warning');
        return false;
      }
      if (currentConfig.needsProductCode && !params.codigoProducto) {
        window.showAlert('Escribe un código de producto para generar este reporte.', 'warning');
        return false;
      }
      return true;
    };

    const runReport = async () => {
      const params = buildParams();
      if (!validateRequiredFilters(params)) return;

      try {
        const rows = await api.getCustomReport(params);
        currentRows = Array.isArray(rows) ? rows : [];
        renderTable(currentRows, currentConfig.columns);
        refreshKpis(currentRows, currentConfig);
        refreshCharts(currentRows, currentConfig);
      } catch (error) {
        console.error('[Reportes] Error generating report:', error);
        window.showAlert(error.message || 'No fue posible generar el reporte.', 'error');
      }
    };

    const exportCurrentReport = () => {
      if (!window.XLSX) {
        window.showAlert('No se pudo cargar el módulo de Excel.', 'error');
        return;
      }
      if (!currentRows.length) {
        window.showAlert('Genera un reporte con datos antes de exportar.', 'warning');
        return;
      }

      const rows = currentRows.map((row) => {
        const item = {};
        currentConfig.columns.forEach((col) => {
          const value = row[col.key];
          if (col.type === 'money' || col.type === 'number') {
            item[col.label] = Number(value || 0);
          } else if (col.type === 'date') {
            item[col.label] = formatDate(value);
          } else {
            item[col.label] = value ?? '';
          }
        });
        return item;
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = currentConfig.columns.map(() => ({ wch: 18 }));
      ws['!autofilter'] = { ref: `A1:${columnLetter(currentConfig.columns.length)}${Math.max(2, rows.length + 1)}` };

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, `reporte-${elements.type.value}.xlsx`);
    };

    const loadFilterOptions = async () => {
      try {
        const [clients, providers, products] = await Promise.all([api.listClients(), api.listProviders(), api.listProducts()]);

        setSelectOptions(
          elements.client,
          'Selecciona un cliente...',
          clients,
          (item) => item.ClienteID,
          (item) => `${item.NombreCliente || 'Cliente'}${item.Cedula ? ` - ${item.Cedula}` : ''}`,
        );
        setSelectOptions(
          elements.provider,
          'Selecciona un proveedor...',
          providers,
          (item) => item.ProveedorID,
          (item) => item.NombreProveedor || 'Proveedor',
        );
        elements.productCodes.innerHTML = (Array.isArray(products) ? products : [])
          .filter((item) => item.CodigoProducto)
          .map((item) => `<option value="${escapeHtml(item.CodigoProducto)}">${escapeHtml(item.NombreProducto || '')}</option>`)
          .join('');
      } catch (error) {
        console.error('[Reportes] Error loading filters:', error);
        window.showAlert('No fue posible cargar los filtros del módulo de reportes.', 'error');
      }
    };

    elements.type.addEventListener('change', updateFilterVisibility);
    elements.run.addEventListener('click', runReport);
    elements.exportExcel.addEventListener('click', exportCurrentReport);

    updateFilterVisibility();
    loadFilterOptions();
  },
};
