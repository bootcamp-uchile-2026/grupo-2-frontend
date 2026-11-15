import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/client';
import type { ApiCategory, Page } from '../api/client';
import { categoryImages, categorySlug } from '../data/categories';
import { Pagination } from './Pagination';

const labels: Record<string, string> = {
  'cuidado-personal': 'Cuidado Personal',
  'huerto-y-jardineria': 'Huerto y Jardín',
  'limpieza-del-hogar': 'Limpieza del Hogar',
  'aromas-y-bienestar': 'Aromas y Bienestar',
  'ropa-y-accesorios': 'Ropa y Accesorios',
  'decoracion-y-artesania': 'Decoración y Artesanía',
};

const size = 8;

// La página es base 0, igual que en el backend.
export function Categories() {

  const [page, setPage] = useState(0);
  const [result, setResult] = useState<Page<ApiCategory> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {

    const controller = new AbortController();

    getCategories(
      { page, size, sortBy: 'id', sortDirection: 'ASC' },
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
  }, [page]);

  return (
    <section className="section home-categories" id="categorias">
      <h2 className="section-title">¡Lo que necesitas, encuéntralo aquí!</h2>
      {error && <p role="alert">{error}</p>}
      {!result && !error && <p role="status">Cargando categorías…</p>}
      <div className="category-cards">
        {result?.content.map((category) => {

          const slug = categorySlug(category.name);

          return (
            <Link
              key={category.id}
              to={`/productos/${slug}`}
              className="category-card"
            >
              {categoryImages[slug] && (
                <img
                  className="category-cutout"
                  src={categoryImages[slug]}
                  alt=""
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span>{labels[slug] ?? category.name}</span>
            </Link>
          );
        })}
      </div>
      {result && (
        <Pagination
          page={page + 1}
          pages={result.totalPages}
          onChange={(next) => setPage(next - 1)}
          label="Páginas de categorías"
        />
      )}
    </section>
  );
}
