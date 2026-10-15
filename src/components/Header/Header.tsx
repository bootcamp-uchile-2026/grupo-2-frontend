import { useState } from 'react';
import { HeaderIcon } from './HeaderIcon';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { categories } from '../../data/categories';
import { useCart } from '../../store/cart';
import { useAccount, demoAccountSummary } from '../../store/account';

export function Header({
  openCart,
  openAuth,
}: {
  openCart: () => void;
  openAuth: () => void;
}) {

  const { count, notify } = useCart();
  const { user, logout } = useAccount();
  const account = user ?? demoAccountSummary;
  const [menu, setMenu] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [categoryMenu, setCategoryMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="site-navigation">
      {announcementOpen && (
        <div className="announcement-bar">
          <p>
            Regístrate con nosotros, regalamos puntos verdes al iniciar sesión.
          </p>
          <button
            aria-label="Cerrar anuncio"
            onClick={() => setAnnouncementOpen(false)}
          >
            ×
          </button>
        </div>
      )}
      <header className="site-header">
        <Link className="logo" to="/" aria-label="Buen Origen, inicio">
          <img
            className="figma-brand"
            src="/img/figma/login-imgLogoCompletoBuenOrigen2.png"
            alt="Buen Origen"
          />
        </Link>
        <nav className="main-nav">
          <div
            className={`nav-group${categoryMenu ? ' expanded' : ''}`}
            onBlur={(event) => {

              if (!event.currentTarget.contains(event.relatedTarget)) {
                setCategoryMenu(false);
              }
            }}
            onKeyDown={(event) => {

              if (event.key === 'Escape') setCategoryMenu(false);
            }}
          >
            <button
              className="nav-trigger"
              aria-expanded={categoryMenu}
              aria-controls="category-menu"
              onClick={() => setCategoryMenu(!categoryMenu)}
            >
              Categorías
            </button>
            <div className="dropdown" id="category-menu" inert={!categoryMenu}>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/productos/${category.id}`}
                  onClick={() => setCategoryMenu(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/productos/ropa-y-accesorios">Nuestros Productos</Link>
          <Link to="/#huella-verde">¿Qué es tu Huella Verde?</Link>
          <Link to="/#blog">Blog</Link>
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Buscar productos"
            disabled
          >
            <HeaderIcon name="search" />
          </button>
          {!user && (
            <button
              type="button"
              className="icon-button"
              aria-label="Productos guardados"
              disabled
            >
              <HeaderIcon name="heart" />
            </button>
          )}
          <div className="account-menu-wrap">
            <button
              className="account-greeting-button"
              aria-label={user ? 'Mi cuenta' : 'Iniciar sesión'}
              aria-expanded={user ? menu : undefined}
              aria-controls={user ? 'account-menu' : undefined}
              onClick={() =>
                user
                  ? setMenu(!menu)
                  : location.pathname === '/acceso'
                    ? navigate('/acceso')
                    : openAuth()
              }
            >
              {`¡Hola ${account.name}!`}
            </button>
            {user && (
              <>
                {menu && (
                  <>
                    <button
                      className="menu-dismiss"
                      aria-label="Cerrar menú de cuenta"
                      onClick={() => setMenu(false)}
                    />
                    <nav
                      className="account-dropdown"
                      id="account-menu"
                      aria-label="Mi cuenta"
                    >
                      {[
                        ['compras', 'Mis compras'],
                        ['puntos-verdes', 'Puntos Verdes'],
                        ['datos-personales', 'Datos personales'],
                      ].map(([path, label]) => (
                        <Link
                          key={path}
                          to={`/mi-cuenta/${path}`}
                          onClick={() => setMenu(false)}
                        >
                          {label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {

                          logout();

                          setMenu(false);

                          notify('Cerraste sesión');

                          navigate('/acceso');
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </nav>
                  </>
                )}
              </>
            )}
          </div>
          <Link className="header-points" to="/mi-cuenta/puntos-verdes">
            <HeaderIcon name="leaf" /> Tienes:{' '}
            {account.points.toLocaleString('es-CL')} Puntos Verdes
          </Link>
          <button
            className="icon-button cart-trigger"
            aria-label="Carrito"
            onClick={openCart}
          >
            <HeaderIcon name="cart" />
            <span className="cart-badge">{count}</span>
          </button>
        </div>
      </header>
    </div>
  );
}
