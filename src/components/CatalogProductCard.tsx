import { ShopCard } from './ProductCard';
import { productAttributes, products, quickSelection } from '../data/products';
import type { ApiProduct } from '../api/client';

export function CatalogProductCard({ product }: { product: ApiProduct }) {

  const local = products.find(({ name }) => name === product.name);
  const selection = local
    ? quickSelection(local)
    : { size: 'Única', color: 'Único' };

  return (
    <ShopCard
      name={product.name}
      price={product.finalPrice}
      rating={product.rating}
      available={product.available}
      discount={product.discountPercentage}
      attributes={productAttributes(product.name, product.attributes)}
      selection={{
        name: product.name,
        size: selection.size,
        color: selection.color,
        price: product.finalPrice,
        co2Avoided: product.co2Avoided,
        greenPoints: product.greenPoints,
      }}
    />
  );
}
