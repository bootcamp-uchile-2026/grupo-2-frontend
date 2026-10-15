import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { shippingSchema } from './shippingSchema';
import type { ShippingData } from './shippingSchema';

export function ShippingForm({
  confirm,
  noNumber,
  setNoNumber,
  contact,
}: {
  confirm: (event: FormEvent<HTMLFormElement>, data: ShippingData) => void;
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
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = shippingSchema.safeParse({
      ...Object.fromEntries(data),
      number: data.get('number') ?? '',
      noNumber,
    });
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);
        next[field] ??= issue.message;
      }
      setErrors(next);
      setIdentificationOpen(true);
      setShippingOpen(true);
      requestAnimationFrame(() => {
        const field = formRef.current?.elements.namedItem(Object.keys(next)[0]);
        if (field instanceof HTMLElement) field.focus();
      });
      return;
    }
    setErrors({});
    confirm(event, result.data);
  }

  function fieldError(name: string) {
    return errors[name] ? (
      <span className="form-error" id={name + '-error'} role="alert">
        {errors[name]}
      </span>
    ) : null;
  }

  return (
    <form
      ref={formRef}
      className="checkout-form"
      id="checkout-form"
      noValidate
      onSubmit={submit}
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
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={
                errors.firstName ? 'firstName-error' : undefined
              }
              placeholder="Nombre*"
              required
              defaultValue={contact.name}
              autoComplete="given-name"
            />
            {fieldError('firstName')}
          </label>
          <label>
            <span className="sr-only">Apellido</span>
            <input
              name="lastName"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              placeholder="Apellido*"
              required
              defaultValue={contact.lastName}
              autoComplete="family-name"
            />
            {fieldError('lastName')}
          </label>
          <label className="wide">
            <span className="sr-only">Correo electrónico</span>
            <input
              name="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="Correo electrónico*"
              type="email"
              required
              defaultValue={contact.email}
              autoComplete="email"
            />
            {fieldError('email')}
          </label>
          <label>
            <span className="sr-only">RUT</span>
            <input
              name="rut"
              aria-invalid={Boolean(errors.rut)}
              aria-describedby={errors.rut ? 'rut-error' : undefined}
              placeholder="RUT*"
              required
              defaultValue={contact.rut}
            />
            {fieldError('rut')}
          </label>
          <label>
            <span className="sr-only">Teléfono</span>
            <input
              name="phone"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              placeholder="Teléfono*"
              type="tel"
              required
              defaultValue={contact.phone}
              autoComplete="tel"
            />
            {fieldError('phone')}
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
            <select
              name="commune"
              aria-invalid={Boolean(errors.commune)}
              aria-describedby={errors.commune ? 'commune-error' : undefined}
              required
            >
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
            {fieldError('commune')}
          </label>
          <label>
            <span className="sr-only">Calle</span>
            <input
              name="street"
              aria-invalid={Boolean(errors.street)}
              aria-describedby={errors.street ? 'street-error' : undefined}
              placeholder="Calle*"
              required
              autoComplete="address-line1"
            />
            {fieldError('street')}
          </label>
          <label>
            <span className="sr-only">Número</span>
            <input
              name="number"
              aria-invalid={Boolean(errors.number)}
              aria-describedby={errors.number ? 'number-error' : undefined}
              placeholder="Número*"
              id="street-number"
              required={!noNumber}
              disabled={noNumber}
            />
            {fieldError('number')}
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
              aria-invalid={Boolean(errors.unit)}
              aria-describedby={errors.unit ? 'unit-error' : undefined}
              placeholder="Depto/ofic/casa (opcional)"
              autoComplete="address-line2"
            />
            {fieldError('unit')}
          </label>
          <label>
            <span className="sr-only">Código postal (opcional)</span>
            <input
              name="postalCode"
              aria-invalid={Boolean(errors.postalCode)}
              aria-describedby={
                errors.postalCode ? 'postalCode-error' : undefined
              }
              placeholder="Código postal (opcional)"
              autoComplete="postal-code"
            />
            {fieldError('postalCode')}
          </label>
          <label className="wide">
            <span className="sr-only">
              Indicaciones para la entrega (opcional)
            </span>
            <textarea
              name="instructions"
              aria-invalid={Boolean(errors.instructions)}
              aria-describedby={
                errors.instructions ? 'instructions-error' : undefined
              }
              rows={5}
              placeholder="Indicaciones para la entrega (opcional)"
            ></textarea>
            {fieldError('instructions')}
          </label>
        </div>
      </section>
    </form>
  );
}
