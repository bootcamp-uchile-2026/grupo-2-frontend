import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAccount } from '../store/account';
import { useCart } from '../store/cart';
import { money, productLabels } from '../data/products';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { ProductImage } from '../components/ProductImage';

export function Account() {

  const { section = 'compras', orderId } = useParams();
  const { user, orders, updateProfile, changePassword } = useAccount();
  const { notify } = useCart();
  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [help, setHelp] = useState(false);
  const [helpSaved, setHelpSaved] = useState(false);
  const ownOrders = orders.filter((order) => order.owner === user?.id);
  const selectedOrder = ownOrders.find((order) => order.id === orderId);

  function saveProfile(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    const data = new FormData(event.currentTarget);

    updateProfile({
      name: String(data.get('name')).trim(),
      lastName: String(data.get('lastName')).trim(),
      phone: String(data.get('phone')),
      rut: String(data.get('rut')),
      address: String(data.get('address')),
    });

    setEditing(false);

    notify('Tus datos se actualizaron');
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    const data = new FormData(event.currentTarget);

    setError('');

    if (data.get('next') !== data.get('confirm')) {
      setError('Las contraseñas no coinciden.');

      return;
    }

    setBusy(true);

    try {
      await changePassword(
        String(data.get('current')),
        String(data.get('next')),
      );

      setPasswordOpen(false);

      notify('Tu contraseña se actualizó');
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No pudimos cambiar tu contraseña.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (!user) return <Navigate to="/acceso" replace />;

  if (!['compras', 'puntos-verdes', 'datos-personales'].includes(section))
    return (
      <EmptyState
        title="Página no encontrada"
        description="Puedes volver a tu cuenta para continuar."
        to="/mi-cuenta/compras"
        action="Ir a mi cuenta"
      />
    );

  return (
    <main className="account-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> › Mi cuenta
      </div>
      <h1>Hola, {user.name}</h1>
      <nav className="account-tabs" aria-label="Mi cuenta">
        {[
          ['compras', 'Mis compras'],
          ['puntos-verdes', 'Puntos Verdes'],
          ['datos-personales', 'Datos personales'],
        ].map(([path, label]) => (
          <Link
            key={path}
            className={section === path ? 'active' : ''}
            to={`/mi-cuenta/${path}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {section === 'compras' && (
        <>
          <h2>Mis compras</h2>
          {orderId ? (
            selectedOrder ? (
              <>
                <Link className="text-link" to="/mi-cuenta/compras">
                  ← Volver a mis compras
                </Link>
                <section className="panel">
                  <h2>Detalle del pedido</h2>
                  <p className="order-code">{selectedOrder.id}</p>
                  <p>
                    Realizado el{' '}
                    {new Date(selectedOrder.date).toLocaleDateString('es-CL')}
                  </p>
                  {selectedOrder.items.map((item, i) => (
                    <div className="order-item" key={i}>
                      <ProductImage name={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        <p>
                          {item.qty} unidad(es) · {productLabels(item).size}:{' '}
                          {item.size} · Color: {item.color}
                        </p>
                        <strong>{money(item.qty * item.price)}</strong>
                      </div>
                    </div>
                  ))}
                  <div className="summary-row">
                    <span>Total</span>
                    <strong>{money(selectedOrder.total)}</strong>
                  </div>
                  <p>Método de pago: {selectedOrder.payment}</p>
                  <p>Dirección: {selectedOrder.address}</p>
                </section>
                <section className="panel">
                  <h2>Estado del pedido</h2>
                  <strong>{selectedOrder.status}</strong>
                  <h3>Seguimiento del envío</h3>
                  <ol className="tracking-list">
                    <li className="active">Pedido recibido</li>
                    <li>Preparación pendiente</li>
                    <li>Despacho pendiente</li>
                    <li>Entrega pendiente</li>
                  </ol>
                  <p>Entrega estimada: {selectedOrder.delivery}</p>
                  <p>
                    El seguimiento corresponde a una compra de demostración.
                  </p>
                </section>
                <section className="panel">
                  <h2>Necesito ayuda</h2>
                  <p>Cuéntanos qué ocurre con tu pedido.</p>
                  <button
                    className="btn"
                    onClick={() => {

                      setHelp(true);

                      setHelpSaved(false);
                    }}
                  >
                    Solicitar ayuda
                  </button>
                </section>
              </>
            ) : (
              <EmptyState
                title="Pedido no encontrado"
                description="No encontramos este pedido en tu cuenta."
                to="/mi-cuenta/compras"
                action="Volver a mis compras"
              />
            )
          ) : ownOrders.length ? (
            <div className="order-list">
              {ownOrders.toReversed().map((order) => (
                <article className="panel" key={order.id}>
                  <p>{new Date(order.date).toLocaleDateString('es-CL')}</p>
                  <h3>{order.items[0]?.name}</h3>
                  <p>
                    {order.status} · {money(order.total)}
                  </p>
                  <Link className="btn" to={`/mi-cuenta/compras/${order.id}`}>
                    Ver detalle y seguimiento
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Todavía no tienes compras"
              description="Cuando completes una compra, podrás consultar aquí sus detalles y seguimiento."
            />
          )}
        </>
      )}
      {section === 'puntos-verdes' && (
        <>
          <h2>Tu impacto está creciendo</h2>
          <p>Tus compras conscientes suman Puntos Verdes.</p>
          <section className="panel points-panel">
            <strong>{user.points.toLocaleString('es-CL')} pts</strong>
            <h3>Puntos Verdes disponibles</h3>
            <p>Disponibles para canjear en tus compras de demostración.</p>
          </section>
          <h2>¿Cómo has sumado tus puntos?</h2>
          {ownOrders.length ? (
            ownOrders.map((order) => (
              <div className="summary-row" key={order.id}>
                <span>{order.items[0]?.name}</span>
                <strong>+{order.points} pts</strong>
              </div>
            ))
          ) : (
            <p>Aún no has sumado puntos por compras.</p>
          )}
        </>
      )}
      {section === 'datos-personales' && (
        <>
          <h2>Datos personales</h2>
          {editing ? (
            <form className="account-form panel" onSubmit={saveProfile}>
              <label>
                Nombre
                <input
                  name="name"
                  required
                  defaultValue={user.name}
                  autoComplete="given-name"
                />
              </label>
              <label>
                Apellido
                <input
                  name="lastName"
                  defaultValue={user.lastName}
                  autoComplete="family-name"
                />
              </label>
              <label>
                Teléfono
                <input
                  name="phone"
                  type="tel"
                  defaultValue={user.phone}
                  autoComplete="tel"
                />
              </label>
              <label>
                RUT
                <input name="rut" defaultValue={user.rut} />
              </label>
              <label>
                Dirección
                <input
                  name="address"
                  defaultValue={user.address}
                  autoComplete="street-address"
                />
              </label>
              <div className="modal-actions">
                <button
                  className="btn outline"
                  type="button"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </button>
                <button className="btn">Guardar datos</button>
              </div>
            </form>
          ) : (
            <section className="panel">
              <dl className="profile-data">
                <dt>Nombre</dt>
                <dd>
                  {user.name} {user.lastName}
                </dd>
                <dt>Correo</dt>
                <dd>{user.email}</dd>
                <dt>Teléfono</dt>
                <dd>{user.phone || 'Sin agregar'}</dd>
                <dt>RUT</dt>
                <dd>{user.rut || 'Sin agregar'}</dd>
                <dt>Dirección</dt>
                <dd>{user.address || 'Sin agregar'}</dd>
              </dl>
              <div className="modal-actions">
                <button className="btn" onClick={() => setEditing(true)}>
                  Editar datos
                </button>
                {!user.provider && (
                  <button
                    className="btn outline"
                    onClick={() => {

                      setPasswordOpen(true);

                      setError('');
                    }}
                  >
                    Cambiar contraseña
                  </button>
                )}
              </div>
            </section>
          )}
        </>
      )}
      {passwordOpen && (
        <Modal
          title="Cambiar contraseña"
          onClose={() => setPasswordOpen(false)}
        >
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <form className="account-form" onSubmit={savePassword}>
            <label>
              Contraseña actual
              <input
                name="current"
                type="password"
                required
                autoComplete="current-password"
              />
            </label>
            <label>
              Nueva contraseña
              <input
                name="next"
                type="password"
                required
                autoComplete="new-password"
              />
            </label>
            <small>Al menos 8 caracteres, una letra y un número.</small>
            <label>
              Repite la nueva contraseña
              <input
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
              />
            </label>
            <button className="btn" disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar contraseña'}
            </button>
          </form>
        </Modal>
      )}
      {help && (
        <Modal title="Ayuda con tu pedido" onClose={() => setHelp(false)}>
          {helpSaved ? (
            <p role="status">
              Tu solicitud de demostración quedó guardada en este dispositivo.
              No se ha enviado a un equipo de soporte.
            </p>
          ) : (
            <form
              className="account-form"
              onSubmit={(event) => {

                event.preventDefault();

                const data = new FormData(event.currentTarget);
                const stored = JSON.parse(
                  localStorage.getItem('eco-help') || '[]',
                );

                localStorage.setItem(
                  'eco-help',
                  JSON.stringify([
                    ...stored,
                    {
                      order: orderId,
                      message: data.get('message'),
                      reason: data.get('reason'),
                      date: new Date().toISOString(),
                    },
                  ]),
                );

                setHelpSaved(true);
              }}
            >
              <label>
                ¿Qué necesitas?
                <select name="reason">
                  <option>Estado del pedido</option>
                  <option>Problema con mi compra</option>
                  <option>Cambio o devolución</option>
                </select>
              </label>
              <label>
                Describe tu consulta
                <textarea name="message" required rows={4} />
              </label>
              <button className="btn">Guardar solicitud de prueba</button>
            </form>
          )}
        </Modal>
      )}
    </main>
  );
}
