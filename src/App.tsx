import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CartProvider } from './store/CartContext';
import { AccountProvider } from './store/AccountProvider';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Product } from './pages/Product';
import { Cart } from './pages/Cart';
import { Search } from './pages/Search';
import './search.css';
import { Checkout } from './pages/Checkout';
import { Login, Recovery } from './pages/Access';
import { Account } from './pages/Account';
import { EmptyState } from './components/EmptyState';
import './index.css';
import './components/Header/Navigation.css';
import './design.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import './figma-refinements.css';
import './ux-alignment.css';

function LegacyRedirect({ to }: { to: string }) {

  const location = useLocation();

  return <Navigate replace to={to + location.search + location.hash} />;
}

function ProductRoute() {

  const location = useLocation();

  return <Product key={location.search} />;
}

function CatalogRoute() {

  const location = useLocation();

  return <Catalog key={location.pathname} />;
}

export function App() {

  const [layer, setLayer] = useState('');

  return (
    <BrowserRouter>
      <CartProvider>
        <AccountProvider>
          <Routes>
            <Route element={<Layout layer={layer} setLayer={setLayer} />}>
              <Route path="/" element={<Home />} />
              <Route path="/buscar" element={<Search />} />
              <Route path="/productos/:category" element={<CatalogRoute />} />
              <Route
                path="/productos/:category/producto"
                element={<ProductRoute />}
              />
              <Route
                path="/carrito"
                element={<Cart openAuth={() => setLayer('auth')} />}
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/acceso" element={<Login />} />
              <Route path="/recuperar-cuenta" element={<Recovery />} />
              <Route
                path="/mi-cuenta"
                element={<Navigate to="/mi-cuenta/compras" replace />}
              />
              <Route path="/mi-cuenta/:section" element={<Account />} />
              <Route path="/mi-cuenta/compras/:orderId" element={<Account />} />
              {[
                ['/index.html', '/'],
                ['/productos/moda-natural', '/productos/ropa-y-accesorios'],
                [
                  '/productos/moda-natural/producto',
                  '/productos/ropa-y-accesorios/producto',
                ],
                [
                  '/productos/moda-natural/index.html',
                  '/productos/ropa-y-accesorios',
                ],
                [
                  '/productos/moda-natural/producto/index.html',
                  '/productos/ropa-y-accesorios/producto',
                ],
                ['/carrito/index.html', '/carrito'],
                ['/checkout/index.html', '/checkout'],
              ].map(([from, to]) => (
                <Route
                  key={from}
                  path={from}
                  element={<LegacyRedirect to={to} />}
                />
              ))}
              <Route
                path="*"
                element={
                  <EmptyState
                    title="Página no encontrada"
                    description="La página que buscas no está disponible."
                    to="/"
                    action="Volver al inicio"
                  />
                }
              />
            </Route>
          </Routes>
        </AccountProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
