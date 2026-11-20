import { hitoAsset, hitoProducts } from './hito3';
import { products } from './products';
import { categoryImages } from './categories';

export const productImages: Record<string, { src: string; alt: string }> = {
  'Polera Aurora': {
    src: '/img/products/8532638.jpg',
    alt: 'Polera Aurora, fotografía ilustrativa.',
  },
  'Polera Ágata': {
    src: '/img/products/8148576.jpg',
    alt: 'Polera Ágata, fotografía ilustrativa.',
  },
  'Polera Bruno': {
    src: '/img/products/7319172.jpg',
    alt: 'Polera Bruno, fotografía ilustrativa.',
  },
  'Polera Nómade': {
    src: '/img/products/9594692.jpg',
    alt: 'Polera Nómade, fotografía ilustrativa.',
  },
  'Polera Boreal': {
    src: '/img/products/2112648.jpg',
    alt: 'Polera Boreal, fotografía ilustrativa.',
  },
  'Polera Oceana': {
    src: '/img/products/10822396.jpg',
    alt: 'Polera Oceana, fotografía ilustrativa.',
  },
  'Pantalón Sonia': {
    src: '/img/products/14577586.jpg',
    alt: 'Pantalón Sonia, fotografía ilustrativa.',
  },
  'Pantalón Roble': {
    src: '/img/products/6046220.jpg',
    alt: 'Pantalón Roble, fotografía ilustrativa.',
  },
  'Pantalón Arena': {
    src: '/img/products/14577601.jpg',
    alt: 'Pantalón Arena, fotografía ilustrativa.',
  },
  'Polerón Inés': {
    src: '/img/products/9594694.jpg',
    alt: 'Polerón Inés, fotografía ilustrativa.',
  },
  'Polerón Austral': {
    src: '/img/products/9714441.jpg',
    alt: 'Polerón Austral, fotografía ilustrativa.',
  },
  'Zapatilla Raíz': {
    src: '/img/products/2529148.jpg',
    alt: 'Zapatilla Raíz, fotografía ilustrativa.',
  },
  'Tote Bag Lima': {
    src: '/img/products/4068314.jpg',
    alt: 'Tote Bag Lima, fotografía ilustrativa.',
  },
  'Granola Amanecer': {
    src: '/img/products/3872436.jpg',
    alt: 'Granola Amanecer, fotografía ilustrativa.',
  },
  'Miel Valle Dorado': {
    src: '/img/products/4480158.jpg',
    alt: 'Miel Valle Dorado, fotografía ilustrativa.',
  },
  'Té de Hierbas del Sur': {
    src: '/img/products/29872760.jpg',
    alt: 'Té de Hierbas del Sur, fotografía ilustrativa.',
  },
  'Mermelada Frutos del Bosque': {
    src: '/img/products/15209691.jpg',
    alt: 'Mermelada Frutos del Bosque, fotografía ilustrativa.',
  },
  'Mix de Frutos Secos Cordillera': {
    src: '/img/products/5507703.jpg',
    alt: 'Mix de Frutos Secos Cordillera, fotografía ilustrativa.',
  },
  'Café Tostado Horizonte': {
    src: '/img/products/29527502.jpg',
    alt: 'Café Tostado Horizonte, fotografía ilustrativa.',
  },
  'Jabón Botánico de Avena': {
    src: '/img/products/16244099.jpg',
    alt: 'Jabón Botánico de Avena, fotografía ilustrativa.',
  },
  'Shampoo Sólido Brisa': {
    src: '/img/products/7262414.jpg',
    alt: 'Shampoo Sólido Brisa, fotografía ilustrativa.',
  },
  'Bálsamo Labial Cacao': {
    src: '/img/products/35638285.jpg',
    alt: 'Bálsamo Labial Cacao, fotografía ilustrativa.',
  },
  'Cepillo Dental de Bambú': {
    src: '/img/products/5420478.jpg',
    alt: 'Cepillo Dental de Bambú, fotografía ilustrativa.',
  },
  'Crema de Manos Caléndula': {
    src: '/img/products/16678665.jpg',
    alt: 'Crema de Manos Caléndula, fotografía ilustrativa.',
  },
  'Esponja Vegetal Luffa': {
    src: '/img/products/5420584.jpg',
    alt: 'Esponja Vegetal Luffa, fotografía ilustrativa.',
  },
  'Kit Huerto Aromático': {
    src: '/img/products/31416071.jpg',
    alt: 'Kit Huerto Aromático, fotografía ilustrativa.',
  },
  'Macetero de Terracota Tierra': {
    src: '/img/products/17058191.jpg',
    alt: 'Macetero de Terracota Tierra, fotografía ilustrativa.',
  },
  'Semillas de Tomate Cherry': {
    src: '/img/products/7782901.jpg',
    alt: 'Semillas de Tomate Cherry, fotografía ilustrativa.',
  },
  'Compost para Jardín': {
    src: '/img/products/11924687.jpg',
    alt: 'Compost para Jardín, fotografía ilustrativa.',
  },
  'Regadera Brote': {
    src: '/img/products/9707349.jpg',
    alt: 'Regadera Brote, fotografía ilustrativa.',
  },
  'Pala de Jardín Roble': {
    src: '/img/products/9709229.jpg',
    alt: 'Pala de Jardín Roble, fotografía ilustrativa.',
  },
  'Limpiador Multiuso Cítrico': {
    src: '/img/products/4440523.jpg',
    alt: 'Limpiador Multiuso Cítrico, fotografía ilustrativa.',
  },
  'Detergente Lavanda': {
    src: '/img/products/10566510.jpg',
    alt: 'Detergente Lavanda, fotografía ilustrativa.',
  },
  'Cepillo para Loza Nativo': {
    src: '/img/products/5420583.jpg',
    alt: 'Cepillo para Loza Nativo, fotografía ilustrativa.',
  },
  'Paños Reutilizables Hogar': {
    src: '/img/products/10182867.jpg',
    alt: 'Paños Reutilizables Hogar, fotografía ilustrativa.',
  },
  'Jabón para Loza Sólido': {
    src: '/img/products/4194986.jpg',
    alt: 'Jabón para Loza Sólido, fotografía ilustrativa.',
  },
  'Bolsas para Separar Residuos': {
    src: '/img/products/4068314.jpg',
    alt: 'Bolsas para Separar Residuos, fotografía ilustrativa.',
  },
  'Vela Bosque Nativo': {
    src: '/img/products/7694724.jpg',
    alt: 'Vela Bosque Nativo, fotografía ilustrativa.',
  },
  'Difusor Bruma de Lavanda': {
    src: '/img/products/7795656.jpg',
    alt: 'Difusor Bruma de Lavanda, fotografía ilustrativa.',
  },
  'Saco de Semillas Calma': {
    src: '/img/products/23423806.jpg',
    alt: 'Saco de Semillas Calma, fotografía ilustrativa.',
  },
  'Incienso Jardín Sereno': {
    src: '/img/products/9904379.jpg',
    alt: 'Incienso Jardín Sereno, fotografía ilustrativa.',
  },
  'Almohadilla de Ojos Pausa': {
    src: '/img/products/17345336.jpg',
    alt: 'Almohadilla de Ojos Pausa, fotografía ilustrativa.',
  },
  'Spray Ambiental Cítrico': {
    src: '/img/products/6167873.jpg',
    alt: 'Spray Ambiental Cítrico, fotografía ilustrativa.',
  },
  'Juguete de Cuerda Compañero': {
    src: '/img/products/18478445.jpg',
    alt: 'Juguete de Cuerda Compañero, fotografía ilustrativa.',
  },
  'Plato Cerámico Huella': {
    src: '/img/products/8434635.jpg',
    alt: 'Plato Cerámico Huella, fotografía ilustrativa.',
  },
  'Cama Nido para Mascotas': {
    src: '/img/products/2248516.jpg',
    alt: 'Cama Nido para Mascotas, fotografía ilustrativa.',
  },
  'Collar Paseo Natural': {
    src: '/img/products/16621924.jpg',
    alt: 'Collar Paseo Natural, fotografía ilustrativa.',
  },
  'Rascador de Cartón Gato': {
    src: '/img/products/15487957.jpg',
    alt: 'Rascador de Cartón Gato, fotografía ilustrativa.',
  },
  'Dispensador de Bolsas Paseo': {
    src: '/img/products/25753346.jpg',
    alt: 'Dispensador de Bolsas Paseo, fotografía ilustrativa.',
  },
  'Jarrón Cerámico Tierra Viva': {
    src: '/img/products/8274442.jpg',
    alt: 'Jarrón Cerámico Tierra Viva, fotografía ilustrativa.',
  },
  'Canasto de Fibras Raíz': {
    src: '/img/products/7232501.jpg',
    alt: 'Canasto de Fibras Raíz, fotografía ilustrativa.',
  },
  'Bandeja de Madera Oficio Sur': {
    src: '/img/products/6633448.jpg',
    alt: 'Bandeja de Madera Oficio Sur, fotografía ilustrativa.',
  },
  'Colgante de Macramé Nudo': {
    src: '/img/products/9889439.jpg',
    alt: 'Colgante de Macramé Nudo, fotografía ilustrativa.',
  },
  'Taza Artesanal Amanecer': {
    src: '/img/products/9261415.jpg',
    alt: 'Taza Artesanal Amanecer, fotografía ilustrativa.',
  },
  'Funda de Cojín Trama': {
    src: '/img/products/15758184.jpg',
    alt: 'Funda de Cojín Trama, fotografía ilustrativa.',
  },
  ...Object.fromEntries(
    hitoProducts.map(({ name, image }) => [
      name,
      { src: hitoAsset(image + '.png'), alt: name },
    ]),
  ),
  'Bolsa reutilizable': {
    src: '/img/products/4068314.jpg',
    alt: 'Tote Bag Lima, fotografía ilustrativa.',
  },
};

// Fotografías ilustrativas ya disponibles para productos equivalentes del catálogo remoto.
const referencePhotoNames = new Map<string, string>([
  ['Miel de Ulmo Artesanal 500 g', 'Miel de Ulmo'],
  [
    'Mermelada de Maqui y Murtilla Silvestre 250 g',
    'Mermelada Frutos del Bosque',
  ],
  ['Pack Granola Andina Crujiente 300g 6u', 'Granola Amanecer'],
  ['Té Negro con Merkén y Cítricos 80 g', 'Té de Hierbas del Sur'],
  ['Crema Corporal de Caléndula 200 ml', 'Crema de Manos Caléndula'],
  ['Champú Sólido de Extracto de Ortiga y Romero 90 g', 'Shampoo Sólido Brisa'],
  [
    'Jabón Artesanal de Caléndula y Manzanilla 120 g',
    'Jabón Botánico de Avena',
  ],
  [
    'Bálsamo Labial Nutritivo de Cera de Abeja y Miel 15 g',
    'Bálsamo Labial Cacao',
  ],
  [
    'Sérum Facial Hidratante de Rosa Mosqueta y Vitamina E 30 ml',
    'Aceite de Jojoba',
  ],
  ['Kit de Hierbas Aromáticas', 'Kit Huerto Aromático'],
  ['Kit de Germinación de Brotes en Casa', 'Kit Hortalizas'],
  ['Abono Orgánico Bocashi', 'Compost para Jardín'],
  [
    'Macetero Colgante de Yute y Madera Reciclada',
    'Macetero de Terracota Tierra',
  ],
  [
    'Set de Herramientas de Jardinería Mini (Acero y Madera)',
    'Pala de Jardín Roble',
  ],
  [
    'Sustrato Preparado Sustentable para Macetas 5 Litros',
    'Compost para Jardín',
  ],
  ['Limpiador Multiuso Ecológico 500 ml', 'Limpiador Multiuso Cítrico'],
  ['Detergente Líquido Ecológico para Ropa 1 L', 'Detergente Lavanda'],
  [
    'Lavaloza Concentrado de Biodegradabilidad Rápida 500 ml',
    'Jabón para Loza Sólido',
  ],
  [
    'Esponjas Vegetales de Luffa Natural (Pack x 3 unidades)',
    'Esponja Vegetal Luffa',
  ],
  [
    'Paños Limpiadores de Celulosa y Algodón Reutilizables (Pack x 4)',
    'Paños Reutilizables Hogar',
  ],
  [
    'Cepillo de Limpieza Multiuso con Mango de Bambú y Cerdas de Coco',
    'Cepillo para Loza Nativo',
  ],
  ['Vela Cinnamon', 'Vela Bosque Nativo'],
  [
    'Bruma de Almohadas "Sueño Profundo" con Lavanda y Manzanilla',
    'Spray Ambiental Cítrico',
  ],
  [
    'Difusor de Ambientes en Vainilla y Maderas Nobles 250 ml',
    'Difusor Bruma de Lavanda',
  ],
  [
    'Aceite de Masaje Corporal Relajante de Lavanda y Almendras 150 ml',
    'Aceite de Jojoba',
  ],
  [
    'Juguete Textil de Cuerda y Algodón Orgánico',
    'Juguete de Cuerda Compañero',
  ],
  ['Cama Ortopédica Lavable de Telas Recicladas', 'Cama Nido para Mascotas'],
  ['Rascador de Cartón Prensado y Madera Reciclada', 'Rascador de Cartón Gato'],
  ['Comedero Doble de Cerámica y Soporte de Madera', 'Plato Cerámico Huella'],
  ['Cestería de Colihue y Fibras Naturales', 'Canasto de Fibras Raíz'],
  [
    'Tabla de Picar de Madera Nativa (Raulí y Mañío)',
    'Bandeja de Madera Oficio Sur',
  ],
  ['Jarrón de Cerámica Modelado a Mano', 'Jarrón Cerámico Tierra Viva'],
  ['Tapiz Mural Decorativo en Lana de Oveja', 'Colgante de Macramé Nudo'],
  ['Vinagre de Manzana Orgánico 500 ml', 'Miel Valle Dorado'],
  ['Exfoliante Corporal de Café y Cacao 250 g', 'Esponja Vegetal Luffa'],
  ['Rociador Pulidor de Follaje de Bronce y Vidrio 300 ml', 'Regadera Brote'],
  [
    'Limpiador desinfectante de Superficies a base de Vinagre y Eucalipto 750 ml',
    'Quita Manchas',
  ],
  [
    'Pastilla Limpiadora de Inodoros Ecológica (Pack x 2 unidades)',
    'Bolsas para Separar Residuos',
  ],
  [
    'Sales de Baño Desintoxicantes de Lavanda y Eucalipto 350 g',
    'Saco de Semillas Calma',
  ],
  [
    'Perfume Sólido Botánico de Vainilla y Sándalo 15 g',
    'Incienso Jardín Sereno',
  ],
  [
    'Cepillo Masajeador y Deslanador de Bambú y Dientes de Acero',
    'Collar Paseo Natural',
  ],
  ['Posavasos de Greda Pulida (Set de 4)', 'Taza Artesanal Amanecer'],
  [
    'Cuaderno Artesanal con Tapa de Madera y Papel Reciclado',
    'Funda de Cojín Trama',
  ],
]);

// Referencias ilustrativas generadas para el catálogo.
const generatedPhotoNames = new Map<string, string>([
  ['Crema Corporal de Caléndula 400 ml', 'crema-calendula'],
  ['Vela Vainilla', 'vela-vainilla'],
  ['Vela Lavanda', 'vela-lavanda'],
  ['Harina Tostada de Trigo Integral 500 g', 'harina-tostada'],
  [
    'Guantes de Jardinería con Refuerzo de Cuero Vegano y Algodón',
    'guantes-jardineria',
  ],
  ['Snack Natural de Salmón Deshidratado 80 g', 'snack-salmon'],
]);

const categoryPhotoReferences = new Set([
  'Desodorante Natural en Crema de Karité y Tea Tree 50 g',
  'Sustrato Preparado Sustentable para Macetas 5 Litros',
  'Juguete Pato',
  'Pantalla de Lámpara Artesanal de Mimbre',
]);

// El backend publica varios registros con el nombre Polera Trip.
const tripVariantReferences = new Map<number, string>([
  [42, 'Polera Aurora'],
  [43, 'Polera Ágata'],
  [44, 'Polera Bruno'],
  [45, 'Polera Nómade'],
  [46, 'Polera Boreal'],
  [47, 'Polera Oceana'],
]);

const photosByCategory = new Map<string, string[]>();

for (const { name, department } of products) {
  if (!Object.hasOwn(productImages, name)) continue;

  const names = photosByCategory.get(department) ?? [];

  names.push(name);

  photosByCategory.set(department, names);
}

export function findProductImage( name: string, category?: string, productId?: number, ) {

  const variant =
    name === 'Polera Trip' && productId !== undefined
      ? tripVariantReferences.get(productId)
      : undefined;
  const useCategoryPhoto =
    categoryPhotoReferences.has(name) ||
    (name === 'Polera Trip' && productId === 48);

  if (!variant && !useCategoryPhoto && Object.hasOwn(productImages, name))
    return productImages[name];

  const categoryPhoto =
    useCategoryPhoto && category ? categoryImages[category] : undefined;
  const candidates = category ? photosByCategory.get(category) : undefined;
  const fallback =
    candidates?.length && productId !== undefined
      ? candidates[productId % candidates.length]
      : undefined;
  const reference = variant ?? referencePhotoNames.get(name) ?? fallback;
  const generated = generatedPhotoNames.get(name);
  const src = generated
    ? '/img/products/' + generated + '-referencia.jpg'
    : (categoryPhoto ??
      (reference ? productImages[reference]?.src : undefined));

  if (src)
    return { src, alt: 'Fotografía ilustrativa para ' + name, reference: true };

  if (Object.hasOwn(productImages, name)) return productImages[name];
}
