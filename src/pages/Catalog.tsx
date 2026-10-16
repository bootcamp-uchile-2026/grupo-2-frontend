import { ProductCard } from '../components/ProductCard';
import { BannerImage } from '../components/BannerImage';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { EmptyState } from '../components/EmptyState';

export function Catalog() {
  const { category = 'ropa-y-accesorios' } = useParams();
  const selected = categories.find((c) => c.id === category);
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

  const departmentProducts = products.filter(
    (product) => product.department === category,
  );
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
      [
        filterLabels[field],
        ...new Set(
          departmentProducts.flatMap((product) =>
            String(product[field as keyof typeof product]).split(','),
          ),
        ),
      ],
    ]),
  );
  let visible = departmentProducts.filter((p) =>
    Object.entries(filters).every(
      ([key, value]) =>
        value === 'all' ||
        p[key as keyof typeof p].toString().split(',').includes(value),
    ),
  );

  if (sort === 'asc') visible.sort((a, b) => a.price - b.price);

  if (sort === 'desc') visible.sort((a, b) => b.price - a.price);

  if (sort === 'new') visible = visible.toReversed();

  if (!selected)
    return (
      <EmptyState
        title="Categoría no encontrada"
        description="No pudimos encontrar esa categoría. Puedes elegir otra desde el inicio."
        to="/#categorias"
        action="Ver categorías"
      />
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
                        onChange={() =>
                          setFilters({ ...filters, [key]: value })
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
            <button className="clear-filters" onClick={() => setFilters({})}>
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
          {visible.length} productos
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
            {!visible.length && (
              <div className="catalog-empty">
                <h2>No encontramos productos</h2>
                <p>Prueba con otros filtros para encontrar lo que buscas.</p>
                <button className="btn" onClick={() => setFilters({})}>
                  Limpiar filtros
                </button>
              </div>
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
