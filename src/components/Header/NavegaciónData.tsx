import { categories } from '../../data/categories';

export const SubCategorias = categories.map((category, index) => ({
  id: index + 1,
  name: category.name,
  link: '/productos/' + category.id,
}));
