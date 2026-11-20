export const categories = [
  { id: 'alimentos', apiId: 1, name: 'Alimentos', icon: 'apple' },
  {
    id: 'cuidado-personal',
    apiId: 2,
    name: 'Cuidado personal',
    icon: 'bottle',
  },
  {
    id: 'huerto-y-jardineria',
    apiId: 3,
    name: 'Huerto y jardinería',
    icon: 'plant',
  },
  {
    id: 'limpieza-del-hogar',
    apiId: 4,
    name: 'Limpieza del hogar',
    icon: 'clean',
  },
  {
    id: 'aromas-y-bienestar',
    apiId: 5,
    name: 'Aromas y bienestar',
    icon: 'candle',
  },
  {
    id: 'ropa-y-accesorios',
    apiId: 6,
    name: 'Ropa y accesorios',
    icon: 'shirt',
  },
  { id: 'mascotas', apiId: 7, name: 'Mascotas', icon: 'paw' },
  {
    id: 'decoracion-y-artesania',
    apiId: 8,
    name: 'Decoración y artesanía',
    icon: 'vase',
  },
];
export const productCategorySlugs: Record<number, string> = Object.fromEntries(
  categories.map(({ apiId, id }) => [apiId, id]),
);

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
