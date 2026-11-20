import { BannerImage } from '../components/BannerImage';
import { GreenFootprint } from '../components/GreenFootprint';
import { findHitoProduct, hitoAsset, sustainabilityGroups } from '../data/hito3';
import { ProductImage } from '../components/ProductImage';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { products, localProductName, money, productAttributes, variantOptions } from '../data/products';
import { useCart } from '../store/cart';
import { Featured } from '../components/Featured';
import { EmptyState } from '../components/EmptyState';
import { categories, productCategorySlugs } from '../data/categories';
import { getAllProducts } from '../api/client';
import type { ApiProduct } from '../api/client';

export function Product() {

  const [params] = useSearchParams();
  const { category } = useParams();
  const name = params.get('name') || 'Polera Aurora';
  const id = params.get('id');

  return id === null ? (
    <ProductView key={category + '/' + name} />
  ) : (
    <CatalogProductView
      key={category + '/' + name + '/' + id}
      id={Number(id)}
      name={name}
      category={category}
    />
  );
}

function CatalogProductView({ id, name, category, }: { id: number; name: string; category?: string; }) {

  const [product, setProduct] = useState<ApiProduct | null>();
  const [error, setError] = useState('');

  useEffect(() => {

    const controller = new AbortController();

    getAllProducts({ search: name }, controller.signal)
      .then((products) => {

        if (controller.signal.aborted) return;

        setProduct(
          products.find(
            (entry) => entry.id === id &&
              productCategorySlugs[entry.categoryId] === category,
          ) ?? null,
        );
      })
      .catch((cause) => {

        if (!controller.signal.aborted) setError(cause.message);
      });

    return () => controller.abort();
  }, [id, name, category]);

  if (error)
    return (
      <main className="product-view">
        <p role="alert">{error}</p>
      </main>
    );

  if (product === undefined)
    return (
      <main className="product-view">
        <p role="status">Cargando producto…</p>
      </main>
    );

  if (!product)
    return (
      <EmptyState
        title="Producto no encontrado"
        description="Este producto ya no aparece en el catálogo."
      />
    );

  return <ProductView remote={product} />;
}

function ProductView({ remote }: { remote?: ApiProduct }) {

  const [params] = useSearchParams(),
    navigate = useNavigate();
  const cart = useCart((state) => state.cart);
  const setCart = useCart((state) => state.setCart);
  const add = useCart((state) => state.add);
  const notify = useCart((state) => state.notify);
  const { category = 'ropa-y-accesorios' } = useParams();
  const selectedCategory = categories.find((item) => item.id === category);
  const name = remote?.name ?? (params.get('name') || 'Polera Aurora');
  const localName = localProductName(name);
  const product = products.find((p) => p.name === localName);
  const details = findHitoProduct(localName);
  const productTags = productAttributes(localName, remote?.attributes);
  const montana = details?.image === 'montana';
  const available = remote?.available ?? details?.available ?? true;
  const rating = remote ? remote.rating : (details?.rating ?? 4.5);
  const discount = remote?.discountPercentage ?? product?.discount;
  const gallery = montana
    ? [1, 2, 3, 4].map((index) => hitoAsset(`montana-${index}.png`))
    : [];
  const [photo, setPhoto] = useState<string>();

  const isClothing = category === 'ropa-y-accesorios';
  const colors = variantOptions(product?.color || 'Natural');
  const sizes = variantOptions(product?.size || 'Única');
  const price =
    remote?.finalPrice ??
    product?.price ??
    (name === 'Bolsa reutilizable' ? 8990 : 13990);
  const edit = params.has('edit') ? Number(params.get('edit')) : -1;
  const item =
    cart[edit]?.name === name && cart[edit]?.productId === remote?.id
      ? cart[edit]
      : undefined;
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

    if (!available) return;

    if (!color || !size) {
      notify(
        isClothing ? 'Selecciona color y talla' : 'Selecciona una presentación',
      );

      return;
    }

    if (item) {
      setCart((current) => current.map((p, i) => (i === edit ? { ...p, color, size, qty } : p)),
      );

      navigate('/carrito');
    } else
      add(
        {
          name,
          productId: remote?.id,
          price,
          color,
          size,
          co2Avoided: remote?.co2Avoided ?? details?.co2Avoided,
          greenPoints: remote?.greenPoints ?? details?.greenPoints,
        },
        qty,
      );
  }

  if (
    (!remote &&
      ((!product && name !== 'Bolsa reutilizable') ||
        (product && product.department !== category))) ||
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
      {montana && (
        <div className="category-hero hito-product-banner">
          <BannerImage category={category} />
          <Link className="btn" to={`/productos/${category}`}>
            Ver colección
          </Link>
        </div>
      )}
      <main className="product-view">
        <section className="product-main">
          <div className="gallery">
            <div className="thumbs">
              {montana &&
                [hitoAsset('montana.png'), ...gallery].map((image, i) => (
                  <button
                    key={image}
                    type="button"
                    className="thumb"
                    aria-label={`Ver foto ${i + 1} de ${name}`}
                    aria-pressed={(photo ?? hitoAsset('montana.png')) === image}
                    onClick={() => setPhoto(image)}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
            </div>
            <ProductImage
              key={photo ?? name}
              source={photo}
              category={remote ? category : undefined}
              productId={remote?.id}
              name={name}
              className={montana ? 'main-image hito-montana' : 'main-image'}
              priority
            />
          </div>
          <div className="product-info">
            <h1 className="product-name">{name}</h1>
            <div className="price">
              {money(price)}{' '}
              {!!discount && (
                <span className="card-discount">−{discount}%</span>
              )}
            </div>
            <p className="product-description">
              {product?.description ||
                (remote
                  ? remote.producerName
                  : 'Bolsa reutilizable para acompañar tus compras cotidianas.')}
            </p>
            {productTags.length > 0 && (
              <dl
                className="hito-attribute-groups"
                aria-label="Atributos sustentables"
              >
                {Object.entries(sustainabilityGroups).map(
                  ([group, attributes]) => {

                    const included = attributes.filter((attribute) => productTags.includes(attribute),
                    );

                    if (!included.length) return null;

                    return (
                      <div key={group}>
                        <dt>{group}</dt>
                        <dd>
                          <ul className="hito-attributes">
                            {included.map((attribute) => (
                              <li key={attribute}>{attribute}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    );
                  },
                )}
              </dl>
            )}
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
            <button
              className="btn add-product"
              disabled={!available}
              onClick={submit}
            >
              {!available
                ? 'Producto no disponible'
                : item
                  ? 'Actualizar carrito'
                  : 'Agregar a carrito'}
            </button>
            {!item && available && (
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
            <GreenFootprint
              items={[
                {
                  name,
                  price,
                  color,
                  size,
                  qty,
                  co2Avoided: remote?.co2Avoided,
                  greenPoints: remote?.greenPoints,
                },
              ]}
            />
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
                : remote
                  ? 'Información de materiales no disponible.'
                  : 'Diseño pensado para reutilizar.'}
            </p>
          </div>
          <div className="tab-panel" hidden={tab !== 'elaboracion'}>
            <h2>Elaboración</h2>
            <p>
              {product?.production ||
                (remote
                  ? 'Información de elaboración no disponible.'
                  : 'Producto reutilizable para el uso cotidiano.')}
            </p>
          </div>
          <div className="tab-panel" hidden={tab !== 'valoraciones'}>
            <div className="rating-content">
              <div>
                <div className="rating-score">
                  {rating ?? 'Sin valoraciones'}
                </div>
                <div
                  className="stars"
                  style={{ textAlign: 'center', fontSize: 28 }}
                >
                  {rating !== null &&
                    '★'.repeat(Math.floor(rating)) +
                      '☆'.repeat(5 - Math.floor(rating))}
                </div>
                <p>Calificación sustentable</p>
              </div>
              <div>
                {!remote &&
                  (!details || montana) &&
                  [
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
