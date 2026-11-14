import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/client';
import type { ApiCategory, Paginated } from '../api/client';
import { Pagination } from './Pagination';

const labels: Record<string, string> = {
  'cuidado-personal': 'Cuidado Personal',
  'huerto-y-jardineria': 'Huerto y Jardín',
  'limpieza-del-hogar': 'Limpieza del Hogar',
  'aromas-y-bienestar': 'Aromas y Bienestar',
  'ropa-y-accesorios': 'Ropa y Accesorios',
  'decoracion-y-artesania': 'Decoración y Artesanía',
};

const perPage = 8;

export function Categories() {

  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Paginated<ApiCategory> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {

    const controller = new AbortController();

    getCategories({ page, perPage }, controller.signal)
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
        {result?.data.map((category) => (
          <Link
            key={category.id}
            to={`/productos/${category.id}`}
            className="category-card"
          >
            <img
              className="category-cutout"
              src={category.image}
              alt=""
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
            />
            <span>{labels[category.id] ?? category.name}</span>
          </Link>
        ))}
      </div>
      {result && (
        <Pagination
          page={page}
          pages={result.pages}
          onChange={setPage}
          label="Páginas de categorías"
        />
      )}
    </section>
  );
}
