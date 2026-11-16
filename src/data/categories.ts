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
  alimentos: '/img/figma/categories-imgFrame1415.png',
  'cuidado-personal': '/img/figma/categories-imgFrame1416.png',
  'huerto-y-jardineria': '/img/figma/categories-imgFrame1417.png',
  'limpieza-del-hogar': '/img/figma/categories-imgFrame1418.png',
  'aromas-y-bienestar': '/img/figma/categories-imgFrame1419.png',
  'ropa-y-accesorios': '/img/figma/categories-imgFrame1420.png',
  mascotas: '/img/figma/categories-imgFrame1421.png',
  'decoracion-y-artesania': '/img/figma/categories-imgFrame1422.png',
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
