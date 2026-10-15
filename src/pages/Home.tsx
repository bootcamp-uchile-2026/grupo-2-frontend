import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { BlogSection } from '../components/BlogSection';
import { BannerImage } from '../components/BannerImage';
import { Link } from 'react-router-dom';
import { Carousel } from '../components/Carousel';
import { Entrepreneurs } from '../components/Entrepreneurs';
import { Categories } from '../components/Categories';

export function Home() {

  return (
    <main className="home-view">
      <section className="hero">
        <div className="hero-copy">
          <h1>Cuidemos el planeta una compra a la vez</h1>
          <Link className="btn" to="/#huella-verde">
            Conoce más <img src="/img/figma/home-leaf.svg" alt="" />
          </Link>
          <p>
            Somos una cooperativa de productores sustentables de la ciudad de
            Santiago, unidos por el cuidado del medio ambiente y el respeto a
            los productos locales.
          </p>
        </div>
        <div className="hero-art">
          <img
            src="/img/figma/home-hero.png"
            alt="Ovillos de fibras naturales y materiales de trabajo artesanal"
            fetchPriority="high"
          />
        </div>
      </section>
      <Categories />
      <section className="offer" aria-label="Ofertas destacadas">
        <Carousel kind="offer" desktopCount={1} gap={0}>
          <div className="offer-track">
            <article className="offer-slide active">
              <BannerImage category="alimentos" />
              <span>Descubre productos de origen local</span>
              <Link className="btn" to="/productos/alimentos">
                Ver productos
              </Link>
            </article>
            <article className="offer-slide">
              <BannerImage category="ropa-y-accesorios" />
              <span>Moda consciente para todos los días</span>
              <Link className="btn" to="/productos/ropa-y-accesorios">
                Ver colección
              </Link>
            </article>
            <article className="offer-slide">
              <BannerImage category="cuidado-personal" />
              <span>Productos libres de tóxicos</span>
              <Link className="btn" to="/productos/cuidado-personal">
                Ver productos
              </Link>
            </article>
            <article className="offer-slide">
              <BannerImage category="limpieza-del-hogar" />
              <span>Elige reutilizar y reducir residuos</span>
              <Link className="btn" to="/productos/limpieza-del-hogar">
                Descubrir
              </Link>
            </article>
            <article className="offer-slide">
              <BannerImage category="decoracion-y-artesania" />
              <span>Apoya a emprendedores de tu comunidad</span>
              <Link className="btn" to="/productos/decoracion-y-artesania">
                Ver productos
              </Link>
            </article>
          </div>
          <button
            className="carousel-arrow prev"
            type="button"
            aria-label="Oferta anterior"
          >
            ‹
          </button>
          <button
            className="carousel-arrow next"
            type="button"
            aria-label="Oferta siguiente"
          >
            ›
          </button>
          <div className="carousel-dots" aria-label="Seleccionar oferta">
            <button className="active" aria-label="Oferta 1"></button>
            <button aria-label="Oferta 2"></button>
            <button aria-label="Oferta 3"></button>
            <button aria-label="Oferta 4"></button>
            <button aria-label="Oferta 5"></button>
          </div>
        </Carousel>
      </section>
      <section
        className="section home-products"
        aria-label="Productos destacados"
      >
        <div className="home-product-grid">
          {products
            .filter((p) => p.department === 'ropa-y-accesorios')
            .slice(0, 7)
            .map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
          <Link
            className="btn home-products-more"
            to="/productos/ropa-y-accesorios"
          >
            Más populares →
          </Link>
        </div>
      </section>
      <section id="compromiso" className="section commitments">
        <h2 className="section-title">Nuestro compromiso</h2>
        <div className="commitment-grid">
          <article>
            <div className="commitment-icon" aria-hidden="true">
              <img
                src="/img/figma/commitments-imgIconixtoSolidRecycle.svg"
                alt=""
              />
            </div>
            <h3>Cero Residuos</h3>
            <p>
              Productos reutilizables, sostenibles y respetuosos con el
              medioambiente.
            </p>
          </article>
          <article>
            <div className="commitment-icon" aria-hidden="true">
              <img
                src="/img/figma/commitments-imgIconixtoLinearBunny.svg"
                alt=""
              />
            </div>
            <h3>Cruelty Free</h3>
            <p>Productos elaborados sin pruebas en animales.</p>
          </article>
          <article>
            <div className="commitment-icon" aria-hidden="true">
              <img
                src="/img/figma/commitments-imgIconixtoLinearLeaf.svg"
                alt=""
              />
            </div>
            <h3>Libre de Tóxicos</h3>
            <p>Ingredientes que cuidan de ti y del medioambiente.</p>
          </article>
          <article>
            <div className="commitment-icon" aria-hidden="true">
              <img
                src="/img/figma/commitments-imgIconixtoLinearUserGroup.svg"
                alt=""
              />
            </div>
            <h3>Marcas Locales</h3>
            <p>Trabajamos con emprendedores y marcas locales.</p>
          </article>
        </div>
      </section>
      <section className="section footprint" id="huella-verde">
        <h2>
          ¿Qué es tu
          <br />
          Huella Verde?
        </h2>
        <p>
          Es una forma simple de conocer el impacto positivo de cada compra:
          materiales responsables, producción local, menos residuos y decisiones
          más conscientes.
        </p>
      </section>
      <Entrepreneurs />
      <BlogSection />
    </main>
  );
}
