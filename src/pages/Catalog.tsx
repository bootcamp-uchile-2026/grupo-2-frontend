import { CatalogProductCard } from '../components/CatalogProductCard';
import { BannerImage } from '../components/BannerImage';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { getCategories, getProducts } from '../api/client';
import type { ApiCategory, ApiProduct, Page, ProductQuery } from '../api/client';
import { categorySlug } from '../data/categories';

const size = 12;

// Campos de ordenamiento autorizados por GET /products.
const sortParams: Record<
  string,
  Pick<ProductQuery, 'sortBy' | 'sortDirection'>
> = {
  asc: { sortBy: 'finalPrice', sortDirection: 'ASC' },
  desc: { sortBy: 'finalPrice', sortDirection: 'DESC' },
  featured: { sortBy: 'id', sortDirection: 'ASC' },
  new: { sortBy: 'createdAt', sortDirection: 'DESC' },
};

export function Catalog() {

  const { category = 'ropa-y-accesorios' } = useParams();

  // La key reinicia filtros, orden y página al cambiar de categoría.
  return <CatalogView key={category} category={category} />;
}

function CatalogView({ category }: { category: string }) {

  const [selected, setSelected] = useState<ApiCategory | null>(null);
  const [missing, setMissing] = useState(false);
  const [result, setResult] = useState<Page<ApiProduct> | null>(null);
  const [error, setError] = useState('');
  // Página base 0, igual que el backend.
  const [page, setPage] = useState(0);
  const toolbar = useRef<HTMLDivElement>(null);

  useEffect(() => {

    function closeMenus(event: PointerEvent | KeyboardEvent) {

      if (event instanceof KeyboardEvent && event.key !== 'Escape') return;

      if (
        event instanceof PointerEvent &&
        toolbar.current?.contains(event.target as Node)
      )
        return;

      toolbar.current
        ?.querySelectorAll<HTMLDetailsElement>('.catalog-dropdown[open]')
        .forEach((menu) => {

          menu.open = false;

          if (event instanceof KeyboardEvent)
            menu.querySelector('summary')?.focus();
        });
    }

    document.addEventListener('pointerdown', closeMenus);

    document.addEventListener('keydown', closeMenus);

    return () => {

      document.removeEventListener('pointerdown', closeMenus);

      document.removeEventListener('keydown', closeMenus);
    };
  }, []);

  const [sort, setSort] = useState('featured');

  // La ruta usa un slug; el backend identifica las categorías por id numérico.
  useEffect(() => {

    const controller = new AbortController();

    getCategories({ size: 100 }, controller.signal)
      .then(({ content }) => {

        const match = content.find(
          (item) => categorySlug(item.name) === category,
        );

        if (match) setSelected(match);
        else setMissing(true);
      })
      .catch((cause) => {

        if (!controller.signal.aborted) setError(cause.message);
      });

    return () => controller.abort();
  }, [category]);

  const categoryId = selected?.id;

  useEffect(() => {

    if (categoryId === undefined) return;

    const controller = new AbortController();

    getProducts(
      { page, size, categoryId, ...sortParams[sort] },
      controller.signal,
    )
      .then((data) => {

        setResult(data);

        setError('');
      })
      .catch((cause) => {

        if (!controller.signal.aborted) setError(cause.message);
      });

    return () => controller.abort();
  }, [categoryId, page, sort]);

  function changePage(next: number) {

    setPage(next - 1);

    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  }

  const visible = result?.content ?? [];

  if (missing)
    return (
      <EmptyState
        title="Categoría no encontrada"
        description="No pudimos encontrar esa categoría. Puedes elegir otra desde el inicio."
        to="/#categorias"
        action="Ver categorías"
      />
    );

  if (!selected)
    return (
      <main className="catalog-page">
        <p role={error ? 'alert' : 'status'}>
          {error || 'Cargando categoría…'}
        </p>
      </main>
    );

  return (
    <main className="catalog-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> › {selected.name}
      </div>
      <div className="category-hero">
        <BannerImage category={category} priority />
        <h1 className="category-title">{selected.name}</h1>
      </div>
      <div className="catalog-toolbar" ref={toolbar}>
        <details
          className="catalog-dropdown sort-dropdown"
          name="catalog-tools"
        >
          <summary>
            Ordenar por <span className="dropdown-chevron" aria-hidden="true" />
          </summary>
          <div className="catalog-dropdown-panel sort-dropdown-panel">
            {[
              ['asc', 'Precio menor a mayor'],
              ['desc', 'Precio mayor a menor'],
              ['featured', 'Productos destacados'],
              ['new', 'Productos más recientes'],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={sort === value}
                onClick={(event) => {

                  setSort(value);

                  setPage(0);

                  event.currentTarget
                    .closest('details')
                    ?.removeAttribute('open');
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </details>
        <span className="product-count" role="status">
          {result ? result.totalElements + ' productos' : 'Cargando productos…'}
        </span>
      </div>
      <div className="catalog-layout">
        <div className="catalog-assortment">
          <aside className="catalog-story">
            <BannerImage category={category} />
            <p>
              Hecho con dedicación
              <br />
              <strong>Descubre el origen de cada producto</strong>
            </p>
          </aside>
          <section className="catalog-products" id="catalog">
            {visible.map((p) => (
              <CatalogProductCard key={p.id} product={p} />
            ))}
            {error && (
              <div className="catalog-empty" role="alert">
                <h2>No pudimos cargar los productos</h2>
                <p>{error}</p>
              </div>
            )}
            {result && !visible.length && (
              <div className="catalog-empty">
                <h2>No encontramos productos</h2>
                <p>Esta categoría aún no tiene productos disponibles.</p>
              </div>
            )}
            {result && (
              <Pagination
                page={page + 1}
                pages={result.totalPages}
                onChange={changePage}
                label="Páginas de productos"
              />
            )}
          </section>
        </div>
      </div>
      <section className="section reviews">
        <h2 className="section-title">Reseñas de nuestros clientes</h2>
        <div className="review-row">
          {[
            'Excelente calidad y despacho rápido. Se nota el cuidado en cada detalle.',
            'Me encantó conocer el impacto positivo de mi compra.',
            category === 'ropa-y-accesorios'
              ? 'Diseño precioso, cómodo y producido localmente.'
              : 'Muy buena presentación y una compra práctica para el día a día.',
          ].map((text) => (
            <article key={text}>
              <div className="stars">★★★★★</div>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
