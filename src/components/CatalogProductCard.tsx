import { ProductImage } from './ProductImage';
import { HeaderIcon } from './Header/HeaderIcon';
import { money } from '../data/products';
import type { ApiProduct } from '../api/client';
import { useCart } from '../store/cart';

// Tarjeta para productos de GET /products (ProductSummaryDto).
export function CatalogProductCard({ product }: { product: ApiProduct }) {

  const { add } = useCart();
  const stars = product.rating === null ? null : Math.round(product.rating);
  const onSale =
    product.offerPrice !== null && product.finalPrice < product.price;

  return (
    <article className="catalog-product shop-card">
      <div className="card-summary">
        <ProductImage name={product.name} />
        <h2>{product.name}</h2>
        <p className="card-description">{product.producerName}</p>
        <p className="card-price">
          {money(product.finalPrice)}
          {onSale && (
            <>
              {' '}
              <del className="card-price-before">
                {money(product.price)}
              </del>{' '}
              <span className="card-discount">
                -{product.discountPercentage}%
              </span>
            </>
          )}
        </p>
      </div>
      <div className="card-bottom">
        {stars === null ? (
          <small>Sin valoraciones</small>
        ) : (
          <>
            <span className="stars" aria-label={`${stars} de 5 estrellas`}>
              {'★'.repeat(stars) + '☆'.repeat(5 - stars)}
            </span>
            <small>({product.reviewCount})</small>
          </>
        )}
        <button
          className="quick-add"
          aria-label={
            product.available
              ? `Agregar ${product.name} al carrito`
              : `${product.name} sin stock`
          }
          disabled={!product.available}
          onClick={() => add({
              name: product.name,
              price: product.finalPrice,
              size: 'Única',
              color: 'Única',
            })
          }
        >
          <HeaderIcon name="cart" />
        </button>
      </div>
    </article>
  );
}
