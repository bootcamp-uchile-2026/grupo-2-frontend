import { ProductImage } from '../components/ProductImage';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { products, money, variantOptions } from '../data/products';
import { useCart } from '../store/cart';
import { Featured } from '../components/Featured';
import { EmptyState } from '../components/EmptyState';
import { categories } from '../data/categories';

export function Product() {

  const [params] = useSearchParams(),
    navigate = useNavigate();
  const { cart, setCart, add, notify } = useCart();
  const { category = 'ropa-y-accesorios' } = useParams();
  const selectedCategory = categories.find((item) => item.id === category);
  const name = params.get('name') || 'Polera Aurora';
  const product = products.find((p) => p.name === name);
  const isClothing = category === 'ropa-y-accesorios';
  const colors = variantOptions(product?.color || 'Natural');
  const sizes = variantOptions(product?.size || 'Única');
  const price =
    product?.price || (name === 'Bolsa reutilizable' ? 8990 : 13990);
  const edit = params.has('edit') ? Number(params.get('edit')) : -1;
  const item = cart[edit]?.name === name ? cart[edit] : undefined;
  const initialColor =
    colors.find(
      (value) => value.toLowerCase() === item?.color?.toLowerCase(),
    ) || (colors.length === 1 ? colors[0] : '');
  const [color, setColor] = useState(initialColor),
    [size, setSize] = useState(
      sizes.find(
        (value) => value.toLowerCase() === item?.size?.toLowerCase(),
      ) || (sizes.length === 1 ? sizes[0] : ''),
    ),
    [qty, setQty] = useState(item?.qty || 1),
    [tab, setTab] = useState('valoraciones');

  function submit() {

    if (!color || !size) {
      notify(
        isClothing ? 'Selecciona color y talla' : 'Selecciona una presentación',
      );

      return;
    }

    if (item) {
      setCart(
        cart.map((p, i) => (i === edit ? { ...p, color, size, qty } : p)),
      );

      navigate('/carrito');
    } else add({ name, price, color, size }, qty);
  }

  if (
    (!product && name !== 'Bolsa reutilizable') ||
    (product && product.department !== category) ||
    !selectedCategory
  )
    return (
      <EmptyState
        title="Producto no encontrado"
        description="El producto que buscas no está disponible. Revisa nuestro catálogo para encontrar otra opción."
      />
    );

  return (
    <>
      <title>{name + ' | Buen Origen'}</title>
      <div className="breadcrumbs">
        <Link to="/">Home</Link> ›{' '}
        <Link to={`/productos/${category}`}>{selectedCategory?.name}</Link> ›{' '}
        <strong>{name}</strong>
      </div>
      <main className="product-view">
        <section className="product-main">
          <div className="gallery">
            <div className="thumbs">
              <div className="thumb active">
                <ProductImage name={name} />
              </div>
            </div>
            <ProductImage
              key={name}
              name={name}
              className="main-image"
              priority
            />
          </div>
          <div className="product-info">
            <h1 className="product-name">{name}</h1>
            <div className="price">{money(price)}</div>
            <p className="product-description">
              {product?.description ||
                'Bolsa reutilizable para acompañar tus compras cotidianas.'}
            </p>
            <div className="product-options">
              <label>
                <span>{isClothing ? 'COLOR' : 'ACABADO'}</span>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {colors.map((v) => (
                    <option key={v} value={v}>
                      {isClothing && v.length <= 2
                        ? v.toUpperCase()
                        : v[0].toUpperCase() + v.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{isClothing ? 'TALLA' : 'PRESENTACIÓN'}</span>
                <select value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="">Selecciona una opción</option>
                  {sizes.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="quantity">
              <button
                aria-label="Disminuir cantidad"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button
                aria-label="Aumentar cantidad"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
            <br />
            <button className="btn add-product" onClick={submit}>
              {item ? 'Actualizar carrito' : 'Agregar a carrito'}
            </button>
            {!item && (
              <button
                className="btn buy-now"
                onClick={() => {

                  submit();

                  if (color && size) navigate('/carrito');
                }}
              >
                Comprar ahora
              </button>
            )}
            <aside
              className="product-green-points"
              aria-label="Puntos Verdes por esta compra"
            >
              <strong>{Math.floor(price / 100)} pts</strong>
              <small>♧ Puntos Verdes</small>
              <p>{product?.footprint || 'Reutilización · Menos residuos'}</p>
            </aside>
          </div>
        </section>
        <section className="tabs">
          <div className="tab-list">
            {['materiales', 'elaboracion', 'valoraciones'].map((t) => (
              <button
                key={t}
                className={`tab${tab === t ? ' active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'elaboracion'
                  ? 'Elaboración'
                  : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-panel" hidden={tab !== 'materiales'}>
            <h2>Materiales conscientes</h2>
            <p>
              {product
                ? `Material principal: ${product.material}. Presentación: ${product.size}.`
                : 'Diseño pensado para reutilizar.'}
            </p>
          </div>
          <div className="tab-panel" hidden={tab !== 'elaboracion'}>
            <h2>Elaboración</h2>
            <p>
              {product?.production ||
                'Producto reutilizable para el uso cotidiano.'}
            </p>
          </div>
          <div className="tab-panel" hidden={tab !== 'valoraciones'}>
            <div className="rating-content">
              <div>
                <div className="rating-score">4.5</div>
                <div
                  className="stars"
                  style={{ textAlign: 'center', fontSize: 28 }}
                >
                  ★★★★☆
                </div>
                <p>Calificación sustentable</p>
              </div>
              <div>
                {[
                  isClothing
                    ? 'Muy cómoda y con excelente terminación. La información de impacto es clara.'
                    : 'Buena calidad y presentación. El producto cumple con lo que esperaba.',
                  isClothing
                    ? 'El calce es preciso y el material se siente durable y agradable.'
                    : 'Buena presentación y muy práctico para el uso cotidiano.',
                ].map((text) => (
                  <article className="review-item" key={text}>
                    <div className="avatar">●</div>
                    <p>{text}</p>
                    <div className="stars">★★★★★</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="section related">
          <h2 className="section-title">Productos relacionados</h2>
          <Featured department={category} exclude={name} />
        </section>
      </main>
    </>
  );
}
