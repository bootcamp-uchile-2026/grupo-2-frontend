import { ProductCard } from './ProductCard';
import { products } from '../data/products';

export function Featured({
  department = 'ropa-y-accesorios',
  exclude = '',
}: {
  department?: string;
  exclude?: string;
}) {

  return (
    <div className="product-row" id="featured-products">
      {products
        .filter((p) => p.department === department && p.name !== exclude)
        .slice(0, 4)
        .map((p) => (
          <ProductCard key={p.name} product={p} />
        ))}
    </div>
  );
}
