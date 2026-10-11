# 🦆 Patito SHOP - Tienda Virtual Responsive

Una aplicación web moderna, accesible, intuitiva y 100% responsiva para **Patito SHOP**, tienda oficial de moda especializada en **prendas**, **ropa**, **calzados** y **accesorios**.

---

## ✨ Características Principales

### 🛒 Experiencia de Compra & Carrito Interactivo
- **Drawer Lateral Fluido**: Carrito deslizable con fondo difuminado (*glassmorphism*), control de cantidades por producto (`+` / `-`) y eliminación de artículos.
- **Barra de Envío Gratis Dinámica**: Calcula en tiempo real cuánto dinero falta para alcanzar los **$50.00 USD** requeridos para envío gratuito.
- **Sistema de Cupones de Descuento**:
  - `PATITO10`: 10% de descuento en el total.
  - `PATITOPREMIUM`: 20% de descuento en el total.
  - `VERANO`: $15.00 USD de descuento fijo.
  - `ENVIOGRATIS`: Envío gratis garantizado en cualquier pedido.
- **Persistencia en LocalStorage**: Tu carrito y cupones se mantienen guardados aunque recargues la página.
- **Checkout Integrado & Simulado**: Formulario con validación de datos de entrega, selección de métodos de pago (Tarjeta de crédito, PayPal, Pago Contra Entrega) y comprobante final con número de orden único y opción para **Imprimir Recibo**.

### 👕 Catálogo de Productos Completo
- **Categorías**:
  - **Prendas / Ropa**: Camisetas Oversize, Sudaderas térmicas *Duck Fleece*, Chaquetas bomber cortaviento, Pantalones cargo tácticos, Vestidos frescos de verano, Camisas denim.
  - **Calzados**: Sneakers *Patito Runner Pro Air*, Zapatillas retro *Chunky*, Botines *Chelsea* de cuero vegano, Sandalias anatómicas *Pato Slide*, Canvas clásicas.
  - **Accesorios**: Mochilas impermeables *Roll-Top*, Gorras Snapback bordadas, Lentes de sol polarizados UV400, *Bucket Hats* reversibles, Riñoneras crossbody, Relojes minimalistas.
- **Filtros Avanzados en Tiempo Real**:
  - Filtro por categoría (Todas, Ropa, Calzados, Accesorios).
  - Búsqueda en vivo por texto en títulos y descripciones.
  - Control deslizante por rango de precio máximo ($20 - $120+).
  - Selector de tallas interactivas (S, M, L, XL, 39, 40, 41, 42).
  - Ordenamiento por: Destacados, Precio (menor a mayor / mayor a menor), Calificación y Más Nuevos.

### 🔍 Vista Rápida (Quick View) & Guía de Tallas
- Modal interactivo con galería de imágenes en alta resolución y miniaturas intercambiables.
- Selector visual de colores (*color swatches*) y tallas.
- Selector de cantidad y especificaciones técnicas.
- Modal dedicado con la **Guía Oficial de Tallas** para prendas y calzado con medidas en centímetros y equivalencias internacionales.

### 💖 Lista de Deseos (Wishlist / Favoritos)
- Marca cualquier producto como favorito con el icono de corazón.
- Drawer lateral dedicado para visualizar tus artículos deseados y moverlos al carrito con un solo clic.

### 🛠️ Panel de Administración y Gestión (`admin.html`)
- **Acceso Administrativo**: Pantalla de login segura (Credenciales por defecto: `admin@patitoshop.com` / `patito2026`).
- **Gestión de Productos (CRUD Completo)**:
  - Crear nuevos productos (con foto, tallas, precio, stock, descripción, badge).
  - Editar cualquier producto existente y ajustar precios o stock.
  - Eliminar productos o restaurar el catálogo original de fábrica.
- **Información de la Tienda & Contacto**:
  - Modificar teléfonos, WhatsApp, correo de soporte, horarios, dirección y anuncio superior en vivo.
- **Pagos, Envíos & Cupones**:
  - Ajustar umbral para envío gratis, costo de envío e IVA.
  - Habilitar o deshabilitar métodos de pago (Tarjetas, PayPal, Contra Entrega).
  - Crear nuevos códigos de cupones de descuento (porcentaje o monto fijo).
- **Gestor de Pedidos**:
  - Visualizar todas las órdenes de compra realizadas por los clientes con sus datos de contacto y entrega.

### 🔥 Integración Cloud con Google Firebase (`Firestore`)
- **Persistencia Híbrida**: Almacenamiento dual que combina **Cloud Firestore** con fallback automático a **LocalStorage** (funciona 100% offline o conectado a la nube).
- **Gestor Visual de Credenciales**: Pestaña dedicada en `admin.html` para ingresar `apiKey`, `projectId`, etc.
- **Botón de Ping en Vivo**: Prueba la conexión con Cloud Firestore en tiempo real.
- **Sincronización en un Clic**: Botón para subir todo el catálogo inicial local a Firestore con un solo clic.
- **Sincronización de Pedidos**: Las compras en la tienda se registran instantáneamente en la colección `orders` de Firestore.

### ♿ Accesibilidad (WCAG AA) & Experiencia de Usuario (UX)
- Navegación por teclado completa (foco visible accesible, tecla `Escape` para cerrar cualquier modal/drawer).
- Enlace de salto rápido (*Skip Link*) para lectores de pantalla.
- Notificaciones Toast flotantes con confirmación sonora/visual de cada acción.
- Modo Claro / Modo Oscuro con detección automática de preferencias del sistema y persistencia.

---

## 🚀 Cómo Abrir y Usar la Aplicación

No requiere instalaciones complejas ni gestores de paquetes. Está desarrollada en estándares web modernos (HTML5, Tailwind CSS via CDN, Lucide Icons, Vanilla JavaScript ES6+):

1. **Abrir directamente en el navegador**:
   - Haz doble clic en el archivo `index.html` o ábrelo con Google Chrome, Mozilla Firefox, Microsoft Edge o Safari.
2. **Opcional (con servidor local)**:
   - Si utilizas VS Code, puedes hacer clic derecho en `index.html` y seleccionar **"Open with Live Server"**.
   - O usando cualquier servidor HTTP local:
     ```bash
     npx serve .
     # o
     python -m http.server 8000
     ```

---

## 📁 Estructura del Proyecto

```text
Web-01/
├── index.html          # Estructura semántica, accesibilidad y modales
├── css/
│   └── styles.css      # Variables de diseño, animaciones y soporte para impresión
├── js/
│   ├── products.js     # Catálogo de datos mock (prendas, calzado, accesorios) y cupones
│   └── app.js          # Lógica reactiva (carrito, filtros, checkout, modales, toasts)
└── README.md           # Documentación del proyecto
```

---

## 🎨 Paleta de Marca Patito SHOP
- **Amarillo Patito**: `#f59e0b` / `#fbbf24` (Acento vibrante, optimista y fresco)
- **Fondo Claro**: `#f8fafc` / `#ffffff`
- **Fondo Oscuro**: `#0f172a` / `#020617`
- **Acentos de Estado**: Esmeralda `#10b981` (éxito), Carmesí `#f43f5e` (ofertas y favoritos).
