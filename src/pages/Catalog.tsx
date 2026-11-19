import { CatalogProductCard } from '../components/CatalogProductCard';
import { BannerImage } from '../components/BannerImage';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { getCategories, getProducts } from '../api/client';
import type { ApiCategory, ApiProduct, ProductQuery } from '../api/client';
import { categorySlug } from '../data/categories';
import { CatalogFilters } from '../components/CatalogFilters';
import { defaultFilters, matchesVariants } from '../data/catalogFilters';
import type { Filters } from '../data/catalogFilters';
import { productAttributes } from '../data/products';

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

  const { category = '' } = useParams();

  // Reinicia los filtros al cambiar de categoría.
  return <CatalogView key={category} category={category} />;
}

function CatalogView({ category }: { category: string }) {

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [result, setResult] = useState<ApiProduct[] | null>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState<Filters>(() => ({
    ...defaultFilters,
    offers: params.get('ofertas') === '1',
  }));
  const [draft, setDraft] = useState<Filters>(filters);
  const selected = categories.find(
    (entry) => categorySlug(entry.name) === category,
  );
  const categoryId = selected?.id;
  const missing = categoriesLoaded && Boolean(category) && !selected;
  const sort = filters.sort;

  useEffect(() => {

    const controller = new AbortController();

    getCategories({ size: 100 }, controller.signal)
      .then(({ content }) => {

        setCategories(content);

        setCategoriesLoaded(true);
      })
      .catch((cause) => {

        if (!controller.signal.aborted) setError(cause.message);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {

    if (category && categoryId === undefined) return;

    const controller = new AbortController();
    const request = { size: 100, categoryId, ...sortParams[sort] };

    async function load() {

      const first = await getProducts(request, controller.signal);
      const remaining = await Promise.all(
        Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) => getProducts({ ...request, page: index + 1 }, controller.signal),
        ),
      );

      if (!controller.signal.aborted) {
        setError('');

        setResult(
          first.content.concat(
            remaining.flatMap((response) => response.content),
          ),
        );
      }
    }

    load().catch((cause) => {

      if (!controller.signal.aborted) setError(cause.message);
    });

    return () => controller.abort();
  }, [category, categoryId, sort]);

  function apply(next: Filters) {

    if (next.sort !== sort) {
      setResult(null);

      setError('');
    }

    setFilters(next);

    setDraft(next);

    setPage(0);
  }

  function changePage(next: number) {

    setPage(next - 1);

    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  }

  const filtered =
    result?.filter(
      (product) => (!filters.available || product.available) &&
        (!filters.offers || product.finalPrice < product.price) &&
        (filters.maxPrice === defaultFilters.maxPrice ||
          product.finalPrice <= filters.maxPrice) &&
        filters.attributes.every((attribute) => productAttributes(product.name, product.attributes).includes(
            attribute,
          ),
        ) &&
        matchesVariants(product.name, filters),
    ) ?? [];
  const visible = filtered.slice(page * size, (page + 1) * size);

  if (missing)
    return (
      <EmptyState
        title="Categoría no encontrada"
        description="No pudimos encontrar esa categoría. Puedes elegir otra desde el inicio."
        to="/#categorias"
        action="Ver categorías"
      />
    );

  if (category && !selected)
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
        <Link to="/">Inicio</Link> › {selected?.name ?? 'Productos'}
      </div>
      {selected ? (
        <div className="category-hero">
          <BannerImage category={category} priority />
          <h1 className="category-title">{selected.name}</h1>
        </div>
      ) : (
        <h1 className="section-title">Todos los productos</h1>
      )}
      <div className="catalog-toolbar">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="catalog-filters"
          onClick={() => setOpen(!open)}
        >
          Filtrar <span className="dropdown-chevron" aria-hidden="true" />
        </button>
        <span className="product-count" role="status">
          {result
            ? filtered.length + ' productos'
            : !error && 'Cargando productos…'}
        </span>
      </div>
      <div className="catalog-layout hito-filters-open">
        <div className="catalog-assortment">
          <aside className="catalog-sidebar">
            <figure className="catalog-producer">
              <div className="catalog-producer-photo">
                <img
                  src="/img/hito3/camila-rojas.png"
                  alt="Retrato de Camila Rojas"
                  width={1080}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                Hecho artesanalmente
                <br />
                Camila Rojas · Retrato de referencia
              </figcaption>
            </figure>
            <div id="catalog-filters" hidden={!open}>
              <CatalogFilters
                category={category}
                categories={categories}
                draft={draft}
                change={setDraft}
                selectCategory={(slug) => navigate(slug ? '/productos/' + slug : '/productos')
                }
                apply={() => apply(draft)}
                clear={() => {

                  apply(defaultFilters);

                  if (params.has('ofertas'))
                    navigate(
                      category ? '/productos/' + category : '/productos',
                      {
                        replace: true,
                      },
                    );
                }}
              />
            </div>
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
                <p>Prueba con otros filtros.</p>
              </div>
            )}
            {result && (
              <Pagination
                page={page + 1}
                pages={Math.ceil(filtered.length / size)}
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
