import { Link } from 'react-router-dom';

export function Footer() {

  return (
    <footer className="site-footer">
      <div>
        <h3>Contacto</h3>
        <p>contacto@buenorigen.cl</p>
        <p>+56 9 1234 5678</p>
        <div className="footer-socials" aria-label="Redes sociales">
          <img
            src="/img/figma/footer-imgIconixtoSolidFacebook.svg"
            alt="Facebook"
          />
          <img src="/img/figma/footer-imgIconixtoLinearX.svg" alt="X" />
          <img
            src="/img/figma/footer-imgIconixtoSolidInstagram.svg"
            alt="Instagram"
          />
          <img
            src="/img/figma/footer-imgIconixtoSolidTiktok.svg"
            alt="Tiktok"
          />
        </div>
      </div>
      <div>
        <h3>Navegación</h3>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/#categorias">Categorías</Link>
          </li>
          <li>
            <Link to="/productos/ropa-y-accesorios">Nuestros Productos</Link>
          </li>
          <li>
            <Link to="/#huella-verde">¿Qué es tu Huella Verde?</Link>
          </li>
          <li>
            <Link to="/#blog">Blog</Link>
          </li>
        </ul>
      </div>
      <div>
        <h3>Ayuda</h3>
        <ul>
          <li>
            <Link to="/mi-cuenta">Mi cuenta</Link>
          </li>
          <li>
            <Link to="/mi-cuenta/compras">Soporte</Link>
          </li>
          <li>
            <Link to="/mi-cuenta/compras">Servicio al cliente</Link>
          </li>
          <li>Políticas de privacidad</li>
          <li>Términos y condiciones</li>
        </ul>
      </div>
      <div>
        <h3>Consigue la app</h3>
        <img
          className="figma-store-badge"
          src="/img/figma/footer-imgBadgeGooglePlayMarket45PxBlue.svg"
          alt="Google Play"
        />
        <img
          className="figma-store-badge"
          src="/img/figma/footer-imgBadgeAppStore45PxBlue.svg"
          alt="App Store"
        />
      </div>
      <div className="copyright">
        © 2026 Buen Origen · Todos los derechos reservados
      </div>
    </footer>
  );
}
