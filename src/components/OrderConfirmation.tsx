import { Link } from 'react-router-dom';
import type { Order } from '../store/account';

export function OrderConfirmation({
  order,
  registered,
  notify,
}: {
  order: Order;
  registered: boolean;
  notify: (message: string) => void;
}) {

  async function copyCode() {

    try {
      await navigator.clipboard.writeText(order.id);

      notify('Código copiado');
    } catch {
      notify('Puedes seleccionar y copiar el código de despacho');
    }
  }

  return (
    <section
      className="purchase-success"
      aria-labelledby="purchase-success-title"
    >
      <h1 id="purchase-success-title">
        ¡Tu solicitud de compra se ha
        <br className="confirmation-title-break" /> realizado con éxito!
      </h1>
      <p className="purchase-success-message">
        Registramos tu solicitud con el correo{' '}
        <strong>{order.contact.email}</strong>.<br />
        Compra de demostración: no se realizan cobros ni se envían correos.
      </p>
      <div className="confirmation-cards">
        <article>
          <h2>Método de Pago</h2>
          <p>{order.payment}</p>
        </article>
        <article>
          <h2>Dirección</h2>
          <p>{order.address}</p>
        </article>
        <article>
          <h2>Fecha de entrega</h2>
          <p>
            {order.delivery}
            <small>Fecha estimada</small>
          </p>
        </article>
      </div>
      <details className="confirmation-details">
        <summary>Ver datos del pedido y Puntos Verdes</summary>
        <p className="shipment-number">
          <strong>Código de despacho:</strong>
          <code>{order.id}</code>
          <button
            className="copy-shipment"
            aria-label="Copiar código de despacho"
            onClick={copyCode}
          >
            ⧉
          </button>
        </p>
        <p>Sumaste {order.points} Puntos Verdes.</p>
        <div className="modal-actions">
          {registered && (
            <Link className="btn" to={`/mi-cuenta/compras/${order.id}`}>
              Ver mi pedido
            </Link>
          )}
          <Link className="btn outline" to="/">
            Volver al inicio
          </Link>
        </div>
      </details>
    </section>
  );
}
