/**
 * PATITO SHOP - LÓGICA DEL PANEL DE ADMINISTRACIÓN
 * Gestiona el inventario de productos, configuración de la tienda, pagos, cupones y pedidos.
 */

const AdminState = {
  products: [],
  config: {},
  coupons: {},
  orders: [],
  isAuthenticated: false
};

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupLucide();
});

function setupLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function checkAuth() {
  const isAuth = sessionStorage.getItem('patito_admin_auth') === 'true';
  const loginScreen = document.getElementById('admin-login-screen');
  const dashboard = document.getElementById('admin-dashboard');

  if (isAuth) {
    AdminState.isAuthenticated = true;
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadAdminData();
  } else {
    AdminState.isAuthenticated = false;
    loginScreen.classList.remove('hidden');
    dashboard.classList.add('hidden');
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value.trim();

  // Validación de credenciales de administrador
  if ((email === 'admin@patitoshop.com' && pass === 'patito2026') || pass === 'patito2026') {
    sessionStorage.setItem('patito_admin_auth', 'true');
    checkAuth();
    showAdminToast('¡Bienvenido al Panel de Administración de Patito SHOP!', 'success');
  } else {
    showAdminToast('Credenciales incorrectas. Usa admin@patitoshop.com / patito2026', 'error');
  }
}

function adminLogout() {
  sessionStorage.removeItem('patito_admin_auth');
  checkAuth();
  showAdminToast('Sesión de administrador cerrada', 'info');
}

// ==========================================================================
// CARGA DE DATOS & TABS
// ==========================================================================

function loadAdminData() {
  AdminState.products = getStoredProducts();
  AdminState.config = getStoreConfig();
  AdminState.coupons = getStoredCoupons();
  AdminState.orders = getStoredOrders();

  updateKPIs();
  renderAdminProductsTable();
  populateStoreConfigForm();
  populatePaymentsConfigForm();
  renderAdminCoupons();
  renderAdminOrders();
  setupLucide();
}

function switchAdminTab(tabKey) {
  const tabs = ['products', 'store', 'payments', 'orders'];
  tabs.forEach(t => {
    const view = document.getElementById(`admin-view-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (t === tabKey) {
      view?.classList.remove('hidden');
      btn?.classList.add('active');
    } else {
      view?.classList.add('hidden');
      btn?.classList.remove('active');
    }
  });
  setupLucide();
}

function updateKPIs() {
  document.getElementById('kpi-total-products').textContent = AdminState.products.length;
  document.getElementById('kpi-total-orders').textContent = AdminState.orders.length;
  document.getElementById('kpi-total-coupons').textContent = Object.keys(AdminState.coupons).length;

  const totalRev = AdminState.orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
  document.getElementById('kpi-total-revenue').textContent = `$${totalRev.toFixed(2)}`;

  document.getElementById('tab-count-products').textContent = AdminState.products.length;
  document.getElementById('tab-count-orders').textContent = AdminState.orders.length;
}

// ==========================================================================
// GESTIÓN DE PRODUCTOS (CRUD)
// ==========================================================================

function renderAdminProductsTable() {
  const tbody = document.getElementById('admin-products-table-body');
  if (!tbody) return;

  const search = document.getElementById('admin-product-search')?.value.toLowerCase().trim() || '';
  const cat = document.getElementById('admin-product-cat-filter')?.value || 'all';

  let filtered = [...AdminState.products];

  if (cat !== 'all') {
    filtered = filtered.filter(p => p.category === cat);
  }

  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.description?.toLowerCase().includes(search));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400">
          No se encontraron productos coincidentes en el inventario.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
      <td class="p-4">
        <div class="flex items-center gap-3">
          <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100">
          <div class="min-w-0">
            <h4 class="font-bold text-slate-900 dark:text-white truncate max-w-xs">${p.name}</h4>
            <span class="text-[11px] text-slate-400">ID: ${p.id}</span>
          </div>
        </div>
      </td>
      <td class="p-4 font-semibold text-slate-600 dark:text-slate-300">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
          p.category === 'ropa' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' :
          p.category === 'calzados' ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300' :
          'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
        }">
          ${p.categoryLabel || p.category}
        </span>
      </td>
      <td class="p-4 font-black text-slate-900 dark:text-white">
        $${p.price.toFixed(2)}
        ${p.originalPrice ? `<span class="text-[10px] text-slate-400 font-normal line-through ml-1">$${p.originalPrice.toFixed(2)}</span>` : ''}
      </td>
      <td class="p-4">
        <span class="font-bold ${p.stock <= 5 ? 'text-rose-500 font-black' : 'text-slate-700 dark:text-slate-300'}">
          ${p.stock} uds.
        </span>
      </td>
      <td class="p-4 text-slate-500 dark:text-slate-400">
        ${p.sizes?.join(', ') || 'Única'}
      </td>
      <td class="p-4 text-right">
        <div class="flex items-center justify-end gap-2">
          <button 
            type="button" 
            onclick="openProductModal('${p.id}')" 
            class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-600 dark:text-slate-300 transition"
            title="Editar producto"
          >
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button 
            type="button" 
            onclick="deleteProduct('${p.id}')" 
            class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition"
            title="Eliminar producto"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  setupLucide();
}

function openProductModal(productId = null) {
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('product-modal-title');
  const form = document.getElementById('product-form');

  form.reset();

  if (productId) {
    const product = AdminState.products.find(p => p.id === productId);
    if (!product) return;

    title.textContent = 'Editar Producto';
    document.getElementById('prod-id').value = product.id;
    document.getElementById('prod-name').value = product.name;
    document.getElementById('prod-category').value = product.category;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-original-price').value = product.originalPrice || '';
    document.getElementById('prod-stock').value = product.stock || 15;
    document.getElementById('prod-sizes').value = product.sizes?.join(', ') || 'S, M, L, XL';
    document.getElementById('prod-image').value = product.image;
    document.getElementById('prod-badge').value = product.badge || '';
    document.getElementById('prod-desc').value = product.description || '';
  } else {
    title.textContent = 'Nuevo Producto';
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-stock').value = 20;
    document.getElementById('prod-sizes').value = 'S, M, L, XL';
    document.getElementById('prod-image').value = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
  }

  modal.classList.add('active');
  setupLucide();
}

function closeProductModal() {
  document.getElementById('product-modal')?.classList.remove('active');
}

function handleSaveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('prod-id').value;
  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const originalPrice = parseFloat(document.getElementById('prod-original-price').value) || null;
  const stock = parseInt(document.getElementById('prod-stock').value) || 0;
  const sizesRaw = document.getElementById('prod-sizes').value;
  const image = document.getElementById('prod-image').value.trim();
  const badge = document.getElementById('prod-badge').value.trim();
  const description = document.getElementById('prod-desc').value.trim();

  const sizes = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);
  const categoryLabel = category === 'ropa' ? 'Prendas' : category === 'calzados' ? 'Calzados' : 'Accesorios';

  if (id) {
    // Editar existente
    const idx = AdminState.products.findIndex(p => p.id === id);
    if (idx > -1) {
      AdminState.products[idx] = {
        ...AdminState.products[idx],
        name,
        category,
        categoryLabel,
        price,
        originalPrice,
        discount: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
        stock,
        sizes,
        image,
        gallery: [image],
        badge,
        badgeType: badge.toLowerCase().includes('nuevo') ? 'new' : 'hot',
        description: description || AdminState.products[idx].description
      };
      showAdminToast(`Producto "${name}" actualizado`, 'success');
    }
  } else {
    // Crear nuevo
    const newId = (category === 'ropa' ? 'rop-' : category === 'calzados' ? 'cal-' : 'acc-') + Date.now().toString().slice(-4);
    const newProd = {
      id: newId,
      name,
      category,
      categoryLabel,
      price,
      originalPrice,
      discount: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      rating: 5.0,
      reviewsCount: 1,
      badge: badge || 'Nuevo',
      badgeType: 'new',
      isNew: true,
      image,
      gallery: [image],
      description: description || 'Nuevo producto disponible en la tienda oficial Patito SHOP.',
      features: ['Garantía oficial Patito SHOP', 'Envío rápido y seguro'],
      sizes: sizes.length > 0 ? sizes : ['Única'],
      colors: [{ name: 'Estándar', hex: '#f59e0b' }],
      stock
    };
    AdminState.products.unshift(newProd);
    showAdminToast(`Nuevo producto "${name}" agregado con éxito`, 'success');
  }

  saveStoredProducts(AdminState.products);
  closeProductModal();
  renderAdminProductsTable();
  updateKPIs();
}

function deleteProduct(productId) {
  const p = AdminState.products.find(x => x.id === productId);
  if (!confirm(`¿Estás seguro de que deseas eliminar "${p?.name || 'este producto'}"?`)) return;

  AdminState.products = AdminState.products.filter(x => x.id !== productId);
  saveStoredProducts(AdminState.products);
  renderAdminProductsTable();
  updateKPIs();
  showAdminToast('Producto eliminado del catálogo', 'info');
}

function resetToFactoryProducts() {
  if (!confirm('¿Restablecer todo el inventario al catálogo inicial de Patito SHOP? Perderás los productos agregados manualmente.')) return;

  AdminState.products = [...PRODUCTS_DATA];
  saveStoredProducts(AdminState.products);
  renderAdminProductsTable();
  updateKPIs();
  showAdminToast('Catálogo de fábrica restaurado correctamente', 'success');
}

// ==========================================================================
// CONFIGURACIÓN DE LA TIENDA & CONTACTO
// ==========================================================================

function populateStoreConfigForm() {
  const cfg = AdminState.config;
  document.getElementById('cfg-store-name').value = cfg.storeName || 'Patito SHOP';
  document.getElementById('cfg-tagline').value = cfg.tagline || 'Prendas • Calzados • Accesorios';
  document.getElementById('cfg-announcement').value = cfg.announcement || '';
  document.getElementById('cfg-phone').value = cfg.phone || '+1 (800) 728-486';
  document.getElementById('cfg-whatsapp').value = cfg.whatsapp || '+1800728486';
  document.getElementById('cfg-email').value = cfg.email || 'hola@patitoshop.com';
  document.getElementById('cfg-hours').value = cfg.hours || 'Lun a Sáb: 9am - 8pm';
  document.getElementById('cfg-address').value = cfg.address || 'Av. Estilo Urbano 101';
  document.getElementById('cfg-instagram').value = cfg.instagramUrl || '';
  document.getElementById('cfg-facebook').value = cfg.facebookUrl || '';
  document.getElementById('cfg-twitter').value = cfg.twitterUrl || '';
}

function handleSaveStoreConfig(e) {
  e.preventDefault();

  AdminState.config = {
    ...AdminState.config,
    storeName: document.getElementById('cfg-store-name').value.trim(),
    tagline: document.getElementById('cfg-tagline').value.trim(),
    announcement: document.getElementById('cfg-announcement').value.trim(),
    phone: document.getElementById('cfg-phone').value.trim(),
    whatsapp: document.getElementById('cfg-whatsapp').value.trim(),
    email: document.getElementById('cfg-email').value.trim(),
    hours: document.getElementById('cfg-hours').value.trim(),
    address: document.getElementById('cfg-address').value.trim(),
    instagramUrl: document.getElementById('cfg-instagram').value.trim(),
    facebookUrl: document.getElementById('cfg-facebook').value.trim(),
    twitterUrl: document.getElementById('cfg-twitter').value.trim()
  };

  saveStoreConfig(AdminState.config);
  showAdminToast('¡Información de contacto y tienda guardada con éxito!', 'success');
}

// ==========================================================================
// PAGOS, ENVÍOS Y CUPONES
// ==========================================================================

function populatePaymentsConfigForm() {
  const cfg = AdminState.config;
  document.getElementById('cfg-free-shipping').value = cfg.freeShippingThreshold ?? 50;
  document.getElementById('cfg-shipping-cost').value = cfg.shippingCost ?? 4.99;
  document.getElementById('cfg-tax-rate').value = cfg.taxRate ?? 8;

  document.getElementById('cfg-pay-card').checked = cfg.paymentMethods?.card !== false;
  document.getElementById('cfg-pay-paypal').checked = cfg.paymentMethods?.paypal !== false;
  document.getElementById('cfg-pay-cash').checked = cfg.paymentMethods?.cash !== false;
}

function handleSavePaymentsConfig(e) {
  e.preventDefault();

  AdminState.config = {
    ...AdminState.config,
    freeShippingThreshold: parseFloat(document.getElementById('cfg-free-shipping').value) || 50,
    shippingCost: parseFloat(document.getElementById('cfg-shipping-cost').value) || 4.99,
    taxRate: parseFloat(document.getElementById('cfg-tax-rate').value) || 8,
    paymentMethods: {
      card: document.getElementById('cfg-pay-card').checked,
      paypal: document.getElementById('cfg-pay-paypal').checked,
      cash: document.getElementById('cfg-pay-cash').checked
    }
  };

  saveStoreConfig(AdminState.config);
  showAdminToast('¡Parámetros de envío y pagos actualizados!', 'success');
}

function renderAdminCoupons() {
  const container = document.getElementById('admin-coupons-list');
  if (!container) return;

  const entries = Object.entries(AdminState.coupons);
  if (entries.length === 0) {
    container.innerHTML = `<p class="text-slate-400 italic">No hay cupones activos.</p>`;
    return;
  }

  container.innerHTML = entries.map(([code, c]) => `
    <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
      <div>
        <span class="font-black text-amber-600 dark:text-amber-400 font-mono tracking-wide text-xs">${code}</span>
        <p class="text-[11px] text-slate-500">${c.label} (${c.type === 'percent' ? c.value + '%' : c.type === 'fixed' ? '$' + c.value : 'Envío Gratis'})</p>
      </div>
      <button 
        type="button" 
        onclick="deleteCoupon('${code}')" 
        class="text-slate-400 hover:text-rose-500 p-1 transition" 
        title="Eliminar cupón"
      >
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>
  `).join('');

  setupLucide();
}

function handleCreateCoupon(e) {
  e.preventDefault();
  const code = document.getElementById('new-coupon-code').value.trim().toUpperCase();
  const type = document.getElementById('new-coupon-type').value;
  const val = parseFloat(document.getElementById('new-coupon-val').value) || 0;
  const label = document.getElementById('new-coupon-label').value.trim();

  if (!code) return;

  AdminState.coupons[code] = {
    type,
    value: val,
    label: label || `${code} Descuento`
  };

  saveStoredCoupons(AdminState.coupons);
  document.getElementById('create-coupon-form').reset();
  renderAdminCoupons();
  updateKPIs();
  showAdminToast(`Cupón "${code}" creado con éxito`, 'success');
}

function deleteCoupon(code) {
  delete AdminState.coupons[code];
  saveStoredCoupons(AdminState.coupons);
  renderAdminCoupons();
  updateKPIs();
  showAdminToast(`Cupón ${code} eliminado`, 'info');
}

// ==========================================================================
// HISTORIAL DE PEDIDOS RECIBIDOS
// ==========================================================================

function renderAdminOrders() {
  const container = document.getElementById('admin-orders-container');
  if (!container) return;

  if (AdminState.orders.length === 0) {
    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center text-2xl mx-auto">
          📦
        </div>
        <h4 class="font-bold text-slate-900 dark:text-white">Aún no hay pedidos registrados</h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          Cuando los clientes finalicen compras a través del checkout de la tienda, aparecerán aquí con su detalle completo.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = AdminState.orders.map((ord, idx) => `
    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <span class="font-black text-amber-600 dark:text-amber-400 font-mono text-sm">${ord.id}</span>
          <span class="text-slate-400">•</span>
          <span class="text-slate-500">${ord.dateFormatted || ord.date}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
            ${ord.status || 'Completado'}
          </span>
          <span class="text-sm font-black text-slate-900 dark:text-white">
            Total: $${ord.totals?.total?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Cliente -->
        <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <p class="font-bold text-slate-900 dark:text-white mb-1">👤 Datos del Comprador:</p>
          <p class="text-slate-700 dark:text-slate-300"><strong>Nombre:</strong> ${ord.customer?.fullName || 'N/A'}</p>
          <p class="text-slate-500"><strong>Email:</strong> ${ord.customer?.email || 'N/A'}</p>
          <p class="text-slate-500"><strong>Teléfono:</strong> ${ord.customer?.phone || 'N/A'}</p>
          <p class="text-slate-500"><strong>Entrega:</strong> ${ord.customer?.address || 'N/A'}, ${ord.customer?.city || ''}</p>
        </div>

        <!-- Productos -->
        <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <p class="font-bold text-slate-900 dark:text-white mb-1">🛒 Artículos Comprados:</p>
          <div class="space-y-1 max-h-32 overflow-y-auto">
            ${ord.items?.map(it => `
              <div class="flex justify-between text-slate-600 dark:text-slate-300 text-[11px]">
                <span>${it.quantity}x ${it.name} (${it.size}, ${it.color})</span>
                <span class="font-bold">$${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            `).join('') || '<p class="text-slate-400">Sin detalles</p>'}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  setupLucide();
}

function clearAllOrders() {
  if (!confirm('¿Eliminar todo el historial de pedidos? Esta acción no se puede deshacer.')) return;
  AdminState.orders = [];
  localStorage.setItem('patito_orders', JSON.stringify([]));
  renderAdminOrders();
  updateKPIs();
  showAdminToast('Historial de pedidos limpiado', 'info');
}

// ==========================================================================
// NOTIFICACIONES TOAST EN ADMIN
// ==========================================================================

function showAdminToast(message, type = 'success') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeClasses = {
    success: 'bg-emerald-950/90 text-white border-emerald-600',
    error: 'bg-rose-950/90 text-white border-rose-600',
    info: 'bg-slate-900/90 text-white border-amber-500'
  };

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-semibold max-w-sm pointer-events-auto transition-all ${typeClasses[type] || typeClasses.info}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="flex-1">${message}</span>
    <button type="button" class="text-white/60 hover:text-white" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}
