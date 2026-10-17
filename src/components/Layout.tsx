import { CartOptions } from './CartOptions';
import { ProductImage } from './ProductImage';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header/Header';
import { Footer } from './Footer';
import { useCart } from '../store/cart';
import { money, products, quickSelection } from '../data/products';
import { AuthForm } from './AuthForm';
import { Modal } from './Modal';
import { WelcomeBanner } from './WelcomeBanner';

export function Layout({ layer, setLayer, }: { layer: string; setLayer: (layer: string) => void; }) {

  const { cart, setCart, count, add, message, notify } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const showToast = message && !(isHome && message.startsWith('¡Bienvenida'));

  useEffect(() => {

    setLayer('');

    document.body.classList.toggle('home-page', location.pathname === '/');

    if (location.hash)
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    else window.scrollTo(0, 0);
  }, [location, setLayer]);

  return (
    <>
      <div className="site">
        <Header openCart={() => setLayer('cart')} />
        <Outlet />
        <Footer />
      </div>
      {isHome && !location.hash && <WelcomeBanner key={location.key} />}
      {layer === 'cart' && (
        <Modal title={`Tu carrito (${count})`} onClose={() => setLayer('')}>
          <div className="drawer-content">
            {cart.length ? (
              cart.map((p, i) => (
                <article className="drawer-item" key={i}>
                  <ProductImage name={p.name} />
                  <div>
                    <strong>{p.name}</strong>
                    <p>Producto sustentable de producción local.</p>
                    <CartOptions index={i} />
                    <div className="drawer-item-controls">
                      <strong>{money(p.price * p.qty)}</strong>
                      <div className="quantity">
                        <button
                          aria-label={'Disminuir cantidad de ' + p.name}
                          disabled={p.qty <= 1}
                          onClick={() => setCart(
                              cart.map((item, index) => index === i
                                  ? { ...item, qty: Math.max(1, item.qty - 1) }
                                  : item,
                              ),
                            )
                          }
                        >
                          −
                        </button>
                        <span>{p.qty}</span>
                        <button
                          aria-label={'Aumentar cantidad de ' + p.name}
                          onClick={() => setCart(
                              cart.map((item, index) => index === i
                                  ? { ...item, qty: item.qty + 1 }
                                  : item,
                              ),
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-link"
                        aria-label={'Eliminar ' + p.name}
                        onClick={() => {

                          setCart(cart.filter((_, index) => index !== i));

                          notify(p.name + ' se eliminó del carrito');
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="drawer-empty">
                <h3>Tu carrito está vacío</h3>
                <p>Agrega un producto para comenzar tu compra.</p>
              </div>
            )}
            <Link
              className="btn secondary drawer-primary-action"
              to="/carrito"
              onClick={() => setLayer('')}
            >
              Ir al carrito
            </Link>
            <section className="drawer-recommendations">
              <h2>Recomendados</h2>
              <div
                className="recommendation-carousel"
                tabIndex={0}
                role="region"
                aria-label="Productos recomendados"
              >
                {products.slice(6, 10).map((p) => (
                  <article className="recommendation" key={p.name}>
                    <ProductImage name={p.name} />
                    <div>
                      <strong>{p.name}</strong>
                      <p>Diseño local con materiales responsables.</p>
                      <p>{money(p.price)}</p>
                      <button
                        className="btn"
                        onClick={() => add(quickSelection(p))}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </Modal>
      )}
      {layer === 'auth' && (
        <Modal title="Acceso a tu cuenta" onClose={() => setLayer('')}>
          <AuthForm
            key={location.pathname}
            destination={
              location.pathname === '/carrito' ? '/checkout' : location.pathname
            }
            guest={location.pathname === '/carrito'}
          />
        </Modal>
      )}
      <div
        className={`toast${showToast ? ' show' : ''}${message.startsWith('¡Bienvenida') ? ' welcome-toast' : ''}`}
        role="status"
      >
        {showToast ? message : ''}
        {showToast && message.startsWith('¡Bienvenida') && (
          <button aria-label="Cerrar bienvenida" onClick={() => notify('')}>
            ×
          </button>
        )}
      </div>
    </>
  );
}
