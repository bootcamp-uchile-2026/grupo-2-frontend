import { ShopCard } from './ProductCard';
import { localProductName, productAttributes, productUrl, products, quickSelection } from '../data/products';
import { productCategorySlugs } from '../data/categories';
import type { ApiProduct } from '../api/client';

export function CatalogProductCard({ product }: { product: ApiProduct }) {

  const category = productCategorySlugs[product.categoryId];
  const localName = localProductName(product.name);
  const local = products.find(({ name }) => name === localName);
  const selection = local
    ? quickSelection(local)
    : { size: 'Única', color: 'Único' };

  return (
    <ShopCard
      name={product.name}
      category={category}
      href={productUrl({
        name: product.name,
        department: category,
        productId: product.id,
      })}
      price={product.finalPrice}
      rating={product.rating}
      available={product.available}
      discount={product.discountPercentage}
      attributes={productAttributes(localName, product.attributes)}
      selection={{
        name: product.name,
        productId: product.id,
        size: selection.size,
        color: selection.color,
        price: product.finalPrice,
        co2Avoided: product.co2Avoided,
        greenPoints: product.greenPoints,
      }}
    />
  );
}
