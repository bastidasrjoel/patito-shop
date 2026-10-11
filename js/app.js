/**
 * PATITO SHOP - LÓGICA PRINCIPAL DE LA APLICACIÓN (ES6+)
 * Gestiona el carrito de compras, catálogo, filtros, favoritos, tema oscuro, modales y checkout.
 */

function safeGetJSON(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

// Estado global de la aplicación
const AppState = {
  storeConfig: (typeof getStoreConfig === 'function') ? getStoreConfig() : DEFAULT_STORE_CONFIG,
  products: (typeof getStoredProducts === 'function') ? getStoredProducts() : ((typeof PRODUCTS_DATA !== 'undefined') ? PRODUCTS_DATA : []),
  filteredProducts: [],
  cart: safeGetJSON('patito_cart', []),
  wishlist: safeGetJSON('patito_wishlist', []),
  filters: {
    category: 'all',
    search: '',
    maxPrice: 120,
    size: 'all',
    sort: 'featured'
  },
  appliedCoupon: safeGetJSON('patito_coupon', null),
  quickViewProduct: null,
  selectedSize: null,
  selectedColor: null,
  selectedQty: 1
};
AppState.filteredProducts = [...AppState.products];

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  applyStoreConfigToUI();
  initEventListeners();

  // Si Firebase está conectado, refrescar catálogo desde Cloud Firestore
  if (window.FirebaseService && window.FirebaseService.init()) {
    try {
      const cloudProds = await window.FirebaseService.getProducts();
      if (cloudProds && cloudProds.length > 0) {
        AppState.products = cloudProds;
        AppState.filteredProducts = [...cloudProds];
      }
    } catch (e) {
      console.warn('Fallo al sincronizar productos desde Firestore:', e);
    }
  }

  renderProducts();
  updateCartUI();
  updateWishlistUI();
  setupLucideIcons();
});

function applyStoreConfigToUI() {
  const cfg = AppState.storeConfig;
  if (!cfg) return;

  // Actualizar anuncio superior
  const annEl = document.getElementById('announcement-bar-text');
  if (annEl && cfg.announcement) {
    annEl.textContent = cfg.announcement;
  }

  // Actualizar información del footer
  const phoneEl = document.getElementById('footer-phone');
  if (phoneEl && cfg.phone) {
    phoneEl.textContent = cfg.phone;
    phoneEl.closest('a')?.setAttribute('href', `tel:${cfg.phone.replace(/[^0-9+]/g, '')}`);
  }

  const emailEl = document.getElementById('footer-email');
  if (emailEl && cfg.email) {
    emailEl.textContent = cfg.email;
    emailEl.closest('a')?.setAttribute('href', `mailto:${cfg.email}`);
  }

  const addressEl = document.getElementById('footer-address');
  if (addressEl && cfg.address) {
    addressEl.textContent = cfg.address;
  }

  const hoursEl = document.getElementById('footer-hours');
  if (hoursEl && cfg.hours) {
    hoursEl.textContent = cfg.hours;
  }
}

function setupLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ==========================================================================
// TEMA CLARO / OSCURO
// ==========================================================================

function initTheme() {
  const savedTheme = localStorage.getItem('patito_theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('patito_theme', isDark ? 'dark' : 'light');
  showToast(
    isDark ? 'Modo Oscuro activado' : 'Modo Claro activado',
    'info',
    isDark ? 'moon' : 'sun'
  );
  setupLucideIcons();
}

// ==========================================================================
// RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
// ==========================================================================

function applyFilters() {
  let list = [...AppState.products];

  // Filtro por categoría
  if (AppState.filters.category !== 'all') {
    list = list.filter(p => p.category === AppState.filters.category);
  }

  // Filtro por búsqueda de texto
  if (AppState.filters.search.trim() !== '') {
    const q = AppState.filters.search.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  }

  // Filtro por precio máximo
  list = list.filter(p => p.price <= AppState.filters.maxPrice);

  // Filtro por talla
  if (AppState.filters.size !== 'all') {
    list = list.filter(p => p.sizes.includes(AppState.filters.size));
  }

  // Ordenamiento
  switch (AppState.filters.sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'featured':
    default:
      // Conservar orden original destacado
      break;
  }

  AppState.filteredProducts = list;
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countBadge = document.getElementById('products-count');
  
  if (countBadge) {
    countBadge.textContent = `${AppState.filteredProducts.length} producto${AppState.filteredProducts.length === 1 ? '' : 's'}`;
  }

  if (!grid) return;

  if (AppState.filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-20 h-20 mx-auto mb-4 bg-amber-100 dark:bg-amber-950/40 text-amber-500 rounded-full flex items-center justify-center text-3xl">
          🦆
        </div>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No se encontraron productos</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          Prueba cambiando los filtros de categoría, precio o términos de búsqueda para encontrar lo que necesitas en Patito SHOP.
        </p>
        <button onclick="resetFilters()" class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition shadow-md hover:shadow-lg focus:ring-4 focus:ring-amber-300">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Limpiar Filtros
        </button>
      </div>
    `;
    setupLucideIcons();
    return;
  }

  grid.innerHTML = AppState.filteredProducts.map(product => {
    const isWishlisted = AppState.wishlist.includes(product.id);
    const badgeColor = product.badgeType === 'hot' 
      ? 'bg-rose-500 text-white' 
      : product.badgeType === 'new'
      ? 'bg-emerald-500 text-white'
      : 'bg-amber-500 text-slate-950';

    return `
      <article class="product-card group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col h-full relative" data-product-id="${product.id}">
        <!-- Contenedor de Imagen -->
        <div class="product-image-container relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
          ${product.badge ? `
            <span class="absolute top-3 left-3 z-10 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${badgeColor}">
              ${product.badge}
            </span>
          ` : ''}

          <!-- Botón de Favorito -->
          <button 
            type="button" 
            onclick="toggleWishlist('${product.id}')"
            class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow-sm ${isWishlisted ? 'text-rose-500 fill-rose-500 !text-rose-500' : 'hover:text-rose-500'}"
            aria-label="${isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
          >
            <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}"></i>
          </button>

          <!-- Imagen del producto -->
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy" 
            class="product-image w-full h-full object-cover"
          />

          <!-- Botones flotantes al hacer Hover -->
          <div class="card-overlay-actions absolute inset-x-3 bottom-3 flex gap-2 z-10">
            <button 
              type="button" 
              onclick="openQuickView('${product.id}')" 
              class="flex-1 py-2.5 px-3 bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-amber-500 hover:text-slate-950 transition"
            >
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Vista Rápida
            </button>
            <button 
              type="button" 
              onclick="quickAddToCart('${product.id}')" 
              class="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold shadow-md hover:scale-105 transition flex items-center justify-center"
              aria-label="Añadir ${product.name} al carrito"
            >
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Contenido / Info del producto -->
        <div class="p-5 flex flex-col flex-1">
          <!-- Categoría y Rating -->
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span class="font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">${product.categoryLabel}</span>
            <div class="flex items-center gap-1">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
              <span class="font-bold text-slate-700 dark:text-slate-200">${product.rating}</span>
              <span class="text-slate-400">(${product.reviewsCount})</span>
            </div>
          </div>

          <!-- Título del producto -->
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">
            <a href="javascript:void(0)" onclick="openQuickView('${product.id}')" class="focus:underline outline-none">
              ${product.name}
            </a>
          </h3>

          <!-- Swatches de Colores -->
          <div class="flex items-center gap-1.5 mb-4">
            ${product.colors.map(c => `
              <span class="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 inline-block shadow-inner" style="background-color: ${c.hex};" title="${c.name}"></span>
            `).join('')}
            <span class="text-[11px] text-slate-400 ml-1">+${product.colors.length} colores</span>
          </div>

          <!-- Precio y CTA -->
          <div class="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div class="flex flex-col">
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-black text-slate-900 dark:text-white">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `
                  <span class="text-xs text-slate-400 line-through">$${product.originalPrice.toFixed(2)}</span>
                ` : ''}
              </div>
              ${product.discount ? `
                <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Ahorras ${product.discount}%</span>
              ` : ''}
            </div>

            <!-- Botón agregar directo -->
            <button 
              type="button" 
              onclick="quickAddToCart('${product.id}')"
              class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 dark:hover:bg-amber-500 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-slate-950 rounded-xl text-xs font-bold transition-all"
            >
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Agregar
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  setupLucideIcons();
}

// ==========================================================================
// VISTA RÁPIDA / MODAL DETALLES DEL PRODUCTO
// ==========================================================================

function openQuickView(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  AppState.quickViewProduct = product;
  AppState.selectedSize = product.sizes[0] || 'Única';
  AppState.selectedColor = product.colors[0]?.name || 'Estándar';
  AppState.selectedQty = 1;

  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Galería de imágenes -->
      <div class="space-y-4">
        <div class="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
          <img id="qv-main-img" src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
          ${product.badge ? `
            <span class="absolute top-4 left-4 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
              ${product.badge}
            </span>
          ` : ''}
        </div>
        
        <!-- Miniaturas -->
        <div class="flex gap-3 overflow-x-auto pb-2">
          ${product.gallery.map((img, i) => `
            <button 
              type="button" 
              onclick="document.getElementById('qv-main-img').src = '${img}'"
              class="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 focus:border-amber-500 transition shrink-0"
            >
              <img src="${img}" alt="Miniatura ${i + 1}" class="w-full h-full object-cover">
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Información y Selección -->
      <div class="flex flex-col">
        <!-- Encabezado -->
        <div class="mb-4">
          <div class="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">
            <span>${product.categoryLabel}</span>
            <div class="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
              <span>${product.rating}</span>
              <span class="text-slate-400 font-normal">(${product.reviewsCount} opiniones)</span>
            </div>
          </div>
          <h2 id="quick-view-title" class="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">${product.name}</h2>
          
          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-black text-slate-900 dark:text-white">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `
              <span class="text-lg text-slate-400 line-through">$${product.originalPrice.toFixed(2)}</span>
              <span class="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">-${product.discount}% Descuento</span>
            ` : ''}
          </div>
        </div>

        <!-- Descripción corta -->
        <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          ${product.description}
        </p>

        <!-- Selector de Color -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Color: <span id="qv-selected-color-label" class="text-amber-600 dark:text-amber-400">${AppState.selectedColor}</span>
          </label>
          <div class="flex gap-2">
            ${product.colors.map((c, idx) => `
              <button 
                type="button" 
                onclick="selectProductColor('${c.name}', this)"
                class="color-swatch-btn w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 shadow-md ${idx === 0 ? 'selected' : ''}"
                style="background-color: ${c.hex};"
                title="${c.name}"
                aria-label="Seleccionar color ${c.name}"
              ></button>
            `).join('')}
          </div>
        </div>

        <!-- Selector de Talla con Guía -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Talla: <span id="qv-selected-size-label" class="text-amber-600 dark:text-amber-400">${AppState.selectedSize}</span>
            </label>
            <button type="button" onclick="openSizeGuideModal()" class="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              <i data-lucide="ruler" class="w-3.5 h-3.5"></i> Guía de Tallas
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            ${product.sizes.map((s, idx) => `
              <button 
                type="button" 
                onclick="selectProductSize('${s}', this)"
                class="size-btn px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:border-amber-500 transition ${idx === 0 ? 'selected' : ''}"
              >
                ${s}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Cantidad y Botón de Carrito -->
        <div class="flex items-center gap-4 mb-6">
          <div class="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
            <button type="button" onclick="updateQtyPicker(-1)" class="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition">
              <i data-lucide="minus" class="w-4 h-4"></i>
            </button>
            <span id="qv-qty-display" class="w-10 text-center font-bold text-sm text-slate-900 dark:text-white">1</span>
            <button type="button" onclick="updateQtyPicker(1)" class="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </button>
          </div>

          <button 
            type="button" 
            onclick="addQuickViewToCart()" 
            class="flex-1 py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            <i data-lucide="shopping-cart" class="w-4 h-4"></i> Añadir al Carrito
          </button>
        </div>

        <!-- Características destacadas -->
        <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          ${product.features.map(f => `
            <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-500"></i>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setupLucideIcons();
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function selectProductColor(colorName, btn) {
  AppState.selectedColor = colorName;
  document.getElementById('qv-selected-color-label').textContent = colorName;
  document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function selectProductSize(size, btn) {
  AppState.selectedSize = size;
  document.getElementById('qv-selected-size-label').textContent = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function updateQtyPicker(delta) {
  AppState.selectedQty = Math.max(1, AppState.selectedQty + delta);
  const display = document.getElementById('qv-qty-display');
  if (display) display.textContent = AppState.selectedQty;
}

function addQuickViewToCart() {
  if (!AppState.quickViewProduct) return;
  addItemToCart(
    AppState.quickViewProduct, 
    AppState.selectedSize, 
    AppState.selectedColor, 
    AppState.selectedQty
  );
  closeQuickView();
  openCartDrawer();
}

// ==========================================================================
// CARRITO DE COMPRAS (COMPLETO, PERSISTENTE, REACTIVO)
// ==========================================================================

function quickAddToCart(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;
  
  const defaultSize = product.sizes[0] || 'Única';
  const defaultColor = product.colors[0]?.name || 'Estándar';
  
  addItemToCart(product, defaultSize, defaultColor, 1);
  openCartDrawer();
}

function addItemToCart(product, size, color, quantity = 1) {
  // Comprobar si ya existe un item idéntico con la misma talla y color
  const existingIndex = AppState.cart.findIndex(
    item => item.product.id === product.id && item.size === size && item.color === color
  );

  if (existingIndex > -1) {
    AppState.cart[existingIndex].quantity += quantity;
  } else {
    AppState.cart.push({
      id: `${product.id}-${size}-${color}`,
      product: product,
      size: size,
      color: color,
      quantity: quantity
    });
  }

  saveCart();
  updateCartUI();
  showToast(
    `¡${product.name} añadido al carrito!`,
    'success',
    'check-circle'
  );
}

function updateCartItemQuantity(index, delta) {
  if (index < 0 || index >= AppState.cart.length) return;

  AppState.cart[index].quantity += delta;
  if (AppState.cart[index].quantity <= 0) {
    removeCartItem(index);
    return;
  }

  saveCart();
  updateCartUI();
}

function removeCartItem(index) {
  if (index < 0 || index >= AppState.cart.length) return;
  
  const removed = AppState.cart.splice(index, 1)[0];
  saveCart();
  updateCartUI();
  showToast(`Eliminaste ${removed.product.name} del carrito`, 'info', 'trash-2');
}

function clearCart() {
  AppState.cart = [];
  AppState.appliedCoupon = null;
  saveCart();
  updateCartUI();
  showToast('Carrito vaciado', 'info', 'trash-2');
}

function saveCart() {
  localStorage.setItem('patito_cart', JSON.stringify(AppState.cart));
  localStorage.setItem('patito_coupon', JSON.stringify(AppState.appliedCoupon));
}

function calculateCartTotals() {
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cfg = AppState.storeConfig || DEFAULT_STORE_CONFIG;
  const freeThreshold = Number(cfg.freeShippingThreshold) || 50.0;
  const baseShipping = Number(cfg.shippingCost) || 4.99;
  const taxPercent = (Number(cfg.taxRate) || 8) / 100;
  
  let discountAmount = 0;
  if (AppState.appliedCoupon) {
    if (AppState.appliedCoupon.type === 'percent') {
      discountAmount = subtotal * (AppState.appliedCoupon.value / 100);
    } else if (AppState.appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(subtotal, AppState.appliedCoupon.value);
    }
  }

  const isFreeShipping = subtotal >= freeThreshold || (AppState.appliedCoupon && AppState.appliedCoupon.type === 'shipping');
  const shipping = subtotal === 0 ? 0 : (isFreeShipping ? 0 : baseShipping);
  
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxes = taxableSubtotal * taxPercent;
  const total = taxableSubtotal + shipping + taxes;

  return {
    subtotal,
    discountAmount,
    shipping,
    isFreeShipping,
    freeThreshold,
    taxes,
    total
  };
}

function updateCartUI() {
  const countBadge = document.getElementById('cart-count-badge');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const emptyCartState = document.getElementById('empty-cart-state');
  const cartSummaryBlock = document.getElementById('cart-summary-block');
  const shippingProgressText = document.getElementById('shipping-progress-text');
  const shippingProgressBar = document.getElementById('shipping-progress-bar');

  const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Actualizar Badge en barra de navegación
  if (countBadge) {
    countBadge.textContent = totalItems;
    if (totalItems > 0) {
      countBadge.classList.remove('hidden');
      countBadge.classList.add('inline-flex');
    } else {
      countBadge.classList.add('hidden');
      countBadge.classList.remove('inline-flex');
    }
  }

  const totals = calculateCartTotals();

  // Barra de progreso de envío gratis
  if (shippingProgressBar && shippingProgressText) {
    const limit = totals.freeThreshold;
    if (totals.subtotal >= limit) {
      shippingProgressText.innerHTML = `🎉 <strong>¡Felicidades!</strong> Tu pedido califica para <strong>Envío GRATIS</strong>.`;
      shippingProgressBar.style.width = '100%';
      shippingProgressBar.classList.remove('bg-amber-500');
      shippingProgressBar.classList.add('bg-emerald-500');
    } else {
      const remaining = (limit - totals.subtotal).toFixed(2);
      const percentage = Math.min(100, (totals.subtotal / limit) * 100);
      shippingProgressText.innerHTML = `🦆 Te faltan <strong>$${remaining}</strong> para desbloquear <strong>Envío GRATIS</strong>.`;
      shippingProgressBar.style.width = `${percentage}%`;
      shippingProgressBar.classList.remove('bg-emerald-500');
      shippingProgressBar.classList.add('bg-amber-500');
    }
  }

  // Renderizar items o estado vacío
  if (AppState.cart.length === 0) {
    if (emptyCartState) emptyCartState.classList.remove('hidden');
    if (cartItemsContainer) cartItemsContainer.classList.add('hidden');
    if (cartSummaryBlock) cartSummaryBlock.classList.add('hidden');
  } else {
    if (emptyCartState) emptyCartState.classList.add('hidden');
    if (cartItemsContainer) {
      cartItemsContainer.classList.remove('hidden');
      cartItemsContainer.innerHTML = AppState.cart.map((item, index) => `
        <li class="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 shadow-sm relative group">
          <img src="${item.product.image}" alt="${item.product.name}" class="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-700">
          
          <div class="flex flex-col flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">${item.product.name}</h4>
              <button type="button" onclick="removeCartItem(${index})" class="text-slate-400 hover:text-rose-500 transition p-1" title="Eliminar">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
              <span>Talla: <strong class="text-slate-700 dark:text-slate-200">${item.size}</strong></span>
              <span>•</span>
              <span>Color: <strong class="text-slate-700 dark:text-slate-200">${item.color}</strong></span>
            </div>

            <div class="flex items-center justify-between mt-3">
              <!-- Stepper -->
              <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900">
                <button type="button" onclick="updateCartItemQuantity(${index}, -1)" class="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-l-lg transition">
                  <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                </button>
                <span class="w-7 text-center font-bold text-xs text-slate-900 dark:text-white">${item.quantity}</span>
                <button type="button" onclick="updateCartItemQuantity(${index}, 1)" class="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-r-lg transition">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <!-- Subtotal por fila -->
              <span class="text-sm font-black text-slate-900 dark:text-white">
                $${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </li>
      `).join('');
    }

    if (cartSummaryBlock) {
      cartSummaryBlock.classList.remove('hidden');
      document.getElementById('cart-subtotal-val').textContent = `$${totals.subtotal.toFixed(2)}`;
      
      const discountRow = document.getElementById('cart-discount-row');
      if (totals.discountAmount > 0) {
        discountRow.classList.remove('hidden');
        document.getElementById('cart-discount-val').textContent = `-$${totals.discountAmount.toFixed(2)}`;
      } else {
        discountRow.classList.add('hidden');
      }

      document.getElementById('cart-shipping-val').textContent = totals.shipping === 0 ? '¡GRATIS!' : `$${totals.shipping.toFixed(2)}`;
      document.getElementById('cart-tax-val').textContent = `$${totals.taxes.toFixed(2)}`;
      document.getElementById('cart-total-val').textContent = `$${totals.total.toFixed(2)}`;
    }
  }

  // Renderizar cupón activo si existe
  const activeCouponPill = document.getElementById('active-coupon-pill');
  if (activeCouponPill) {
    if (AppState.appliedCoupon) {
      activeCouponPill.classList.remove('hidden');
      activeCouponPill.innerHTML = `
        <span class="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800">
          <i data-lucide="tag" class="w-3.5 h-3.5"></i> ${AppState.appliedCoupon.label}
          <button type="button" onclick="removeCoupon()" class="ml-2 hover:text-rose-500 font-bold">&times;</button>
        </span>
      `;
    } else {
      activeCouponPill.classList.add('hidden');
      activeCouponPill.innerHTML = '';
    }
  }

  setupLucideIcons();
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.add('active');
  document.body.style.overflow = 'hidden';
  setupLucideIcons();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================================
// SISTEMA DE CUPONES
// ==========================================================================

function applyCouponCode() {
  const input = document.getElementById('coupon-input');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    showToast('Ingresa un código de cupón', 'error', 'alert-circle');
    return;
  }

  const availableCoupons = (typeof getStoredCoupons === 'function') ? getStoredCoupons() : DEFAULT_COUPONS;
  if (availableCoupons[code]) {
    AppState.appliedCoupon = availableCoupons[code];
    saveCart();
    updateCartUI();
    showToast(`¡Cupón ${code} aplicado correctamente!`, 'success', 'check-circle');
    input.value = '';
  } else {
    showToast('Cupón no válido o expirado. Consulta tus cupones activos.', 'error', 'x-circle');
  }
}

function removeCoupon() {
  AppState.appliedCoupon = null;
  saveCart();
  updateCartUI();
  showToast('Cupón de descuento removido', 'info', 'tag');
}

// ==========================================================================
// FAVORITOS / WISHLIST
// ==========================================================================

function toggleWishlist(productId) {
  const index = AppState.wishlist.indexOf(productId);
  const product = AppState.products.find(p => p.id === productId);

  if (index > -1) {
    AppState.wishlist.splice(index, 1);
    showToast(`Eliminado de tus favoritos`, 'info', 'heart');
  } else {
    AppState.wishlist.push(productId);
    showToast(`¡${product ? product.name : 'Producto'} añadido a favoritos!`, 'success', 'heart');
  }

  localStorage.setItem('patito_wishlist', JSON.stringify(AppState.wishlist));
  updateWishlistUI();
  renderProducts(); // Re-renderizar corazones en catálogo
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlist-count-badge');
  const count = AppState.wishlist.length;

  if (badge) {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove('hidden');
      badge.classList.add('inline-flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('inline-flex');
    }
  }

  const listContainer = document.getElementById('wishlist-items-container');
  const emptyState = document.getElementById('empty-wishlist-state');

  if (listContainer && emptyState) {
    if (count === 0) {
      emptyState.classList.remove('hidden');
      listContainer.classList.add('hidden');
    } else {
      emptyState.classList.add('hidden');
      listContainer.classList.remove('hidden');
      
      const wishlistedProducts = AppState.products.filter(p => AppState.wishlist.includes(p.id));
      listContainer.innerHTML = wishlistedProducts.map(product => `
        <li class="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-xl object-cover">
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">${product.name}</h4>
            <span class="text-sm font-black text-amber-600 dark:text-amber-400">$${product.price.toFixed(2)}</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              onclick="quickAddToCart('${product.id}'); toggleWishlist('${product.id}');"
              class="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold shadow-sm transition"
              title="Mover al carrito"
            >
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            </button>
            <button 
              type="button" 
              onclick="toggleWishlist('${product.id}')"
              class="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl transition"
              title="Quitar"
            >
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </li>
      `).join('');
    }
  }

  setupLucideIcons();
}

function openWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  if (drawer) drawer.classList.add('active');
  document.body.style.overflow = 'hidden';
  setupLucideIcons();
}

function closeWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  if (drawer) drawer.classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================================================
// CHECKOUT & CONFIRMACIÓN DE PEDIDO
// ==========================================================================

function openCheckoutModal() {
  if (AppState.cart.length === 0) {
    showToast('Tu carrito está vacío. Agrega productos antes de pagar.', 'error', 'shopping-bag');
    return;
  }

  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  const totals = calculateCartTotals();

  // Actualizar resumen en checkout
  document.getElementById('checkout-items-count').textContent = `${AppState.cart.length} artículos`;
  document.getElementById('checkout-subtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
  document.getElementById('checkout-shipping').textContent = totals.shipping === 0 ? 'GRATIS' : `$${totals.shipping.toFixed(2)}`;
  document.getElementById('checkout-tax').textContent = `$${totals.taxes.toFixed(2)}`;
  document.getElementById('checkout-total').textContent = `$${totals.total.toFixed(2)}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setupLucideIcons();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('checkout-submit-btn');
  const originalBtnText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="inline-block animate-spin mr-2">⏳</span> Procesando Pago Seguro...
  `;

  // Simulación de procesamiento de pasarela de pago segura
  setTimeout(() => {
    const orderNumber = 'PAT-' + Math.floor(100000 + Math.random() * 900000);
    const totals = calculateCartTotals();
    const purchasedItems = [...AppState.cart];
    
    // Extraer datos del formulario
    const fullName = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const address = document.getElementById('cust-address').value;
    const city = document.getElementById('cust-city').value;

    closeCheckoutModal();

    // Rellenar Modal de Éxito / Factura
    document.getElementById('order-number-display').textContent = orderNumber;
    document.getElementById('order-date-display').textContent = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    document.getElementById('order-customer-info').innerHTML = `
      <p class="font-bold text-slate-800 dark:text-slate-100">${fullName}</p>
      <p class="text-slate-500 dark:text-slate-400 text-xs">${email}</p>
      <p class="text-slate-500 dark:text-slate-400 text-xs">${address}, ${city}</p>
    `;

    document.getElementById('order-items-summary').innerHTML = purchasedItems.map(item => `
      <div class="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
        <span class="text-slate-700 dark:text-slate-300 font-medium">
          ${item.quantity}x ${item.product.name} (${item.size}, ${item.color})
        </span>
        <span class="font-bold text-slate-900 dark:text-white">
          $${(item.product.price * item.quantity).toFixed(2)}
        </span>
      </div>
    `).join('');

    document.getElementById('order-total-display').textContent = `$${totals.total.toFixed(2)}`;

    // Registrar pedido en el historial y en Cloud Firestore si está disponible
    const orderData = {
      id: orderNumber,
      date: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }),
      customer: {
        fullName,
        email,
        phone: document.getElementById('cust-phone')?.value || '',
        address,
        city,
        zip: document.getElementById('cust-zip')?.value || ''
      },
      items: purchasedItems.map(it => ({
        name: it.product.name,
        category: it.product.categoryLabel,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        price: it.product.price,
        total: it.product.price * it.quantity
      })),
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discountAmount,
        shipping: totals.shipping,
        taxes: totals.taxes,
        total: totals.total
      },
      paymentMethod: document.querySelector('input[name="payment_method"]:checked')?.value || 'card',
      status: 'Pagado y Confirmado'
    };

    if (window.FirebaseService) {
      window.FirebaseService.saveOrder(orderData);
    } else if (typeof saveStoredOrder === 'function') {
      saveStoredOrder(orderData);
    }

    // Vaciar carrito
    clearCart();

    // Mostrar modal de confirmación con confeti
    const successModal = document.getElementById('order-success-modal');
    successModal.classList.add('active');
    triggerConfetti();

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }, 1200);
}

function closeOrderSuccessModal() {
  const modal = document.getElementById('order-success-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function triggerConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  container.innerHTML = '';
  const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6'];

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    container.appendChild(piece);
  }
}

// ==========================================================================
// GUÍA DE TALLAS
// ==========================================================================

function openSizeGuideModal() {
  const modal = document.getElementById('size-guide-modal');
  if (modal) modal.classList.add('active');
}

function closeSizeGuideModal() {
  const modal = document.getElementById('size-guide-modal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = 'success', iconName = 'check-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-950/90 text-white border-emerald-600',
    error: 'bg-rose-950/90 text-white border-rose-600',
    info: 'bg-slate-900/95 text-white border-amber-500'
  };

  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md text-sm font-semibold max-w-sm pointer-events-auto ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 text-amber-400 shrink-0"></i>
    <span class="flex-1">${message}</span>
    <button type="button" class="text-white/60 hover:text-white transition" onclick="this.parentElement.remove()">
      &times;
    </button>
  `;

  container.appendChild(toast);
  setupLucideIcons();

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// ==========================================================================
// EVENT LISTENERS & NAVEGACIÓN
// ==========================================================================

function initEventListeners() {
  // Búsqueda en vivo
  const searchInput = document.getElementById('nav-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.filters.search = e.target.value;
      applyFilters();
    });
  }

  // Filtro por precio
  const priceSlider = document.getElementById('filter-price-slider');
  const priceDisplay = document.getElementById('filter-price-value');
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      AppState.filters.maxPrice = Number(e.target.value);
      priceDisplay.textContent = `$${e.target.value}`;
      applyFilters();
    });
  }

  // Ordenamiento
  const sortSelect = document.getElementById('filter-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.filters.sort = e.target.value;
      applyFilters();
    });
  }

  // Newsletter
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      showToast(`¡Gracias! Te enviamos tu cupón PATITO10 al correo: ${emailInput.value}`, 'success', 'mail');
      emailInput.value = '';
    });
  }

  // Checkout Form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Accesibilidad: Tecla Escape cierra cualquier drawer o modal abierto
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeWishlistDrawer();
      closeQuickView();
      closeCheckoutModal();
      closeSizeGuideModal();
      closeMobileMenu();
    }
  });
}

function setCategoryFilter(category) {
  AppState.filters.category = category;
  
  // Actualizar estilos activos de botones
  document.querySelectorAll('.cat-pill-btn').forEach(btn => {
    const isTarget = btn.getAttribute('data-cat') === category;
    if (isTarget) {
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-md');
      btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    } else {
      btn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-md');
      btn.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    }
  });

  applyFilters();
  
  // Scroll suave al catálogo si se hace clic desde el banner
  const catalog = document.getElementById('catalogo');
  if (catalog) {
    catalog.scrollIntoView({ behavior: 'smooth' });
  }
}

function setSizeFilter(size, btn) {
  if (AppState.filters.size === size) {
    AppState.filters.size = 'all';
    btn.classList.remove('selected');
  } else {
    AppState.filters.size = size;
    document.querySelectorAll('.filter-size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  }
  applyFilters();
}

function resetFilters() {
  AppState.filters = {
    category: 'all',
    search: '',
    maxPrice: 120,
    size: 'all',
    sort: 'featured'
  };

  const searchInput = document.getElementById('nav-search-input');
  if (searchInput) searchInput.value = '';

  const priceSlider = document.getElementById('filter-price-slider');
  const priceDisplay = document.getElementById('filter-price-value');
  if (priceSlider && priceDisplay) {
    priceSlider.value = 120;
    priceDisplay.textContent = '$120';
  }

  const sortSelect = document.getElementById('filter-sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  document.querySelectorAll('.filter-size-btn').forEach(b => b.classList.remove('selected'));
  setCategoryFilter('all');
}

// Menú Móvil
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu-drawer');
  if (menu) {
    menu.classList.toggle('active');
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu-drawer');
  if (menu) menu.classList.remove('active');
}
