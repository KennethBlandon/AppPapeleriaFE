(() => {
  const getBaseUrl = () => {
    // Prioridad: localStorage (override manual) > configuración de la app (config.json) > default
    const fromStorage = localStorage.getItem('apiServer');
    if (fromStorage) {
      return String(fromStorage).replace(/\/$/, '');
    }
    const fromConfig = String(window.appConfig?.apiBaseUrl || '').replace(/\/$/, '');
    return fromConfig || 'http://localhost:3000';
  };

  const request = async (path, options = {}) => {
    const token = window.appSession?.getToken();
    let response;

    try {
      response = await fetch(`${getBaseUrl()}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });
    } catch {
      throw new Error(`No hay conexión con el servidor (${getBaseUrl()}).`);
    }

    if (response.status === 401 && !options.skipAuthRedirect) {
      window.appSession?.redirectToLogin();
      throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
    }

    if (!response.ok) {
      let message = `Error HTTP ${response.status}`;
      try {
        const data = await response.json();
        message = data.error || data.message || message;
      } catch {
        try {
          message = await response.text() || message;
        } catch {
          // Use the default error text.
        }
      }

      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  window.appApi = {
    request,
    getBaseUrl,
    getHealth: () => request('/api/health'),
    login: (user, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ user, password }), skipAuthRedirect: true }),
    verifyPassword: (password) => request('/api/auth/verify-password', { method: 'POST', body: JSON.stringify({ password }), skipAuthRedirect: true }),
    searchProducts: (term) => request(`/api/productos/buscar/${encodeURIComponent(term)}`),
    listProducts: () => request('/api/productos'),
    createProduct: (payload) => request('/api/productos', { method: 'POST', body: JSON.stringify(payload) }),
    updateProduct: (id, payload) => request(`/api/productos/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteProduct: (id) => request(`/api/productos/${id}`, { method: 'DELETE' }),
    listClients: () => request('/api/clientes'),
    createClient: (payload) => request('/api/clientes', { method: 'POST', body: JSON.stringify(payload) }),
    updateClient: (id, payload) => request(`/api/clientes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteClient: (id) => request(`/api/clientes/${id}`, { method: 'DELETE' }),
    listProviders: () => request('/api/proveedores'),
    createProvider: (payload) => request('/api/proveedores', { method: 'POST', body: JSON.stringify(payload) }),
    updateProvider: (id, payload) => request(`/api/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteProvider: (id) => request(`/api/proveedores/${id}`, { method: 'DELETE' }),
    listWarehouses: () => request('/api/bodegas'),
    createWarehouse: (payload) => request('/api/bodegas', { method: 'POST', body: JSON.stringify(payload) }),
    listInventory: () => {
      const minStock = localStorage.getItem('minStock') || '5';
      return request(`/api/inventario?minStock=${minStock}`);
    },
    listIncoming: () => request('/api/ingresos'),
    listRemissions: () => request('/api/remisiones'),
    createIncome: (payload) => request('/api/inventario/ingresos', { method: 'POST', body: JSON.stringify(payload) }),
    createRemission: (payload) => request('/api/inventario/remisiones', { method: 'POST', body: JSON.stringify(payload) }),
    listOrders: () => request('/api/pedidos'),
    getOrder: (id) => request(`/api/pedidos/${id}`),
    createOrder: (payload) => request('/api/pedidos', { method: 'POST', body: JSON.stringify(payload) }),
    confirmOrder: (id, payload = {}) => request(`/api/pedidos/${id}/confirmar`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteOrder: (id) => request(`/api/pedidos/${id}`, { method: 'DELETE' }),
    listReceivables: () => request('/api/cuentas-por-cobrar'),
    listReceivablesHistory: () => request('/api/cuentas-por-cobrar/historial'),
    getReceivable: (id) => request(`/api/cuentas-por-cobrar/${id}`),
    addReceivablePayment: (id, payload) => request(`/api/cuentas-por-cobrar/${id}/abonos`, { method: 'POST', body: JSON.stringify(payload) }),
    listInvoices: () => request('/api/facturas'),
    createInvoice: (payload) => request('/api/facturas', { method: 'POST', body: JSON.stringify(payload) }),
    getLatestInvoice: () => request('/api/facturas/ultima'),
    getInvoice: (id) => request(`/api/facturas/${id}`),
    getStockAlerts: () => request('/api/inventario/alertas-stock'),
    getInventoryProductsWithStock: (searchTerm = '') => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      return request(`/api/inventario/productos-con-stock?${params.toString()}`);
    },
    updateInventoryMinStock: (inventarioId, stockMinimo) => request(`/api/inventario/${inventarioId}/stock-minimo`, { 
      method: 'PUT', 
      body: JSON.stringify({ stockMinimo }) 
    }),
    getDashboardSummary: () => {
      const minStock = localStorage.getItem('minStock') || '5';
      return request(`/api/dashboard/resumen?minStock=${minStock}`);
    },
    getCustomReport: (params = {}) => {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        search.append(key, String(value));
      });

      return request(`/api/reportes/personalizado?${search.toString()}`);
    },
  };
})();