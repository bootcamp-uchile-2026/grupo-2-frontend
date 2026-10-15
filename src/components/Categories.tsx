import { Link } from 'react-router-dom';
import { categories } from '../data/categories';

const labels: Record<string, string> = {
  'cuidado-personal': 'Cuidado Personal',
  'huerto-y-jardineria': 'Huerto y Jardín',
  'limpieza-del-hogar': 'Limpieza del Hogar',
  'aromas-y-bienestar': 'Aromas y Bienestar',
  'ropa-y-accesorios': 'Ropa y Accesorios',
  'decoracion-y-artesania': 'Decoración y Artesanía',
};

export function Categories() {

  return (
    <section className="section home-categories" id="categorias">
      <h2 className="section-title">¡Lo que necesitas, encuéntralo aquí!</h2>
      <div className="category-cards">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/productos/${category.id}`}
            className="category-card"
          >
            <img
              className="category-cutout"
              src={`/img/figma/categories-imgFrame${1415 + index}.png`}
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
    </section>
  );
}
