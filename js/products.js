/**
 * Patito SHOP - Catálogo Oficial de Productos
 * Contiene prendas, calzados y accesorios con datos detallados.
 */

const PRODUCTS_DATA = [
  // --- PRENDAS / ROPA ---
  {
    id: 'rop-01',
    name: 'Camiseta Oversize "Patito Club"',
    category: 'ropa',
    categoryLabel: 'Prendas',
    price: 24.99,
    originalPrice: 32.99,
    discount: 24,
    rating: 4.9,
    reviewsCount: 128,
    badge: 'Más Vendido',
    badgeType: 'hot',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Camiseta corte oversize confeccionada en algodón pesado 100% orgánico de 240 GSM. Diseño serigrafiado exclusivo con la emblemática insignia Patito Club en el pecho.',
    features: [
      '100% Algodón orgánico peinado',
      'Gramaje prémium de 240 GSM',
      'Cuello acanalado de alta durabilidad',
      'Apta para lavado a máquina'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', hex: '#18181b' },
      { name: 'Blanco', hex: '#f8fafc' },
      { name: 'Amarillo Patito', hex: '#f59e0b' }
    ],
    stock: 25
  },
  {
    id: 'rop-02',
    name: 'Hoodie Fleece Térmico "Urban Duck"',
    category: 'ropa',
    categoryLabel: 'Prendas',
    price: 49.99,
    originalPrice: 65.00,
    discount: 23,
    rating: 4.8,
    reviewsCount: 94,
    badge: 'Popular',
    badgeType: 'accent',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sudadera con capucha premium con interior afelpado extrasuave. Bolsillo canguro frontal reforzado y cordones ajustables con puntas metálicas.',
    features: [
      '80% Algodón, 20% Poliéster reciclado',
      'Interior frizado ultra cálido',
      'Bolsillo frontal de gran capacidad',
      'Bordado frontal en alta definición'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Amarillo Patito', hex: '#eab308' },
      { name: 'Gris Melange', hex: '#64748b' },
      { name: 'Negro', hex: '#0f172a' }
    ],
    stock: 14
  },
  {
    id: 'rop-03',
    name: 'Chaqueta Bomber Street Cortaviento',
    category: 'ropa',
    categoryLabel: 'Prendas',
    price: 68.50,
    originalPrice: 85.00,
    discount: 19,
    rating: 4.7,
    reviewsCount: 62,
    badge: 'Nuevo',
    badgeType: 'new',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Chaqueta estilo bomber urbana repelente al agua. Cierre de cremallera metálica bidireccional, forro interior satinado transpirable y bolsillos laterales con broche.',
    features: [
      'Tejido exterior impermeable grado DWR',
      'Cierre YKK reforzado',
      'Puños y cintura elásticos acanalados',
      'Bolsillo táctico con cremallera en manga'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Negro Grafito', hex: '#1e293b' },
      { name: 'Verde Militar', hex: '#3f6212' }
    ],
    stock: 8
  },
  {
    id: 'rop-04',
    name: 'Pantalón Cargo Streetwear Táctico',
    category: 'ropa',
    categoryLabel: 'Prendas',
    price: 42.00,
    originalPrice: 52.00,
    discount: 19,
    rating: 4.6,
    reviewsCount: 78,
    badge: 'Tendencia',
    badgeType: 'accent',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pantalón cargo de corte relaxed con múltiples bolsillos funcionales con tapeta. Cintura semi-elástica para máximo confort durante todo el día.',
    features: [
      'Tejido Ripstop antidesgarros',
      '6 bolsillos utilitarios de fácil acceso',
      'Tobillos ajustables con cordón interno',
      'Costuras reforzadas de triple puntada'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Caqui', hex: '#a89f91' },
      { name: 'Negro', hex: '#0f172a' },
      { name: 'Verde Oliva', hex: '#4d5d43' }
    ],
    stock: 19
  },
  {
    id: 'rop-05',
    name: 'Vestido Casual Verano Fresh Breeze',
    category: 'ropa',
    categoryLabel: 'Prendas',
    price: 36.90,
    originalPrice: 45.00,
    discount: 18,
    rating: 4.9,
    reviewsCount: 51,
    badge: 'Colección Verano',
    badgeType: 'accent',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vestido midi fluido de tacto fresco con mezcla de lino natural. Tirantes finos regulables, escote en V suave y caída libre estilizada.',
    features: [
      '65% Lino natural, 35% Rayón',
      'Textura ultra fresca y transpirable',
      'Cierre lateral invisible',
      'Corte vaporoso con forro ligero'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blanco Arena', hex: '#fafaf9' },
      { name: 'Amarillo Pastel', hex: '#fde047' },
      { name: 'Terracota', hex: '#c2410c' }
    ],
    stock: 11
  },
  {
    id: 'rop-06',
    name: 'Camisa Denim Classic Patito Fit',
    category: 'ropa',
    categoryLabel: 'Prendas',
    price: 38.00,
    originalPrice: 48.00,
    discount: 21,
    rating: 4.5,
    reviewsCount: 43,
    badge: '',
    badgeType: '',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Camisa vaquera de manga larga con lavado artesanal stonewash. Botones de nácar a presión y doble bolsillo en pecho con etiqueta tejida Patito.',
    features: [
      '100% Algodón denim flexible',
      'Lavado ecológico bajo en agua',
      'Botones automáticos de presión',
      'Costuras en contraste camel'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Azul Medio Stonewash', hex: '#3b82f6' },
      { name: 'Denim Oscuro', hex: '#1e3a8a' }
    ],
    stock: 16
  },

  // --- CALZADOS ---
  {
    id: 'cal-01',
    name: 'Sneakers Patito Runner Pro Air',
    category: 'calzados',
    categoryLabel: 'Calzados',
    price: 74.99,
    originalPrice: 99.99,
    discount: 25,
    rating: 5.0,
    reviewsCount: 210,
    badge: 'Top Ventas',
    badgeType: 'hot',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Zapatillas deportivas urbanas de alto rendimiento con amortiguación de cámara de aire y suela de tracción multi-terreno. Diseñadas para impacto suave y soporte duradero.',
    features: [
      'Suela intermedia reactiva CloudStep',
      'Malla técnica superior Knit transpirable',
      'Plantilla viscoelástica con memoria de pisada',
      'Detalles reflectantes 3M para visibilidad nocturna'
    ],
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: [
      { name: 'Rojo Carmesí', hex: '#dc2626' },
      { name: 'Negro Ébano', hex: '#18181b' },
      { name: 'Blanco Puro', hex: '#ffffff' }
    ],
    stock: 30
  },
  {
    id: 'cal-02',
    name: 'Retro Chunky Sneaker "Duck Vibe"',
    category: 'calzados',
    categoryLabel: 'Calzados',
    price: 69.90,
    originalPrice: 89.90,
    discount: 22,
    rating: 4.8,
    reviewsCount: 145,
    badge: 'Más Deseado',
    badgeType: 'accent',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Zapatilla de silueta retro noventera con suela con volumen geométrico y paneles combinados de gamuza vegana y textil microperforado.',
    features: [
      'Suela sobreelevada de EVA ultraligera',
      'Paneles sintéticos y gamuza prémium',
      'Refuerzo acolchado en tobillo y lengüeta',
      'Logo Patito moldeado en talón'
    ],
    sizes: ['37', '38', '39', '40', '41', '42'],
    colors: [
      { name: 'Blanco Hueso', hex: '#f5f5f4' },
      { name: 'Beige & Mostaza', hex: '#e2d5b6' }
    ],
    stock: 22
  },
  {
    id: 'cal-03',
    name: 'Botines Chelsea Cuero Vegano Heritage',
    category: 'calzados',
    categoryLabel: 'Calzados',
    price: 89.00,
    originalPrice: 115.00,
    discount: 23,
    rating: 4.9,
    reviewsCount: 88,
    badge: 'Elegancia',
    badgeType: 'new',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Botines estilo Chelsea con elásticos laterales y tirador para calzado veloz. Confeccionados en piel vegana de grado superior resistente al agua y acabado semi-brillante.',
    features: [
      'Cuero vegano hidrófugo de alto calibre',
      'Suela de goma vulcanizada con dibujo antideslizante',
      'Plantilla acolchada anti-fatiga',
      'Tirador de calzado reforzado'
    ],
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Negro Onix', hex: '#0f172a' },
      { name: 'Café Cognac', hex: '#78350f' }
    ],
    stock: 15
  },
  {
    id: 'cal-04',
    name: 'Sandalias Anatómicas "Pato Slide"',
    category: 'calzados',
    categoryLabel: 'Calzados',
    price: 28.50,
    originalPrice: 35.00,
    discount: 19,
    rating: 4.7,
    reviewsCount: 172,
    badge: 'Verano 2026',
    badgeType: 'accent',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sandalias ergonómicas de recuperación tipo pala con soporte de arco plantar. Moldeadas en una sola pieza de EVA espumada hidrofóbica.',
    features: [
      'Espuma EVA de densidad dual',
      '100% resistentes al agua y de secado exprés',
      'Superficie texturizada masajeadora',
      'Livianas: pesan menos de 180 gramos por par'
    ],
    sizes: ['38', '39', '40', '41', '42'],
    colors: [
      { name: 'Amarillo Patito', hex: '#eab308' },
      { name: 'Negro Mate', hex: '#18181b' },
      { name: 'Blanco Crema', hex: '#fef08a' }
    ],
    stock: 45
  },
  {
    id: 'cal-05',
    name: 'Zapatillas Urban Canvas Low Classic',
    category: 'calzados',
    categoryLabel: 'Calzados',
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    rating: 4.6,
    reviewsCount: 96,
    badge: '',
    badgeType: '',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Zapatilla de lona clásica con puntera redonda reforzada y suela vulcanizada flexible. El básico imprescindible para cualquier outfit diario.',
    features: [
      'Lona de algodón 100% de 12 oz',
      'Puntera de goma protectora',
      'Ojetes de aluminio antioxidante',
      'Plantilla interior transpirable'
    ],
    sizes: ['37', '38', '39', '40', '41', '42'],
    colors: [
      { name: 'Negro / Blanco', hex: '#111827' },
      { name: 'Azul Marino', hex: '#1e3a8a' },
      { name: 'Blanco', hex: '#f8fafc' }
    ],
    stock: 28
  },

  // --- ACCESORIOS ---
  {
    id: 'acc-01',
    name: 'Mochila Roll-Top Impermeable 22L',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 54.00,
    originalPrice: 69.00,
    discount: 22,
    rating: 4.9,
    reviewsCount: 164,
    badge: 'Destacado',
    badgeType: 'hot',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Mochila urbana con cierre superior enrollable y hebilla magnética FIDLOCK. Compartimento acolchado independiente para laptop de hasta 16 pulgadas y bolsillos termosellados.',
    features: [
      'Tejido Cordura 600D resistente al agua',
      'Funda acolchada para portátil 16"',
      'Espaldar ergonómico con malla transpirable',
      'Bolsillo antirrobo oculto en la espalda'
    ],
    sizes: ['Única'],
    colors: [
      { name: 'Negro Mate', hex: '#09090b' },
      { name: 'Verde Bosque', hex: '#166534' }
    ],
    stock: 18
  },
  {
    id: 'acc-02',
    name: 'Gorra Snapback Bordada Patito Icon',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 19.99,
    originalPrice: 26.00,
    discount: 23,
    rating: 4.8,
    reviewsCount: 112,
    badge: 'Popular',
    badgeType: 'accent',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Gorra de 6 paneles estructurada con visera plana moldeable. Bordado tridimensional del patito insignia en el panel frontal y cierre trasero ajustable.',
    features: [
      '80% Acrílico, 20% Lana de alta densidad',
      'Bordado 3D de alta precisión',
      'Banda interior absorbente de sudor',
      'Talla ajustable para todas las medidas'
    ],
    sizes: ['Única'],
    colors: [
      { name: 'Negro con Amarillo', hex: '#09090b' },
      { name: 'Amarillo Patito', hex: '#eab308' },
      { name: 'Beige Cálido', hex: '#d6d3d1' }
    ],
    stock: 35
  },
  {
    id: 'acc-03',
    name: 'Lentes de Sol Retro Polarizados UV400',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 32.50,
    originalPrice: 42.00,
    discount: 23,
    rating: 4.7,
    reviewsCount: 76,
    badge: 'Nuevo',
    badgeType: 'new',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Gafas de sol estilo retro cuadradas con montura de acetato ecológico pulido a mano. Cristales polarizados TAC con protección 100% contra radiación UVA/UVB.',
    features: [
      'Protección UV400 certificada categoría 3',
      'Lentes polarizados anti-reflejos de alta nitidez',
      'Bisagras metálicas de resorte flexible',
      'Incluye estuche rígido de viaje y paño de microfibra'
    ],
    sizes: ['Única'],
    colors: [
      { name: 'Carey Ámbar', hex: '#713f12' },
      { name: 'Negro Brillante', hex: '#171717' }
    ],
    stock: 24
  },
  {
    id: 'acc-04',
    name: 'Bucket Hat Reversible "Duck Safari"',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 21.00,
    originalPrice: 28.00,
    discount: 25,
    rating: 4.8,
    reviewsCount: 89,
    badge: 'Verano 2026',
    badgeType: 'accent',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Gorro de pescador reversible 2 en 1: por un lado diseño liso minimalista con logo sutil, y por el otro estampado geométrico moderno de patos.',
    features: [
      '100% Algodón twill respirable',
      'Diseño 100% reversible (2 estilos en 1)',
      'Ala flexible protectora solar',
      'Fácil de doblar y empacar'
    ],
    sizes: ['Única'],
    colors: [
      { name: 'Amarillo / Negro', hex: '#eab308' },
      { name: 'Beige / Kaki', hex: '#d6d3d1' }
    ],
    stock: 30
  },
  {
    id: 'acc-05',
    name: 'Riñonera Crossbody Táctica Urban Duck',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 26.50,
    originalPrice: 34.00,
    discount: 22,
    rating: 4.7,
    reviewsCount: 103,
    badge: '',
    badgeType: '',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bolso bandolera / riñonera compacta con correa de nylon ajustable de alto calibre. Ideal para llevar llaves, móvil, cartera y gadgets seguros.',
    features: [
      'Nylon balístico repelente a salpicaduras',
      'Correa ajustable para llevar al hombro o cintura',
      'Cremalleras estancas con tiradores reflectantes',
      'Mosquetón interior porta-llaves'
    ],
    sizes: ['Única'],
    colors: [
      { name: 'Negro Táctico', hex: '#18181b' },
      { name: 'Amarillo Patito', hex: '#f59e0b' }
    ],
    stock: 20
  },
  {
    id: 'acc-06',
    name: 'Reloj Minimalista Cuarzo "Duck Edition"',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 79.00,
    originalPrice: 110.00,
    discount: 28,
    rating: 4.9,
    reviewsCount: 65,
    badge: 'Edición Limitada',
    badgeType: 'hot',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Reloj de pulsera con caja de acero inoxidable 316L pulido y dial minimalista con el segundero en color amarillo distintivo de Patito SHOP.',
    features: [
      'Movimiento japonés de cuarzo Citizen Miyota',
      'Cristal mineral endurecido antiarañazos',
      'Resistente al agua hasta 5 ATM (50 metros)',
      'Correa intercambiable de liberación rápida'
    ],
    sizes: ['Única'],
    colors: [
      { name: 'Plata / Negro', hex: '#94a3b8' },
      { name: 'Oro Rosa', hex: '#e2b3a3' }
    ],
    stock: 9
  }
];

// Cupones de descuento válidos
const DISCOUNT_COUPONS = {
  'PATITO10': { type: 'percent', value: 10, label: '10% de Descuento por Bienvenida' },
  'PATITOPREMIUM': { type: 'percent', value: 20, label: '20% de Descuento Especial Patito' },
  'ENVIOGRATIS': { type: 'shipping', value: 0, label: 'Envío Gratis Garantizado' },
  'VERANO': { type: 'fixed', value: 15, label: '$15 USD de Descuento de Verano' }
};
