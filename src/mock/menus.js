const getFormattedMenuName = (eventType, menuDateString) => {
    const date = new Date(menuDateString);
    const options = { weekday: 'long', day: '2-digit', month: '2-digit' };
    const formattedDate = date.toLocaleDateString('es-ES', options); // e.g., "lunes 01/09"
    const [dayOfWeek, datePart] = formattedDate.split(' ');
    const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    return `Menú ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} ${capitalizedDayOfWeek} ${datePart}`;
};

const isWeekend = (dateString) => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
};

const allMenus = [
  {
    id: 1,
    name: getFormattedMenuName('almuerzo', '2025-09-01'),
    description: 'Un delicioso y balanceado plato de pollo al horno con patatas doradas, acompañado de una ensalada fresca de lechuga y tomate. Incluye una bebida a elección.',
    closingDate: '2025-09-01T10:00:00',
    deliveryDate: '2025-09-01T13:00:00',
    eventType: 'almuerzo',
    menuDate: '2025-09-01',
    mainCourses: [],
        desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/E67E22/white?text=Pollo+al+Horno',
      'https://placehold.co/600x400/2ECC71/white?text=Ensalada',
      'https://placehold.co/600x400/3498DB/white?text=Bebida',
      'https://placehold.co/600x400/9B59B6/white?text=Postre',
      'https://placehold.co/600x400/1ABC9C/white?text=Vista+General'
    ]
  },
  {
    id: 2,
    name: getFormattedMenuName('cena', '2025-09-02'),
    description: 'Salmón a la plancha con una guarnición de arroz y vegetales salteados. Perfecto para una comida de negocios. Incluye bebida y postre del día.',
    closingDate: '2025-09-02T10:00:00',
    deliveryDate: '2025-09-02T21:00:00',
    eventType: 'cena',
    menuDate: '2025-09-02',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/E74C3C/white?text=Salmón',
      'https://placehold.co/600x400/F1C40F/white?text=Arroz',
      'https://placehold.co/600x400/27AE60/white?text=Vegetales',
      'https://placehold.co/600x400/8E44AD/white?text=Postre',
      'https://placehold.co/600x400/2980B9/white?text=Bebida'
    ]
  },
  {
    id: 3,
    name: getFormattedMenuName('almuerzo', '2025-09-03'),
    description: 'Lasaña de espinacas y ricotta con salsa de tomate casera, gratinada con queso parmesano. Una opción saludable y deliciosa. Incluye bebida.',
    closingDate: '2025-09-03T10:00:00',
    deliveryDate: '2025-09-03T13:00:00',
    eventType: 'almuerzo',
    menuDate: '2025-09-03',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/2ECC71/white?text=Lasaña',
      'https://placehold.co/600x400/E67E22/white?text=Espinacas',
      'https://placehold.co/600x400/3498DB/white?text=Salsa+de+Tomate',
      'https://placehold.co/600x400/9B59B6/white?text=Queso',
      'https://placehold.co/600x400/1ABC9C/white?text=Bebida'
    ]
  },
  {
    id: 4,
    name: getFormattedMenuName('cena', '2025-09-04'),
    description: 'Spaghetti a la carbonara con panceta crujiente, yema de huevo y queso pecorino. Un clásico italiano que nunca falla. Incluye bebida.',
    closingDate: '2025-09-04T10:00:00',
    deliveryDate: '2025-09-04T21:00:00',
    eventType: 'cena',
    menuDate: '2025-09-04',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/F1C40F/white?text=Spaghetti',
      'https://placehold.co/600x400/E74C3C/white?text=Panceta',
      'https://placehold.co/600x400/3498DB/white?text=Queso+Pecorino',
      'https://placehold.co/600x400/2ECC71/white?text=Huevo',
      'https://placehold.co/600x400/1ABC9C/white?text=Bebida'
    ]
  },
  {
    id: 5,
    name: getFormattedMenuName('almuerzo', '2025-09-05'),
    description: 'Hamburguesa gourmet de ternera con queso cheddar, bacon, lechuga, tomate y salsa especial en pan brioche. Acompañada de patatas fritas.',
    closingDate: '2025-09-05T10:00:00',
    deliveryDate: '2025-09-05T13:00:00',
    eventType: 'almuerzo',
    menuDate: '2025-09-05',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/E74C3C/white?text=Hamburguesa',
      'https://placehold.co/600x400/F1C40F/white?text=Patatas+Fritas',
      'https://placehold.co/600x400/27AE60/white?text=Queso+Cheddar',
      'https://placehold.co/600x400/3498DB/white?text=Bacon',
      'https://placehold.co/600x400/8E44AD/white?text=Salsa+Especial'
    ]
  },
  {
    id: 6,
    name: getFormattedMenuName('cena', '2025-09-08'),
    description: 'Pollo teriyaki con arroz blanco y sésamo. Un plato con sabores agridulces y una textura jugosa que te transportará a Japón.',
    closingDate: '2025-09-08T10:00:00',
    deliveryDate: '2025-09-08T21:00:00',
    eventType: 'cena',
    menuDate: '2025-09-08',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/E74C3C/white?text=Pollo+Teriyaki',
      'https://placehold.co/600x400/ECF0F1/black?text=Arroz',
      'https://placehold.co/600x400/2C3E50/white?text=Sésamo',
      'https://placehold.co/600x400/3498DB/white?text=Bebida',
      'https://placehold.co/600x400/1ABC9C/white?text=Vista+Plato'
    ]
  },
  {
    id: 7,
    name: getFormattedMenuName('almuerzo', '2025-09-09'),
    description: 'Merluza en salsa verde con almejas y espárragos. Un plato ligero y lleno de sabor, ideal para los amantes del pescado.',
    closingDate: '2025-09-09T10:00:00',
    deliveryDate: '2025-09-09T13:00:00',
    eventType: 'almuerzo',
    menuDate: '2025-09-09',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/3498DB/white?text=Merluza',
      'https://placehold.co/600x400/2ECC71/white?text=Salsa+Verde',
      'https://placehold.co/600x400/BDC3C7/black?text=Almejas',
      'https://placehold.co/600x400/16A085/white?text=Espárragos',
      'https://placehold.co/600x400/E67E22/white?text=Vino+Blanco'
    ]
  },
  {
    id: 8,
    name: getFormattedMenuName('cena', '2025-09-10'),
    description: 'Curry de garbanzos y lentejas con leche de coco, acompañado de arroz basmati. Un plato exótico, nutritivo y 100% vegano.',
    closingDate: '2025-09-10T10:00:00',
    deliveryDate: '2025-09-10T21:00:00',
    eventType: 'cena',
    menuDate: '2025-09-10',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/F1C40F/white?text=Curry',
      'https://placehold.co/600x400/E67E22/white?text=Garbanzos',
      'https://placehold.co/600x400/27AE60/white?text=Leche+de+Coco',
      'https://placehold.co/600x400/ECF0F1/black?text=Arroz+Basmati',
      'https://placehold.co/600x400/3498DB/white?text=Bebida+Natural'
    ]
  },
  {
    id: 9,
    name: getFormattedMenuName('almuerzo', '2025-09-11'),
    description: 'Lentejas a la riojana con chorizo y patata. Un plato tradicional, reconfortante y lleno de energía para afrontar el día.',
    closingDate: '2025-09-11T10:00:00',
    deliveryDate: '2025-09-11T13:00:00',
    eventType: 'almuerzo',
    menuDate: '2025-09-11',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/C0392B/white?text=Lentejas',
      'https://placehold.co/600x400/E74C3C/white?text=Chorizo',
      'https://placehold.co/600x400/F39C12/white?text=Patata',
      'https.co/600x400/7F8C8D/white?text=Pan'
    ]
  },
  {
    id: 10,
    name: getFormattedMenuName('cena', '2025-09-12'),
    description: 'Fajitas de pollo con pimientos y cebolla, acompañadas de tortillas de trigo, guacamole y pico de gallo. ¡Una fiesta de sabores!',
    closingDate: '2025-09-12T10:00:00',
    deliveryDate: '2025-09-12T21:00:00',
    eventType: 'cena',
    menuDate: '2025-09-12',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/E67E22/white?text=Fajitas',
      'https://placehold.co/600x400/2ECC71/white?text=Guacamole',
      'https://placehold.co/600x400/E74C3C/white?text=Pico+de+Gallo',
      'https://placehold.co/600x400/F1C40F/white?text=Tortillas',
      'https://placehold.co/600x400/3498DB/white?text=Cerveza'
    ]
  },
  {
    id: 11,
    name: getFormattedMenuName('almuerzo', '2025-09-15'),
    description: 'Clásica ensalada César con pollo a la parrilla, lechuga romana, croutons, queso parmesano y aderezo César casero.',
    closingDate: '2025-09-15T10:00:00',
    deliveryDate: '2025-09-15T13:00:00',
    eventType: 'almuerzo',
    menuDate: '2025-09-15',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/27AE60/white?text=Ensalada+César',
      'https://placehold.co/600x400/E67E22/white?text=Pollo+Parrilla',
      'https://placehold.co/600x400/F1C40F/white?text=Aderezo',
      'https://placehold.co/600x400/ECF0F1/black?text=Queso+Parmesano',
      'https://placehold.co/600x400/BDC3C7/black?text=Croutons'
    ]
  },
  {
    id: 12,
    name: getFormattedMenuName('cena', '2025-09-16'),
    description: 'Secreto ibérico a la plancha con patatas revolconas y pimientos de padrón. Un manjar de la gastronomía española.',
    closingDate: '2025-09-16T10:00:00',
    deliveryDate: '2025-09-16T21:00:00',
    eventType: 'cena',
    menuDate: '2025-09-16',
    mainCourses: [],
    desserts: [],
    drinks: [],
    images: [
      'https://placehold.co/600x400/C0392B/white?text=Secreto+Ibérico',
      'https://placehold.co/600x400/F39C12/white?text=Patatas+Revolconas',
      'https://placehold.co/600x400/27AE60/white?text=Pimientos+de+Padrón',
      'https://placehold.co/600x400/E74C3C/white?text=Carne',
      'https://placehold.co/600x400/2C3E50/white?text=Vino+Tinto'
    ]
  }
];

export const menus = allMenus.filter(menu => !isWeekend(menu.menuDate));