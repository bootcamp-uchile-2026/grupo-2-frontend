import { useRef, useState } from 'react';
import { Modal } from './Modal';

const people = [
  {
    brand: 'Origen Textil',
    name: 'Camila Rojas',
    description:
      'Emprendimiento de moda consciente que crea prendas de algodón orgánico y fibras naturales, combinando comodidad, diseño sencillo y una forma de vestir más responsable.',
  },
  {
    brand: 'La Despensa',
    name: 'Sofía Garrido',
    description:
      'Emprendimiento de alimentos de origen orgánico y producción consciente, con una selección de quesos, vinos y otros productos elaborados con dedicación y respeto por su origen.',
  },
  {
    brand: 'Huerta Viva',
    name: 'José Montecinos',
    description:
      'Emprendimiento dedicado a acercar la naturaleza al hogar, con plantas, semillas y formatos de huerta pensados para cultivar de manera sencilla en espacios urbanos.',
  },
  {
    brand: 'Savia y Aroma',
    name: 'Mariana Castillo',
    description:
      'Una marca inspirada en los pequeños rituales que nos ayudan a reconectar con nosotros mismos. Ofrece velas aromáticas, inciensos y productos de aromaterapia para crear espacios de calma y armonía.',
  },
  {
    brand: 'Manos de Tierra',
    name: 'Daniel Sandoval',
    description:
      'Emprendimiento dedicado a la creación de piezas artesanales de cerámica y decoración hechas a mano, utilizando técnicas tradicionales y materiales nobles para dar vida a objetos únicos.',
  },
];

export function Entrepreneurs() {

  const track = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<(typeof people)[number] | null>(
    null,
  );

  return (
    <section className="section makers-section" id="emprendedores">
      <h2 className="section-title">Nuestros Emprendedores</h2>
      <p className="makers-intro">
        Conoce a las personas detrás de tus productos
      </p>
      <div className="makers-carousel">
        <button
          aria-label="Emprendedores anteriores"
          onClick={() =>
            track.current?.scrollBy({ left: -336, behavior: 'smooth' })
          }
        >
          <img src="/img/figma/entrepreneurs-imgFrame1507.svg" alt="" />
        </button>
        <div className="makers-track" ref={track}>
          {people.map((person, index) => (
            <article className="maker-card" key={person.brand}>
              <img
                className="maker-cover"
                src={`/img/figma/entrepreneurs-imgRectangle${608 + index}.png`}
                alt=""
                loading="lazy"
              />
              <img
                className="maker-portrait"
                src={`/img/figma/entrepreneurs-imgEllipse${3 + index}.png`}
                alt={person.name}
                loading="lazy"
              />
              <h3>{person.brand}</h3>
              <strong>{person.name}</strong>
              <p>{person.description}</p>
              <button
                className="maker-more"
                onClick={() => setSelected(person)}
              >
                Ver más
              </button>
            </article>
          ))}
        </div>
        <button
          aria-label="Emprendedores siguientes"
          onClick={() =>
            track.current?.scrollBy({ left: 336, behavior: 'smooth' })
          }
        >
          <img
            src="/img/figma/entrepreneurs-imgIconixtoSolidArrowSquareRight1.svg"
            alt=""
          />
        </button>
      </div>
      {selected && (
        <Modal title={selected.brand} onClose={() => setSelected(null)}>
          <p>{selected.name}</p>
          <p>{selected.description}</p>
        </Modal>
      )}
    </section>
  );
}
