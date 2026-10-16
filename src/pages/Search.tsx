import { Link, useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { EmptyIllustration } from '../components/EmptyIllustration';

const normalize = (value: string) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function Search() {

  const [params] = useSearchParams();
  const query = (params.get('q') ?? '').trim();
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const results = words.length
    ? products.filter((product) => {

        const text = normalize(
          product.name +
            ' ' +
            product.description +
            ' ' +
            product.category +
            ' ' +
            product.material,
        );

        return words.every((word) => text.includes(word));
      })
    : [];

  return (
    <main className="search-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> › Búsqueda
      </div>
      <h1 className="search-heading">
        {query
          ? 'Resultados para “' + query + '”'
          : 'Busca tu próximo producto'}
      </h1>
      {results.length ? (
        <>
          <p role="status">{results.length} producto(s) encontrado(s)</p>
          <section
            className="search-products"
            aria-label="Resultados de búsqueda"
          >
            {results.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </section>
        </>
      ) : (
        <>
          <section className="ux-empty search-empty">
            <EmptyIllustration />
            <h2>
              {query
                ? 'Ups...No encontramos tu producto'
                : 'Escribe lo que estás buscando'}
            </h2>
            <p>
              {query
                ? 'Prueba con otro nombre o descubre nuestras recomendaciones.'
                : 'Usa el buscador para explorar nuestros productos.'}
            </p>
          </section>
          <section className="search-recommendations">
            <h2>Productos Recomendados</h2>
            <div className="search-products">
              {products
                .filter((product) => product.department === 'ropa-y-accesorios')
                .slice(0, 3)
                .map((product) => (
                  <ProductCard key={product.name} product={product} />
                ))}
            </div>
            <Link className="btn outline" to="/productos/ropa-y-accesorios">
              Ver más
            </Link>
          </section>
          <section className="section reviews">
            <h2 className="section-title">Reseñas de nuestros clientes</h2>
            <div className="review-row">
              {[
                'Excelente calidad y despacho rápido.',
                'Me encantó conocer el impacto positivo de mi compra.',
                'Diseño precioso y producido localmente.',
              ].map((text) => (
                <article key={text}>
                  <div className="stars">★★★★★</div>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
