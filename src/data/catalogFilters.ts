import { categorySlug } from './categories';
import { products, variantOptions } from './products';

export const sorts = {
  featured: 'Productos destacados',
  asc: 'Precio menor a mayor',
  desc: 'Precio mayor a menor',
  new: 'Productos más recientes',
};

export type Filters = {
  type: string;
  available: boolean;
  offers: boolean;
  attributes: string[];
  maxPrice: number;
  sort: keyof typeof sorts;
  gender: string;
  size: string;
  colors: string[];
  material: string;
};

export const defaultFilters: Filters = {
  type: '',
  available: false,
  offers: false,
  attributes: [],
  maxPrice: 80000,
  sort: 'featured',
  gender: '',
  size: '',
  colors: [],
  material: '',
};

function normalize(value: string) {

  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function matchesVariants(name: string, filters: Filters) {

  const product = products.find((entry) => entry.name === name);

  return (
    (!filters.type ||
      (product && categorySlug(product.category) === filters.type)) &&
    (!filters.gender ||
      normalize(product?.gender ?? '') === normalize(filters.gender)) &&
    (!filters.size ||
      variantOptions(product?.size ?? '').some(
        (size) => normalize(size) === normalize(filters.size),
      )) &&
    (!filters.colors.length ||
      filters.colors.some((color) => variantOptions(product?.color ?? '').some(
          (option) => normalize(option) === normalize(color),
        ),
      )) &&
    (!filters.material ||
      normalize(product?.material ?? '').includes(normalize(filters.material)))
  );
}

export function filterOptions(category: string, type: string) {

  const matching = products.filter(
    (product) => product.department === category &&
      categorySlug(product.category) === type,
  );

  function options(key: 'gender' | 'size' | 'color' | 'material') {

    const values = matching.flatMap((product) => variantOptions(product[key]));
    const unique = new Map(values.map((value) => [normalize(value), value]));

    return Array.from(unique.values());
  }

  return {
    gender: options('gender'),
    size: options('size'),
    colors: options('color'),
    material: options('material'),
  };
}

const typeLabels: Record<string, string> = {
  alimentacion: 'Alimentación',
  ceramica: 'Cerámica',
  cesteria: 'Cestería',
  lavanderia: 'Lavandería',
  organizacion: 'Organización',
  relajacion: 'Relajación',
};

function productTypeLabel(type: string) {

  return (
    typeLabels[categorySlug(type)] ??
    type.charAt(0).toUpperCase() + type.slice(1)
  );
}

export function productTypesFor(category: string) {

  return new Map(
    products
      .filter((product) => product.department === category)
      .map(({ category: type }) => [
        categorySlug(type),
        productTypeLabel(type),
      ]),
  );
}
