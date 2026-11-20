import { GreenFootprint } from '../components/GreenFootprint';
import { hitoAsset } from '../data/hito3';
import { CartOptions } from '../components/CartOptions';
import { ProductImage } from '../components/ProductImage';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { money, productLabels, products } from '../data/products';
import { readItems, selectCartTotal, useCart } from '../store/cart';
import { useAccount } from '../store/account';
import { Steps } from '../components/Steps';
import { EmptyIllustration } from '../components/EmptyIllustration';
import type { CartItem } from '../store/cart';

export function Cart({ openAuth }: { openAuth: () => void }) {

  const cart = useCart((state) => state.cart);
  const setCart = useCart((state) => state.setCart);
  const total = useCart(selectCartTotal);
  const notify = useCart((state) => state.notify);
  const add = useCart((state) => state.add);
  const { user } = useAccount();
  const [saved, setSaved] = useState(() => readItems('eco-saved'));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function updateSaved(items: CartItem[]) {

    localStorage.setItem('eco-saved', JSON.stringify(items));

    setSaved(items);
  }

  function save(index: number) {

    const item = cart[index];

    updateSaved([...saved, item]);

    setCart((current) => current.filter((_, i) => i !== index));

    notify(`${item.name} se guardó para después`);
  }

  function pay() {

    if (!cart.length) {
      setError('Tu carrito está vacío. Agrega un producto para continuar.');

      return;
    }

    if (
      cart.some(
        (item) => item.size === 'Por elegir' || item.color === 'Por elegir',
      )
    ) {
      setError(
        'Antes de pagar, vuelve a la ficha del producto para seleccionar talla y color.',
      );

      return;
    }

    setError('');

    if (user) navigate('/checkout');
    else openAuth();
  }

  return (
    <>
      {cart.length > 0 && (
        <div className="breadcrumbs">
          <Link to="/">Home</Link> › Carrito
        </div>
      )}
      {cart.length > 0 && <Steps active={0} />}
      <main className="cart-page">
        {cart.length ? (
          <>
            <h1>Tu carrito</h1>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div id="cart-lines">
              {cart.map((p, i) => (
                <article className="cart-line" key={`${p.name}-${i}`}>
                  <ProductImage
                    name={p.name}
                    source={
                      p.name === 'Polerón Montana'
                        ? hitoAsset('montana-cart.png')
                        : undefined
                    }
                  />
                  <div className="cart-line-info">
                    <h3>{p.name}</h3>
                    <p>
                      {
                        products.find(({ name }) => name === p.name)
                          ?.description
                      }
                    </p>
                    <CartOptions index={i} />
                    <p>{money(p.price)}</p>
                    <div className="cart-item-actions">
                      <button
                        type="button"
                        className="favorite-toggle"
                        aria-label="Guardar para después"
                        onClick={() => save(i)}
                      >
                        <img src={hitoAsset('heart.svg')} alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="quantity">
                    <button
                      aria-label={`Disminuir cantidad de ${p.name}`}
                      onClick={() => setCart((current) => current.map((x, index) => index === i
                              ? { ...x, qty: Math.max(1, x.qty - 1) }
                              : x,
                          ),
                        )
                      }
                    >
                      −
                    </button>
                    <span>{p.qty}</span>
                    <button
                      aria-label={`Aumentar cantidad de ${p.name}`}
                      onClick={() => setCart((current) => current.map((x, index) => index === i ? { ...x, qty: x.qty + 1 } : x,
                          ),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <strong className="line-total">
                    {money(p.price * p.qty)}
                  </strong>
                  <button
                    className="remove"
                    aria-label={`Eliminar ${p.name}`}
                    onClick={() => {

                      setCart((current) => current.filter((_, index) => index !== i),
                      );

                      notify(`${p.name} se eliminó del carrito`);
                    }}
                  >
                    <img src={hitoAsset('trash.svg')} alt="" />
                  </button>
                </article>
              ))}
            </div>
            <div className="subtotal">
              Subtotal: <strong>{money(total)}</strong>
            </div>
            <div className="cart-bottom">
              <GreenFootprint items={cart} />
              <div className="cart-buttons">
                <Link className="btn outline" to="/productos">
                  Seguir comprando
                </Link>
                <button className="btn checkout-trigger" onClick={pay}>
                  Ir a pagar
                </button>
              </div>
            </div>
          </>
        ) : (
          <section className="ux-empty cart-empty">
            <EmptyIllustration cart />
            <h1>Ups...Tu carrito está vacío</h1>
            <Link className="btn" to="/productos/ropa-y-accesorios">
              Seguir comprando <span aria-hidden="true">🛒</span>
            </Link>
          </section>
        )}
        {(cart.length > 0 || saved.length > 0) && (
          <section className="saved-products" id="guardados">
            <h2>Guardados para después</h2>
            {saved.length ? (
              saved.map((item, i) => (
                <article className="panel saved-item" key={i}>
                  <ProductImage name={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {productLabels(item).size}: {item.size} ·{' '}
                      {productLabels(item).color}: {item.color}
                    </p>
                    <strong>{money(item.price)}</strong>
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn"
                      onClick={() => {

                        add(item, item.qty);

                        updateSaved(saved.filter((_, index) => index !== i));
                      }}
                    >
                      Volver al carrito
                    </button>
                    <button
                      className="btn outline"
                      onClick={() => updateSaved(saved.filter((_, index) => index !== i))
                      }
                      aria-label={`Eliminar ${item.name} de guardados`}
                    >
                      <img src={hitoAsset('trash.svg')} alt="" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p>Los productos que guardes para después aparecerán aquí.</p>
            )}
          </section>
        )}
      </main>
    </>
  );
}
