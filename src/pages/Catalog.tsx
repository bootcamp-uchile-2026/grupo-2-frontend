import { ProductCard } from '../components/ProductCard';
import { BannerImage } from '../components/BannerImage';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { ApiError, getCategory, getProducts } from '../api/client';
import type { ApiCategory, ApiProduct, Paginated, ProductQuery } from '../api/client';

const perPage = 12;

const sortParams: Record<string, ProductQuery['sort']> = {
  asc: 'price',
  desc: '-price',
  new: '-id',
};

export function Catalog() {

  const { category = 'ropa-y-accesorios' } = useParams();

  // La key reinicia filtros, orden y página al cambiar de categoría.
  return <CatalogView key={category} category={category} />;
}

function CatalogView({ category }: { category: string }) {

  const [selected, setSelected] = useState<ApiCategory | null>(null);
  const [missing, setMissing] = useState(false);
  const [result, setResult] = useState<Paginated<ApiProduct> | null>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
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
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {

    const controller = new AbortController();

    getCategory(category, controller.signal)
      .then(setSelected)
      .catch((cause) => {

        if (controller.signal.aborted) return;

        if (cause instanceof ApiError && cause.status === 404) setMissing(true);
        else setError(cause.message);
      });

    return () => controller.abort();
  }, [category]);

  useEffect(() => {

    const controller = new AbortController();

    getProducts(
      { page, perPage, department: category, sort: sortParams[sort], filters },
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
  }, [category, page, sort, filters]);

  function changeFilters(next: Record<string, string>) {

    setFilters(next);

    setPage(1);
  }

  function changePage(next: number) {

    setPage(next);

    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  }

  const filterLabels: Record<string, string> = {
    category: 'Tipo de producto',
    gender: 'Género',
    size: category === 'ropa-y-accesorios' ? 'Talla' : 'Presentación',
    color: 'Color',
    material: 'Material',
  };
  const fields =
    category === 'ropa-y-accesorios'
      ? ['category', 'gender', 'size', 'color', 'material']
      : ['category', 'size', 'material'];
  const options = Object.fromEntries(
    fields.map((field) => [
      field,
      [filterLabels[field], ...(selected?.filters[field] ?? [])],
    ]),
  );
  const visible = result?.data ?? [];

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
        <details className="catalog-dropdown" name="catalog-tools">
          <summary>
            Filtrar <span className="dropdown-chevron" aria-hidden="true" />
          </summary>
          <div className="catalog-dropdown-panel filter-dropdown-panel">
            {Object.entries(options).map(([key, values]) => (
              <details className="filter-choice" key={key}>
                <summary>
                  {values[0]}
                  {filters[key] && filters[key] !== 'all'
                    ? ': ' + filters[key]
                    : ''}{' '}
                  <span className="dropdown-chevron" aria-hidden="true" />
                </summary>
                <div className="filter-choice-options">
                  {['all', ...values.slice(1)].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name={'filter-' + key}
                        checked={(filters[key] || 'all') === value}
                        onChange={() => changeFilters({ ...filters, [key]: value })
                        }
                      />
                      {value === 'all'
                        ? 'Todos'
                        : value === 'algodon'
                          ? 'Algodón'
                          : value.charAt(0).toUpperCase() + value.slice(1)}
                    </label>
                  ))}
                </div>
              </details>
            ))}
            <button className="clear-filters" onClick={() => changeFilters({})}>
              Limpiar filtros
            </button>
          </div>
        </details>
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

                  setPage(1);

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
          {result ? result.items + ' productos' : 'Cargando productos…'}
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
              <ProductCard key={p.name} product={p} />
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
                <p>Prueba con otros filtros para encontrar lo que buscas.</p>
                <button className="btn" onClick={() => changeFilters({})}>
                  Limpiar filtros
                </button>
              </div>
            )}
            {result && (
              <Pagination
                page={page}
                pages={result.pages}
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
