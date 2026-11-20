import { Link } from 'react-router-dom';
import { ProductImage } from './ProductImage';
import { findHitoProduct, hitoAsset, sustainabilityGroups } from '../data/hito3';
import { localProductName, money, productAttributes, productUrl, quickSelection } from '../data/products';
import type { Product } from '../data/products';
import { useCart } from '../store/cart';
import type { CartItem } from '../store/cart';
import { useFavorites } from '../store/favorites';

const attributeIcons: Record<string, string> = {
  Orgánico: 'organic',
  Reciclado: 'recycle',
  Biodegradable: 'recycle',
  Vegano: 'vegan',
  'Comercio justo': 'fair-trade',
  'Producción local': 'leaf',
  'Envase reciclable': 'recycle',
};

const groupTones = {
  Ambiental: 'green',
  Composición: 'peach',
  'Ético y productivo': 'cream',
} as const;

const attributeGroups = new Map(
  Object.entries(sustainabilityGroups).flatMap(([group, labels]) => labels.map(
      (label) => [label, group as keyof typeof sustainabilityGroups] as const,
    ),
  ),
);

type CardProps = {
  name: string;
  price: number;
  href?: string;
  category?: string;
  available: boolean;
  rating: number | null;
  discount?: number;
  attributes?: string[];
  selection: Omit<CartItem, 'qty'>;
};

export function ShopCard({ name, price, href = productUrl({ name }), category, available, rating, discount, attributes = [], selection, }: CardProps) {

  const add = useCart((state) => state.add);
  const favorite = useFavorites((state) => state.names.includes(name));
  const toggle = useFavorites((state) => state.toggle);
  const badges = attributes
    .filter((attribute) => attributeGroups.has(attribute))
    .slice(0, 2);
  const stars = Math.max(0, Math.min(5, Math.round(rating ?? 0)));

  return (
    <article className="catalog-product shop-card hito-card">
      <div
        className={`hito-card-media${category || !findHitoProduct(localProductName(name)) ? ' hito-card-photo' : ''}`}
      >
        <Link to={href} aria-label={name}>
          <ProductImage
            name={name}
            category={category}
            productId={selection.productId}
          />
        </Link>
        <button
          type="button"
          className="favorite-toggle"
          aria-label={`Guardar ${name} en favoritos`}
          aria-pressed={favorite}
          onClick={() => toggle(name)}
        >
          <img src={hitoAsset('heart.svg')} alt="" />
        </button>
        <button
          type="button"
          className="quick-add"
          disabled={!available}
          aria-label={`Agregar ${name} al carrito`}
          onClick={() => add(selection)}
        >
          <img src={hitoAsset('cart-add.svg')} alt="" />
        </button>
      </div>
      <div className="hito-card-heading">
        <h2>
          <Link to={href}>{name}</Link>
        </h2>
        {rating !== null && (
          <span
            className="hito-stars"
            role="img"
            aria-label={`${rating} de 5 estrellas`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <img
                key={i}
                src={hitoAsset(i < stars ? 'star.svg' : 'star-empty.svg')}
                alt=""
              />
            ))}
          </span>
        )}
      </div>
      <p className="card-price">
        {money(price)}
        {!!discount && <span className="card-discount">−{discount}%</span>}
      </p>
      {badges.length > 0 && (
        <ul className="hito-attributes" aria-label="Atributos sustentables">
          {badges.map((label) => {

            const group = attributeGroups.get(label);
            const icon = attributeIcons[label];

            return (
              <li key={label} className={group && groupTones[group]}>
                {icon && <img src={hitoAsset(icon + '.svg')} alt="" />}
                <span>
                  <strong>{label}</strong>
                  <small>{group}</small>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {!available && (
        <p className="hito-stock">
          <img src={hitoAsset('unavailable.svg')} alt="" />
          Producto no disponible
        </p>
      )}
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {

  const details = findHitoProduct(product.name);

  return (
    <ShopCard
      name={product.name}
      price={product.price}
      available={details?.available ?? true}
      rating={details?.rating ?? null}
      discount={product.discount}
      attributes={productAttributes(product.name)}
      selection={quickSelection(product)}
    />
  );
}
