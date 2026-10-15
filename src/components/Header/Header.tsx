import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../../data/categories';
import { useCart } from '../../store/cart';

export function Header({ openCart }: { openCart: () => void }) {
  const { count } = useCart();
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [categoryMenu, setCategoryMenu] = useState(false);
  const location = useLocation();

  return (
    <div className="site-navigation">
      {announcementOpen && (
        <div className="announcement-bar">
          <p>
            Regístrate con nosotros, ¡regalamos puntos verdes al iniciar sesión!
          </p>
          <button
            aria-label="Cerrar anuncio"
            onClick={() => setAnnouncementOpen(false)}
          >
            <img src="/img/figma/header-imgIconixtoSolidClose.svg" alt="" />
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
          <Link to="/#emprendedores">Nuestros Productores</Link>
          <Link to="/#huella-verde">¿Qué es tu Huella Verde?</Link>
          <Link to="/#blog">Blog</Link>
        </nav>
        <div className="header-actions">
          <form className="header-search" action="/buscar" role="search">
            <input
              name="q"
              type="search"
              aria-label="Buscar productos"
              placeholder="Buscar productos"
              required
              defaultValue={new URLSearchParams(location.search).get('q') ?? ''}
              key={location.key}
            />
            <button type="submit" className="icon-button" aria-label="Buscar">
              <img src="/img/figma/header-imgIconixtoLinearSearch.svg" alt="" />
            </button>
          </form>
          <button
            type="button"
            className="icon-button"
            aria-label="Productos guardados"
            disabled
          >
            <img src="/img/figma/header-imgIconixtoLinearHeart2.svg" alt="" />
          </button>
          <button
            type="button"
            className="icon-button cart-trigger"
            aria-label="Carrito"
            onClick={openCart}
          >
            <img src="/img/figma/header-imgIconixtoLinearCart.svg" alt="" />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          <Link
            className="icon-button account-trigger"
            to="/acceso"
            aria-label="Iniciar sesión"
            aria-current={location.pathname === '/acceso' ? 'page' : undefined}
          >
            <img
              className="account-default-icon"
              src="/img/figma/header-imgIconixtoLinearUser.svg"
              alt=""
            />
            <img
              className="account-active-icon"
              src="/img/figma/header-imgIconixtoSolidUser.svg"
              alt=""
            />
          </Link>
        </div>
      </header>
    </div>
  );
}
