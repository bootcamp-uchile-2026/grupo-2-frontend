import { ProductCard } from '../components/ProductCard';
import { BannerImage } from '../components/BannerImage';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { EmptyState } from '../components/EmptyState';

export function Catalog() {

  const { category = 'ropa-y-accesorios' } = useParams();
  const selected = categories.find((c) => c.id === category);
  const [sort, setSort] = useState('featured');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

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
      <div className="catalog-toolbar">
        <button
          className="toolbar-button filter-toggle"
          aria-expanded={open}
          aria-controls="catalog-filters"
          onClick={() => setOpen(!open)}
        >
          Filtrar
          <svg
            className="filter-chevron"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <label className="sort-wrap">
          Ordenar por{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Destacados</option>
            <option value="asc">Menor a mayor precio</option>
            <option value="desc">Mayor a menor precio</option>
            <option value="new">Más recientes</option>
          </select>
        </label>
        <span className="product-count">{visible.length} productos</span>
      </div>
      <div className={`catalog-layout${open ? ' filters-open' : ''}`}>
        <aside className="filters" id="catalog-filters" inert={!open}>
          <h2>FILTROS</h2>
          {Object.entries(options).map(([key, values]) => (
            <label key={key}>
              <span className="sr-only">{values[0]}</span>
              <select
                value={filters[key] || 'all'}
                onChange={(e) =>
                  setFilters({ ...filters, [key]: e.target.value })
                }
              >
                {values.map((v, i) => (
                  <option key={v} value={i === 0 ? 'all' : v}>
                    {v === 'algodon'
                      ? 'Algodón'
                      : v[0].toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button className="clear-filters" onClick={() => setFilters({})}>
            Limpiar filtros
          </button>
        </aside>
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
