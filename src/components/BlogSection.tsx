import { useState } from 'react';
import { Modal } from './Modal';

const articles = [
  {
    title: 'Estamos mejorando nuestros envases',
    description:
      'Seguimos buscando nuevas formas de mejorar nuestros envases, con alternativas más responsables y pensadas para cuidar cada detalle de tu compra…',
    image: '/img/figma/blog-imgFrame1168.png',
    alt: 'Mesa de trabajo con materiales para diseñar envases',
    text: 'Comienza con un cambio que puedas mantener: lleva tu bolsa reutilizable, aprovecha los envases que ya tienes y elige recargas cuando estén disponibles. Antes de comprar, revisa si puedes reparar, reutilizar o compartir lo que necesitas. Separar los residuos limpios y secos también ayuda a facilitar su reciclaje.',
  },
  {
    title: 'Nuevas ideas para un consumo consciente',
    description:
      'Creemos que cada pequeño cambio cuenta. Por eso, seguimos explorando ideas para fomentar la reutilización, reducir los residuos y consumir de manera más consciente…',
    image: '/img/figma/blog-imgFrame1169.png',
    alt: 'Personas compartiendo ideas para reciclar y cuidar el planeta',
    text: 'Revisa la composición, las instrucciones de cuidado y la información de origen de cada producto. Prefiere piezas duraderas que puedas usar muchas veces. Preguntar cómo y dónde se fabrica te permite tomar decisiones mejor informadas y valorar el trabajo que hay detrás de cada compra.',
  },
  {
    title: 'Alternativas sostenibles para tu día a día',
    description:
      'Descubre cómo pequeños cambios en tus hábitos pueden marcar la diferencia. En Buen Origen queremos acercarte alternativas prácticas para una vida más consciente…',
    image: '/img/figma/blog-imgFrame1170.png',
    alt: 'Bolsas de papel y vasos reutilizables como alternativas de consumo',
    text: 'Detrás de cada pieza artesanal hay tiempo, oficio y decisiones sobre los materiales. Conocer el proceso y conversar con sus creadores acerca la producción a nuestra vida cotidiana. Cuidar estas piezas y darles un uso prolongado es una forma de valorar ese trabajo.',
  },
];

export function BlogSection() {

  const [first, setFirst] = useState(0);
  const [selected, setSelected] = useState<(typeof articles)[number] | null>(
    null,
  );
  const visible = [...articles.slice(first), ...articles.slice(0, first)];

  function move(direction: number) {

    setFirst(
      (previous) => (previous + direction + articles.length) % articles.length,
    );
  }

  return (
    <section id="blog" className="section blog-section">
      <h2 className="blog-heading">Artículos de nuestro Blog</h2>
      <div className="blog-carousel">
        <button
          className="blog-arrow blog-prev"
          type="button"
          aria-label="Artículo anterior"
          onClick={() => move(-1)}
        >
          <img src="/img/figma/entrepreneurs-imgFrame1507.svg" alt="" />
        </button>
        <div className="blog-cards">
          {visible.map((article) => (
            <article className="blog-card" key={article.title}>
              <img
                src={article.image}
                alt={article.alt}
                loading="lazy"
                width={600}
                height={570}
              />
              <div className="blog-card-body">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <button type="button" onClick={() => setSelected(article)}>
                  Leer más
                </button>
              </div>
            </article>
          ))}
        </div>
        <button
          className="blog-arrow blog-next"
          type="button"
          aria-label="Artículo siguiente"
          onClick={() => move(1)}
        >
          <img
            src="/img/figma/entrepreneurs-imgIconixtoSolidArrowSquareRight1.svg"
            alt=""
          />
        </button>
      </div>
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <p>{selected.text}</p>
        </Modal>
      )}
    </section>
  );
}
