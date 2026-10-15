const clothingProducts = [
  {
    name: 'Polera Aurora',
    price: 13990,
    category: 'poleras',
    gender: 'mujer',
    size: 's,m',
    color: 'negro',
    material: 'reciclado',
  },
  {
    name: 'Polera Ágata',
    price: 18990,
    category: 'poleras',
    gender: 'mujer',
    size: 'm,l',
    color: 'beige',
    material: 'lino',
  },
  {
    name: 'Polera Bruno',
    price: 16990,
    category: 'poleras',
    gender: 'hombre',
    size: 'm,l',
    color: 'verde',
    material: 'algodon',
  },
  {
    name: 'Polera Nómade',
    price: 15990,
    category: 'poleras',
    gender: 'unisex',
    size: 's,m,l',
    color: 'verde',
    material: 'reciclado',
  },
  {
    name: 'Polera Boreal',
    price: 19990,
    category: 'poleras',
    gender: 'mujer',
    size: 's,m',
    color: 'beige',
    material: 'algodon',
  },
  {
    name: 'Polera Oceana',
    price: 17990,
    category: 'poleras',
    gender: 'unisex',
    size: 'm,l',
    color: 'negro',
    material: 'algodon',
  },
  {
    name: 'Pantalón Sonia',
    price: 28990,
    category: 'pantalones',
    gender: 'mujer',
    size: 's,m,l',
    color: 'beige',
    material: 'lino',
  },
  {
    name: 'Pantalón Roble',
    price: 32990,
    category: 'pantalones',
    gender: 'hombre',
    size: 'm,l',
    color: 'negro',
    material: 'reciclado',
  },
  {
    name: 'Pantalón Arena',
    price: 25990,
    category: 'pantalones',
    gender: 'unisex',
    size: 's,m,l',
    color: 'beige',
    material: 'algodon',
  },
  {
    name: 'Polerón Inés',
    price: 34990,
    category: 'polerones',
    gender: 'mujer',
    size: 's,m',
    color: 'verde',
    material: 'algodon',
  },
  {
    name: 'Polerón Austral',
    price: 38990,
    category: 'polerones',
    gender: 'unisex',
    size: 'm,l',
    color: 'negro',
    material: 'reciclado',
  },
  {
    name: 'Zapatilla Raíz',
    price: 41990,
    category: 'calzado',
    gender: 'unisex',
    size: 'm,l',
    color: 'verde',
    material: 'reciclado',
  },
  {
    name: 'Tote Bag Lima',
    price: 11990,
    category: 'accesorios',
    gender: 'unisex',
    size: 'm',
    color: 'beige',
    material: 'reciclado',
  },
];

export type Product = {
  name: string;
  price: number;
  department: string;
  category: string;
  gender: string;
  size: string;
  color: string;
  material: string;
  description: string;
  footprint: string;
  production: string;
};

const additionalProducts: Product[] = [
  {
    name: 'Granola Amanecer',
    price: 5990,
    department: 'alimentos',
    category: 'desayunos',
    material: 'avena',
    size: '450 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Mezcla de avena, semillas y frutos secos tostados, ideal para acompañar yogur o fruta.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Miel Valle Dorado',
    price: 7990,
    department: 'alimentos',
    category: 'despensa',
    material: 'miel',
    size: '500 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Miel de flores en frasco de vidrio, de sabor suave para endulzar infusiones y desayunos.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Té de Hierbas del Sur',
    price: 4490,
    department: 'alimentos',
    category: 'infusiones',
    material: 'hierbas',
    size: '20 bolsitas',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Infusión de menta, melisa y manzanilla para disfrutar caliente o fría.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Mermelada Frutos del Bosque',
    price: 5290,
    department: 'alimentos',
    category: 'despensa',
    material: 'frutas',
    size: '250 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Preparación de berries en frasco de vidrio, perfecta para tostadas y postres caseros.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Mix de Frutos Secos Cordillera',
    price: 6490,
    department: 'alimentos',
    category: 'snacks',
    material: 'frutos secos',
    size: '250 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Selección de nueces, almendras y pasas para llevar una colación práctica a cualquier lugar.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Café Tostado Horizonte',
    price: 9990,
    department: 'alimentos',
    category: 'bebidas',
    material: 'cafe',
    size: '250 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Café molido de tueste medio con notas de cacao, pensado para filtro y prensa francesa.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Jabón Botánico de Avena',
    price: 3490,
    department: 'cuidado-personal',
    category: 'jabones',
    material: 'avena',
    size: '100 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Barra de jabón con avena y aceites vegetales, presentada en una envoltura de papel.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Shampoo Sólido Brisa',
    price: 6990,
    department: 'cuidado-personal',
    category: 'cabello',
    material: 'aceites vegetales',
    size: '80 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Shampoo en barra para tu rutina de lavado, fácil de transportar y sin botella plástica.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Bálsamo Labial Cacao',
    price: 2990,
    department: 'cuidado-personal',
    category: 'rostro',
    material: 'cacao',
    size: '15 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Bálsamo de textura suave con manteca de cacao en un pequeño envase reutilizable.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Cepillo Dental de Bambú',
    price: 2490,
    department: 'cuidado-personal',
    category: 'higiene',
    material: 'bambu',
    size: '1 unidad',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Cepillo de cerdas suaves y mango de bambú para el cuidado bucal cotidiano.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Crema de Manos Caléndula',
    price: 5990,
    department: 'cuidado-personal',
    category: 'cuerpo',
    material: 'calendula',
    size: '60 ml',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Crema de textura ligera y aroma floral en un envase compacto para llevar contigo.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Esponja Vegetal Luffa',
    price: 1990,
    department: 'cuidado-personal',
    category: 'accesorios',
    material: 'luffa',
    size: '1 unidad',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Esponja de fibra vegetal que puedes usar en la ducha y dejar secar entre usos.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Kit Huerto Aromático',
    price: 12990,
    department: 'huerto-y-jardineria',
    category: 'kits de cultivo',
    material: 'semillas',
    size: '1 kit',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Incluye semillas de albahaca, perejil y cilantro, junto con una guía para comenzar tu huerto.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Macetero de Terracota Tierra',
    price: 6990,
    department: 'huerto-y-jardineria',
    category: 'maceteros',
    material: 'terracota',
    size: '18 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Macetero de terracota con orificio de drenaje, ideal para hierbas y plantas pequeñas.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Semillas de Tomate Cherry',
    price: 1990,
    department: 'huerto-y-jardineria',
    category: 'semillas',
    material: 'semillas',
    size: '1 sobre',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Sobre de semillas para cultivar tomates cherry en maceta o jardín.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Compost para Jardín',
    price: 4990,
    department: 'huerto-y-jardineria',
    category: 'sustratos',
    material: 'compost',
    size: '5 litros',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Compost para mezclar con el sustrato de tus macetas y preparar nuevos cultivos.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Regadera Brote',
    price: 11990,
    department: 'huerto-y-jardineria',
    category: 'herramientas',
    material: 'metal',
    size: '1.5 litros',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Regadera de metal con pico fino para dirigir el agua a la base de tus plantas.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Pala de Jardín Roble',
    price: 5990,
    department: 'huerto-y-jardineria',
    category: 'herramientas',
    material: 'madera y acero',
    size: '1 unidad',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Pala de mano con mango de madera para trasplantar y trabajar la tierra en espacios pequeños.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Limpiador Multiuso Cítrico',
    price: 4990,
    department: 'limpieza-del-hogar',
    category: 'limpiadores',
    material: 'ingredientes vegetales',
    size: '500 ml',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Limpiador de aroma cítrico para superficies lavables, en botella preparada para recarga.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Detergente Lavanda',
    price: 7990,
    department: 'limpieza-del-hogar',
    category: 'lavanderia',
    material: 'ingredientes vegetales',
    size: '1 litro',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Detergente líquido de aroma a lavanda para la limpieza habitual de tu ropa.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Cepillo para Loza Nativo',
    price: 3990,
    department: 'limpieza-del-hogar',
    category: 'utensilios',
    material: 'madera',
    size: '1 unidad',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Cepillo con mango de madera y cabezal de fibras para lavar platos y utensilios.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Paños Reutilizables Hogar',
    price: 5490,
    department: 'limpieza-del-hogar',
    category: 'textiles',
    material: 'algodon',
    size: 'Pack de 3',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Paños lavables de algodón para secar y limpiar, una alternativa al papel de un solo uso.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Jabón para Loza Sólido',
    price: 4490,
    department: 'limpieza-del-hogar',
    category: 'lavalozas',
    material: 'aceites vegetales',
    size: '150 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Jabón en barra para usar con tu cepillo o esponja al lavar la loza.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Bolsas para Separar Residuos',
    price: 8990,
    department: 'limpieza-del-hogar',
    category: 'organizacion',
    material: 'reciclado',
    size: 'Pack de 3',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Bolsas resistentes y reutilizables para organizar papel, vidrio y otros residuos en casa.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Vela Bosque Nativo',
    price: 8990,
    department: 'aromas-y-bienestar',
    category: 'velas',
    material: 'cera vegetal',
    size: '180 g',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Vela de cera vegetal con aroma amaderado en un recipiente de vidrio reutilizable.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Difusor Bruma de Lavanda',
    price: 12990,
    department: 'aromas-y-bienestar',
    category: 'difusores',
    material: 'aceites aromaticos',
    size: '100 ml',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Difusor con varillas y aroma a lavanda para perfumar suavemente tus espacios.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Saco de Semillas Calma',
    price: 9990,
    department: 'aromas-y-bienestar',
    category: 'relajacion',
    material: 'algodon y semillas',
    size: '1 unidad',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Saco textil relleno de semillas para acompañar tus momentos de descanso.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Incienso Jardín Sereno',
    price: 3990,
    department: 'aromas-y-bienestar',
    category: 'inciensos',
    material: 'fibras vegetales',
    size: '12 varillas',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Varillas aromáticas de notas florales para usar en un soporte y un ambiente ventilado.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Almohadilla de Ojos Pausa',
    price: 6990,
    department: 'aromas-y-bienestar',
    category: 'relajacion',
    material: 'lino y semillas',
    size: '1 unidad',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Almohadilla de lino con relleno de semillas, diseñada para tus pausas de relajación.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Spray Ambiental Cítrico',
    price: 5990,
    department: 'aromas-y-bienestar',
    category: 'aromas de ambiente',
    material: 'aceites aromaticos',
    size: '100 ml',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Spray de aroma cítrico para renovar el ambiente de tus espacios cotidianos.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Juguete de Cuerda Compañero',
    price: 4990,
    department: 'mascotas',
    category: 'juguetes',
    material: 'algodon',
    size: '1 unidad',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Juguete trenzado de algodón para compartir momentos de juego supervisado con tu perro.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Plato Cerámico Huella',
    price: 9990,
    department: 'mascotas',
    category: 'alimentacion',
    material: 'ceramica',
    size: '500 ml',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Plato de cerámica de base firme para servir agua o alimento a tu mascota.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Cama Nido para Mascotas',
    price: 29990,
    department: 'mascotas',
    category: 'descanso',
    material: 'reciclado',
    size: '60 × 45 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Cama acolchada con funda lavable para crear un rincón cómodo de descanso.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Collar Paseo Natural',
    price: 8990,
    department: 'mascotas',
    category: 'paseo',
    material: 'algodon',
    size: 'Ajustable 30–45 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Collar ajustable de cinta de algodón con cierre firme para los paseos diarios.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Rascador de Cartón Gato',
    price: 11990,
    department: 'mascotas',
    category: 'juguetes',
    material: 'carton reciclado',
    size: '40 × 25 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Rascador de cartón corrugado para que tu gato tenga un espacio propio de juego y rascado.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Dispensador de Bolsas Paseo',
    price: 3490,
    department: 'mascotas',
    category: 'paseo',
    material: 'reciclado',
    size: '1 unidad',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Dispensador compacto con enganche para llevar bolsas durante los paseos con tu mascota.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Jarrón Cerámico Tierra Viva',
    price: 18990,
    department: 'decoracion-y-artesania',
    category: 'ceramica',
    material: 'ceramica',
    size: '22 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Jarrón de cerámica de acabado mate para flores secas o pequeños arreglos decorativos.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Canasto de Fibras Raíz',
    price: 14990,
    department: 'decoracion-y-artesania',
    category: 'cesteria',
    material: 'fibras naturales',
    size: '25 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Canasto tejido para organizar accesorios y dar un toque cálido a tus espacios.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Bandeja de Madera Oficio Sur',
    price: 16990,
    department: 'decoracion-y-artesania',
    category: 'madera',
    material: 'madera recuperada',
    size: '30 × 20 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Bandeja de madera recuperada para servir o reunir objetos cotidianos en un solo lugar.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Colgante de Macramé Nudo',
    price: 11990,
    department: 'decoracion-y-artesania',
    category: 'textiles',
    material: 'algodon',
    size: '70 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Colgante tejido a mano con cordón de algodón para exhibir una maceta pequeña.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Taza Artesanal Amanecer',
    price: 8990,
    department: 'decoracion-y-artesania',
    category: 'ceramica',
    material: 'ceramica',
    size: '300 ml',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Taza de cerámica con asa amplia y acabado artesanal para tus bebidas favoritas.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
  {
    name: 'Funda de Cojín Trama',
    price: 13990,
    department: 'decoracion-y-artesania',
    category: 'textiles',
    material: 'lino',
    size: '45 × 45 cm',
    color: 'Natural',
    gender: 'unisex',
    description:
      'Funda de lino con cierre discreto, pensada para renovar tu living o dormitorio.',
    footprint:
      'Embalaje reducido · Diseño para uso cotidiano · Consumo consciente',
    production:
      'Producto de ejemplo seleccionado para acompañar una rutina de consumo consciente. Consulta su presentación antes de agregarlo a tu compra.',
  },
];

export const products: Product[] = [
  ...clothingProducts.map((p) => ({
    ...p,
    department: 'ropa-y-accesorios',
    description:
      p.category === 'accesorios'
        ? 'Bolso reutilizable de diseño local para llevar tus compras y objetos cotidianos.'
        : p.category === 'calzado'
          ? 'Calzado de diseño versátil con materiales recuperados para acompañarte cada día.'
          : p.category === 'pantalones'
            ? 'Pantalón de corte cómodo y confección local, ideal para combinar en tu rutina diaria.'
            : p.category === 'polerones'
              ? 'Polerón abrigado de confección local, pensado para días frescos y uso cotidiano.'
              : 'Polera de confección local, con una textura suave y un diseño cómodo para todos los días.',
    footprint:
      'Materiales responsables · Producción local · Embalaje reciclable',
    production:
      'Confeccionado en pequeños talleres locales, cuidando los materiales y los detalles de cada prenda.',
  })),
  ...additionalProducts,
];

export const money = (n: number) => '$' + n.toLocaleString('es-CL');

export const productUrl = (p: { name: string; department?: string }) =>
  '/productos/' +
  (p.department ??
    products.find((product) => product.name === p.name)?.department ??
    'ropa-y-accesorios') +
  '/producto?name=' +
  encodeURIComponent(p.name);

export const variantOptions = (value: string) =>
  value
    .split(',')
    .map((option) => option.trim())
    .filter(Boolean);

export const quickSelection = (p: Product) => ({
  ...p,
  size:
    variantOptions(p.size).length === 1
      ? variantOptions(p.size)[0]
      : 'Por elegir',
  color:
    variantOptions(p.color).length === 1
      ? variantOptions(p.color)[0]
      : 'Por elegir',
});

export const productLabels = (item: { name: string }) =>
  products.find((product) => product.name === item.name)?.department ===
  'ropa-y-accesorios'
    ? { size: 'Talla', color: 'Color' }
    : { size: 'Presentación', color: 'Acabado' };
