/**
 * PATITO SHOP - INTEGRACIÓN OFICIAL CON FIREBASE (FIRESTORE)
 * Permite sincronizar productos, pedidos, configuración y cupones en la nube.
 * Soporta persistencia híbrida (Cloud Firestore + LocalStorage Fallback).
 */

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const FirebaseService = {
  db: null,
  app: null,
  isConnected: false,
  config: null,

  // Inicializar Firebase
  init() {
    this.config = this.loadConfig();

    if (this.isValidConfig(this.config)) {
      try {
        if (window.firebase && typeof window.firebase.initializeApp === 'function') {
          // Evitar reinicializar si ya existe una app
          if (!window.firebase.apps.length) {
            this.app = window.firebase.initializeApp(this.config);
          } else {
            this.app = window.firebase.app();
          }
          this.db = window.firebase.firestore();
          this.isConnected = true;
          console.log('🦆 Patito SHOP: Firebase Firestore conectado exitosamente al proyecto:', this.config.projectId);
        }
      } catch (err) {
        console.warn('⚠️ Error al inicializar Firebase SDK:', err);
        this.isConnected = false;
      }
    } else {
      this.isConnected = false;
    }

    return this.isConnected;
  },

  // Cargar configuración guardada o predeterminada
  loadConfig() {
    try {
      const raw = localStorage.getItem('patito_firebase_config');
      return raw ? JSON.parse(raw) : { ...DEFAULT_FIREBASE_CONFIG };
    } catch (e) {
      return { ...DEFAULT_FIREBASE_CONFIG };
    }
  },

  // Guardar nueva configuración de Firebase
  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('patito_firebase_config', JSON.stringify(this.config));
    return this.init();
  },

  // Comprobar si la configuración tiene los campos mínimos necesarios
  isValidConfig(cfg) {
    return Boolean(cfg && cfg.apiKey && cfg.projectId);
  },

  // Probar conexión en vivo con Firestore
  async testConnection() {
    if (!this.isConnected || !this.db) {
      const initialized = this.init();
      if (!initialized) {
        return { success: false, message: 'Credenciales incompletas o SDK no cargado.' };
      }
    }

    try {
      // Intentar leer o escribir un documento de verificación
      const pingRef = this.db.collection('system').doc('ping');
      await pingRef.set({ timestamp: new Date().toISOString(), app: 'Patito SHOP' }, { merge: true });
      return { success: true, message: `Conexión exitosa con el proyecto Firestore: ${this.config.projectId}` };
    } catch (err) {
      return { success: false, message: `Error de Firestore: ${err.message}` };
    }
  },

  // ========================================================================
  // PRODUCTOS (CLOUD FIRESTORE)
  // ========================================================================

  async getProducts() {
    if (this.isConnected && this.db) {
      try {
        const snapshot = await this.db.collection('products').get();
        if (!snapshot.empty) {
          const prods = [];
          snapshot.forEach(doc => {
            prods.push({ id: doc.id, ...doc.data() });
          });
          // Actualizar caché local
          saveStoredProducts(prods);
          return prods;
        }
      } catch (e) {
        console.warn('Fallo al obtener productos de Firestore, usando local:', e);
      }
    }
    // Fallback a localStorage
    return getStoredProducts();
  },

  async saveProduct(product) {
    // 1. Guardar siempre en local para disponibilidad inmediata
    const localProds = getStoredProducts();
    const idx = localProds.findIndex(p => p.id === product.id);
    if (idx > -1) {
      localProds[idx] = product;
    } else {
      localProds.unshift(product);
    }
    saveStoredProducts(localProds);

    // 2. Si Firebase está activo, sincronizar a la nube
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('products').doc(product.id).set(product, { merge: true });
        console.log(`Producto ${product.id} sincronizado en Firestore.`);
      } catch (e) {
        console.error('Error al guardar producto en Firestore:', e);
      }
    }

    return true;
  },

  async deleteProduct(productId) {
    // 1. Eliminar en local
    let localProds = getStoredProducts();
    localProds = localProds.filter(p => p.id !== productId);
    saveStoredProducts(localProds);

    // 2. Eliminar en Firestore si está conectado
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('products').doc(productId).delete();
        console.log(`Producto ${productId} eliminado de Firestore.`);
      } catch (e) {
        console.error('Error al eliminar producto en Firestore:', e);
      }
    }

    return true;
  },

  async syncAllLocalProductsToFirebase() {
    if (!this.isConnected || !this.db) {
      throw new Error('Firebase no está conectado. Configura tu proyecto primero.');
    }

    const localProds = getStoredProducts();
    const batch = this.db.batch();

    localProds.forEach(prod => {
      const ref = this.db.collection('products').doc(prod.id);
      batch.set(ref, prod, { merge: true });
    });

    await batch.commit();
    return localProds.length;
  },

  // ========================================================================
  // CONFIGURACIÓN DE LA TIENDA (CLOUD FIRESTORE)
  // ========================================================================

  async getStoreConfig() {
    if (this.isConnected && this.db) {
      try {
        const doc = await this.db.collection('store_config').doc('main').get();
        if (doc.exists) {
          const cfg = { ...DEFAULT_STORE_CONFIG, ...doc.data() };
          saveStoreConfig(cfg);
          return cfg;
        }
      } catch (e) {
        console.warn('Fallo al obtener configuración de Firestore, usando local:', e);
      }
    }
    return getStoreConfig();
  },

  async saveStoreConfig(cfg) {
    saveStoreConfig(cfg);

    if (this.isConnected && this.db) {
      try {
        await this.db.collection('store_config').doc('main').set(cfg, { merge: true });
        console.log('Configuración de tienda guardada en Firestore.');
      } catch (e) {
        console.error('Error al guardar configuración en Firestore:', e);
      }
    }

    return true;
  },

  // ========================================================================
  // PEDIDOS / ÓRDENES (CLOUD FIRESTORE)
  // ========================================================================

  async saveOrder(order) {
    // 1. Guardar en local
    saveStoredOrder(order);

    // 2. Guardar en Firestore
    if (this.isConnected && this.db) {
      try {
        await this.db.collection('orders').doc(order.id).set(order);
        console.log(`Pedido ${order.id} guardado en Cloud Firestore.`);
      } catch (e) {
        console.error('Error al registrar pedido en Firestore:', e);
      }
    }

    return true;
  },

  async getOrders() {
    if (this.isConnected && this.db) {
      try {
        const snapshot = await this.db.collection('orders').orderBy('date', 'desc').get();
        if (!snapshot.empty) {
          const orders = [];
          snapshot.forEach(doc => {
            orders.push(doc.data());
          });
          localStorage.setItem('patito_orders', JSON.stringify(orders));
          return orders;
        }
      } catch (e) {
        console.warn('Fallo al obtener órdenes de Firestore, usando local:', e);
      }
    }
    return getStoredOrders();
  },

  // ========================================================================
  // CUPONES (CLOUD FIRESTORE)
  // ========================================================================

  async getCoupons() {
    if (this.isConnected && this.db) {
      try {
        const doc = await this.db.collection('coupons').doc('active').get();
        if (doc.exists) {
          const coupons = doc.data();
          saveStoredCoupons(coupons);
          return coupons;
        }
      } catch (e) {
        console.warn('Fallo al obtener cupones de Firestore:', e);
      }
    }
    return getStoredCoupons();
  },

  async saveCoupons(coupons) {
    saveStoredCoupons(coupons);

    if (this.isConnected && this.db) {
      try {
        await this.db.collection('coupons').doc('active').set(coupons);
      } catch (e) {
        console.error('Error al guardar cupones en Firestore:', e);
      }
    }

    return true;
  }
};

// Auto-inicializar al cargar script
if (typeof window !== 'undefined') {
  window.FirebaseService = FirebaseService;
  document.addEventListener('DOMContentLoaded', () => {
    FirebaseService.init();
  });
}
