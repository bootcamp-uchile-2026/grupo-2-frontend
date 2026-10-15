import { OrderConfirmation } from '../components/OrderConfirmation';
import { ProductImage } from '../components/ProductImage';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/cart';
import { useAccount } from '../store/account';
import type { Order } from '../store/account';
import { money, productLabels } from '../data/products';
import { Steps } from '../components/Steps';
import { ShippingForm } from './ShippingForm';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import './Checkout.css';

function estimatedDelivery() {

  const date = new Date();
  let days = 0;

  while (days < 5) {
    date.setDate(date.getDate() + 1);

    if (date.getDay() !== 0 && date.getDay() !== 6) days++;
  }

  return date.toLocaleDateString('es-CL', {
    timeZone: 'America/Santiago',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function Checkout() {

  const { cart, setCart, total, notify } = useCart();
  const { user, placeOrder } = useAccount();
  const [noNumber, setNoNumber] = useState(false);
  const [shipment, setShipment] = useState('');
  const [payment, setPayment] = useState('');
  const [pending, setPending] = useState<Order | null>(null);
  const [paymentError, setPaymentError] = useState('');
  const [decline, setDecline] = useState(false);
  const [completed, setCompleted] = useState<Order | null>(null);
  const earnedPoints = Math.floor(total / 100);

  function confirm(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    if (!cart.length) {
      notify('Tu carrito está vacío');

      return;
    }

    if (
      cart.some(
        (item) => item.size === 'Por elegir' || item.color === 'Por elegir',
      )
    ) {
      notify('Elige talla y color en el carrito antes de continuar');

      return;
    }

    if (!payment) {
      setPaymentError('Selecciona un método de pago para continuar.');

      return;
    }

    if (payment === 'Puntos Verdes' && (!user || user.points < total)) {
      setPaymentError(
        'No tienes suficientes Puntos Verdes para pagar esta compra. Elige otro método de pago.',
      );

      return;
    }

    const data = new FormData(event.currentTarget);
    const address = `${data.get('street')} ${noNumber ? 's/n' : data.get('number')}${data.get('unit') ? ', ' + data.get('unit') : ''}, ${data.get('commune')}`;

    setPending({
      id: crypto.randomUUID(),
      owner: user?.id || null,
      date: new Date().toISOString(),
      items: cart.map((item) => ({ ...item })),
      total,
      points: earnedPoints,
      payment,
      address,
      delivery: estimatedDelivery(),
      status: 'Pedido recibido',
      contact: {
        name: `${data.get('firstName')} ${data.get('lastName')}`,
        email: String(data.get('email')),
      },
    });
  }

  function pay() {

    if (!pending) return;

    if (decline) {
      setPending(null);

      setPaymentError(
        'No pudimos procesar tu pago. Tu carrito se conserva: prueba nuevamente o elige otro método.',
      );

      return;
    }

    placeOrder(pending);

    setCompleted(pending);

    setShipment(pending.id);

    setCart([]);

    setPending(null);
  }

  if (!cart.length && !shipment)
    return (
      <main className="checkout-page">
        <Steps active={1} />
        <EmptyState
          title="Tu carrito está vacío"
          description="Agrega un producto antes de continuar con el pago."
        />
      </main>
    );

  return (
    <div
      className={
        shipment ? 'checkout-flow checkout-flow-confirmed' : 'checkout-flow'
      }
    >
      {!shipment && (
        <div className="breadcrumbs">
          <Link to="/">Home</Link> › <Link to="/carrito">Carrito</Link> ›
          Resumen
        </div>
      )}
      <Steps active={shipment ? 2 : 1} />
      <main className="checkout-page">
        {shipment ? (
          completed && (
            <OrderConfirmation
              order={completed}
              registered={Boolean(user)}
              notify={notify}
            />
          )
        ) : (
          <>
            <h1>Resumen de tu compra</h1>
            <section className="checkout-items">
              {cart.map((item, i) => (
                <div className="order-item" key={i}>
                  <ProductImage name={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {item.qty} unidad(es) · {productLabels(item).size}:{' '}
                      {item.size} · {productLabels(item).color}: {item.color}
                    </p>
                    <strong>{money(item.price * item.qty)}</strong>
                  </div>
                </div>
              ))}
            </section>
            <ShippingForm
              confirm={confirm}
              noNumber={noNumber}
              setNoNumber={setNoNumber}
              contact={{
                name: user?.name || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phone: user?.phone || '',
                rut: user?.rut || '',
              }}
            />
            <div className="checkout-payment-grid">
              <section className="checkout-payment">
                <div className="payment-method-panel">
                  <h2>Método de Pago</h2>
                  <div className="payment-options">
                    {[
                      'Tarjeta de crédito',
                      'Tarjeta de débito',
                      'PayPal',
                      'Puntos Verdes',
                    ].map((method) => (
                      <label key={method}>
                        <input
                          type="radio"
                          name="pay"
                          value={method}
                          checked={payment === method}
                          onChange={() => setPayment(method)}
                        />
                        {method === 'Puntos Verdes'
                          ? 'Canjear tus Puntos Verdes'
                          : method}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="points-preview">
                  <strong>{earnedPoints} pts</strong>
                  <span className="points-brand">🍃 Puntos Verdes</span>
                </div>
                <details className="demo-details">
                  <summary>Probar un error de pago</summary>
                  <label>
                    <input
                      type="checkbox"
                      checked={decline}
                      onChange={(e) => setDecline(e.target.checked)}
                    />{' '}
                    Simular un pago rechazado
                  </label>
                </details>
              </section>
              <section className="checkout-summary">
                <div className="checkout-coupon">
                  <label htmlFor="checkout-coupon">
                    ¿Tienes un cupón de descuento?
                  </label>
                  <div>
                    <span aria-hidden="true">▦</span>
                    <input
                      id="checkout-coupon"
                      placeholder="Ingresa tu cupón"
                    />
                  </div>
                </div>
                <h2>Resumen de la compra</h2>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{money(total)}</strong>
                </div>
                <div className="summary-row">
                  <span>Cupón de descuento</span>
                  <span>$0</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total a pagar</span>
                  <strong>{money(total)}</strong>
                </div>
                <button
                  className="btn confirm-order"
                  type="submit"
                  form="checkout-form"
                >
                  Confirmar y pagar
                </button>
                <Link className="btn secondary back-to-cart" to="/carrito">
                  Volver al carrito
                </Link>
              </section>
            </div>
          </>
        )}
        {pending && (
          <Modal
            title="Por favor, confirma tus datos antes de continuar"
            onClose={() => setPending(null)}
          >
            <div className="confirmation-grid">
              <section>
                <h3>Método de pago</h3>
                <p>{pending.payment}</p>
              </section>
              <section>
                <h3>Dirección</h3>
                <p>{pending.address}</p>
              </section>
              <section>
                <h3>Fecha de entrega</h3>
                <p>{pending.delivery}</p>
                <small>Fecha estimada</small>
              </section>
            </div>
            <p>
              {pending.contact.name} · {pending.contact.email}
            </p>
            <p>
              Total: <strong>{money(pending.total)}</strong>
            </p>
            <p className="demo-notice">
              Compra de demostración. No se realizará ningún cobro.
            </p>
            <div className="modal-actions">
              <button className="btn outline" onClick={() => setPending(null)}>
                Editar datos
              </button>
              <button className="btn" onClick={pay}>
                Confirmar
              </button>
            </div>
          </Modal>
        )}
        {paymentError && (
          <Modal
            title="Error de método de pago"
            onClose={() => setPaymentError('')}
          >
            <p role="alert">{paymentError}</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setPaymentError('')}>
                Revisar método de pago
              </button>
              <Link className="btn outline" to="/carrito">
                Volver al carrito
              </Link>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
}
