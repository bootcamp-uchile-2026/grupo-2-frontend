import { useRef, useState } from 'react';
import type { FormEventHandler } from 'react';

export function ShippingForm({
  confirm,
  noNumber,
  setNoNumber,
  contact,
}: {
  confirm: FormEventHandler<HTMLFormElement>;
  noNumber: boolean;
  setNoNumber: (value: boolean) => void;
  contact: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    rut: string;
  };
}) {

  const [identificationOpen, setIdentificationOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(true);
  const invalidFocusFrame = useRef<number | null>(null);

  return (
    <form
      className="checkout-form"
      id="checkout-form"
      onSubmit={confirm}
      onInvalidCapture={(event) => {

        const input = event.target as HTMLInputElement;
        const section = input
          .closest('[data-section]')
          ?.getAttribute('data-section');

        if (
          (section === 'identification' && !identificationOpen) ||
          (section === 'shipping' && !shippingOpen)
        ) {
          event.preventDefault();

          setIdentificationOpen(true);

          setShippingOpen(true);

          if (invalidFocusFrame.current === null) {
            invalidFocusFrame.current = requestAnimationFrame(() => {

              invalidFocusFrame.current = null;

              input.focus();

              input.reportValidity();
            });
          }
        }
      }}
    >
      <section className="checkout-form-panel" data-section="identification">
        <h2>
          <button
            type="button"
            className="checkout-section-toggle"
            aria-expanded={identificationOpen}
            aria-controls="identification-fields"
            onClick={() => setIdentificationOpen(!identificationOpen)}
          >
            Identificación
            <svg
              className="checkout-chevron"
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
        </h2>
        <div
          className="form-grid"
          id="identification-fields"
          hidden={!identificationOpen}
        >
          <label>
            <span className="sr-only">Nombre</span>
            <input
              name="firstName"
              placeholder="Nombre*"
              required
              defaultValue={contact.name}
              autoComplete="given-name"
            />
          </label>
          <label>
            <span className="sr-only">Apellido</span>
            <input
              name="lastName"
              placeholder="Apellido*"
              required
              defaultValue={contact.lastName}
              autoComplete="family-name"
            />
          </label>
          <label className="wide">
            <span className="sr-only">Correo electrónico</span>
            <input
              name="email"
              placeholder="Correo electrónico*"
              type="email"
              required
              defaultValue={contact.email}
              autoComplete="email"
            />
          </label>
          <label>
            <span className="sr-only">RUT</span>
            <input
              name="rut"
              placeholder="RUT*"
              required
              defaultValue={contact.rut}
            />
          </label>
          <label>
            <span className="sr-only">Teléfono</span>
            <input
              name="phone"
              placeholder="Teléfono*"
              type="tel"
              required
              defaultValue={contact.phone}
              autoComplete="tel"
            />
          </label>
        </div>
      </section>
      <section className="checkout-form-panel" data-section="shipping">
        <h2>
          <button
            type="button"
            className="checkout-section-toggle"
            aria-expanded={shippingOpen}
            aria-controls="shipping-fields"
            onClick={() => setShippingOpen(!shippingOpen)}
          >
            Envío
            <svg
              className="checkout-chevron"
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
        </h2>
        <div className="form-grid" id="shipping-fields" hidden={!shippingOpen}>
          <label>
            <span className="sr-only">Comuna</span>
            <select name="commune" required>
              <option value="">Comuna*</option>
              <option>Cerrillos</option>
              <option>Cerro Navia</option>
              <option>Conchalí</option>
              <option>El Bosque</option>
              <option>Estación Central</option>
              <option>Huechuraba</option>
              <option>Independencia</option>
              <option>La Cisterna</option>
              <option>La Florida</option>
              <option>La Granja</option>
              <option>La Pintana</option>
              <option>La Reina</option>
              <option>Las Condes</option>
              <option>Lo Barnechea</option>
              <option>Lo Espejo</option>
              <option>Lo Prado</option>
              <option>Macul</option>
              <option>Maipú</option>
              <option>Ñuñoa</option>
              <option>Pedro Aguirre Cerda</option>
              <option>Peñalolén</option>
              <option>Providencia</option>
              <option>Pudahuel</option>
              <option>Puente Alto</option>
              <option>Quilicura</option>
              <option>Quinta Normal</option>
              <option>Recoleta</option>
              <option>Renca</option>
              <option>San Bernardo</option>
              <option>San Joaquín</option>
              <option>San Miguel</option>
              <option>San Ramón</option>
              <option>Santiago</option>
              <option>Vitacura</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Calle</span>
            <input
              name="street"
              placeholder="Calle*"
              required
              autoComplete="address-line1"
            />
          </label>
          <label>
            <span className="sr-only">Número</span>
            <input
              name="number"
              placeholder="Número*"
              id="street-number"
              required={!noNumber}
              disabled={noNumber}
            />
          </label>
          <label className="no-number">
            <input
              id="no-street-number"
              type="checkbox"
              checked={noNumber}
              onChange={(e) => setNoNumber(e.target.checked)}
            />{' '}
            Calle sin número
          </label>
          <label>
            <span className="sr-only">Depto/ofic/casa (opcional)</span>
            <input
              name="unit"
              placeholder="Depto/ofic/casa (opcional)"
              autoComplete="address-line2"
            />
          </label>
          <label>
            <span className="sr-only">Código postal (opcional)</span>
            <input
              name="postalCode"
              placeholder="Código postal (opcional)"
              autoComplete="postal-code"
            />
          </label>
          <label className="wide">
            <span className="sr-only">
              Indicaciones para la entrega (opcional)
            </span>
            <textarea
              name="instructions"
              rows={5}
              placeholder="Indicaciones para la entrega (opcional)"
            ></textarea>
          </label>
        </div>
      </section>
    </form>
  );
}
