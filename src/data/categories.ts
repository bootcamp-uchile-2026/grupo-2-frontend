export const categories = [
  { id: 'alimentos', name: 'Alimentos', icon: 'apple' },
  { id: 'cuidado-personal', name: 'Cuidado personal', icon: 'bottle' },
  { id: 'huerto-y-jardineria', name: 'Huerto y jardinería', icon: 'plant' },
  { id: 'limpieza-del-hogar', name: 'Limpieza del hogar', icon: 'clean' },
  { id: 'aromas-y-bienestar', name: 'Aromas y bienestar', icon: 'candle' },
  { id: 'ropa-y-accesorios', name: 'Ropa y accesorios', icon: 'shirt' },
  { id: 'mascotas', name: 'Mascotas', icon: 'paw' },
  {
    id: 'decoracion-y-artesania',
    name: 'Decoración y artesanía',
    icon: 'vase',
  },
];
export const clothingPath = '/productos/ropa-y-accesorios';

// Imágenes de las tarjetas de categoría del Home, por slug.
export const categoryImages: Record<string, string> = {
  alimentos: '/img/hito3/category-alimentos.png',
  'cuidado-personal': '/img/hito3/category-cuidado-personal.png',
  'huerto-y-jardineria': '/img/hito3/category-huerto-y-jardineria.png',
  'limpieza-del-hogar': '/img/hito3/category-limpieza-del-hogar.png',
  'aromas-y-bienestar': '/img/hito3/category-aromas-y-bienestar.png',
  'ropa-y-accesorios': '/img/hito3/category-ropa-y-accesorios.png',
  mascotas: '/img/hito3/category-mascotas.png',
  'decoracion-y-artesania': '/img/hito3/category-decoracion-y-artesania.png',
};

// Nombres del backend cuyo slug no coincide con las rutas existentes del frontend.
const slugAliases: Record<string, string> = {
  'huerto-y-jardin': 'huerto-y-jardineria',
};

// El backend identifica las categorías con ids numéricos; las rutas usan un slug derivado del nombre.
export function categorySlug(name: string) {

  const slug = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return slugAliases[slug] ?? slug;
}
