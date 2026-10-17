import { Link } from 'react-router-dom';
import { ProductImage } from './ProductImage';
import { HeaderIcon } from './Header/HeaderIcon';
import { money, productUrl, quickSelection } from '../data/products';
import type { products } from '../data/products';
import { useCart } from '../store/cart';

export function ProductCard({ product, }: { product: (typeof products)[number]; }) {

  const { add } = useCart();

  return (
    <article className="catalog-product shop-card">
      <Link to={productUrl(product)}>
        <ProductImage name={product.name} />
        <h2>{product.name}</h2>
        <p className="card-description">{product.description}</p>
        <p className="card-price">{money(product.price)}</p>
      </Link>
      <div className="card-bottom">
        <span className="stars" aria-label="4 de 5 estrellas">
          ★★★★☆
        </span>
        <small>(20)</small>
        <button
          className="quick-add"
          aria-label={`Agregar ${product.name} al carrito`}
          onClick={() => add(quickSelection(product))}
        >
          <HeaderIcon name="cart" />
        </button>
      </div>
    </article>
  );
}
