import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount, demoCredentials, passwordValid } from '../store/account';
import { useCart } from '../store/cart';
import { Modal } from './Modal';

export function AuthForm({
  destination = '/mi-cuenta/compras',
  guest = false,
}: {
  destination?: string;
  guest?: boolean;
}) {

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState('');
  const { login, register, socialLogin } = useAccount();
  const { notify } = useCart();
  const navigate = useNavigate();

  async function submit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const password = String(data.get('password'));

    if (creating && !passwordValid(password)) {
      setError(
        'Contraseña inválida. Usa al menos 8 caracteres, una letra y un número.',
      );

      return;
    }

    if (creating && password !== data.get('confirm')) {
      setError('Las contraseñas no coinciden.');

      return;
    }

    setBusy(true);

    setError('');

    try {
      const profile = creating
        ? await register(
            String(data.get('name')),
            String(data.get('email')),
            password,
          )
        : await login(String(data.get('email')), password);

      notify(
        `¡Bienvenida, ${profile.name}! Tienes ${profile.points.toLocaleString('es-CL')} Puntos Verdes disponibles.`,
      );

      navigate(destination);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No pudimos acceder a tu cuenta. Inténtalo nuevamente.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1>{creating ? 'Crea tu cuenta' : 'Iniciar Sesión'}</h1>
      <p>
        {creating ? 'Es gratis y sencillo' : 'Introduce los datos de la cuenta'}
      </p>
      {error && (
        <div className="form-error" role="alert">
          <strong>No pudimos continuar</strong>
          <p>{error}</p>
        </div>
      )}
      <form className="account-form" onSubmit={submit}>
        {creating && (
          <label>
            Nombre
            <input
              name="name"
              required
              autoComplete="given-name"
              maxLength={80}
            />
          </label>
        )}
        <label>
          Correo electrónico
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Escribe tu correo electrónico"
          />
        </label>
        <label>
          Contraseña
          <input
            placeholder="Escribe tu contraseña"
            name="password"
            type="password"
            required
            autoComplete={creating ? 'new-password' : 'current-password'}
            aria-describedby={creating ? 'password-help' : undefined}
          />
        </label>
        {creating && (
          <>
            <small id="password-help">
              Al menos 8 caracteres, una letra y un número.
            </small>
            <label>
              Repite tu contraseña
              <input
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
              />
            </label>
          </>
        )}
        <button className="btn" disabled={busy} type="submit">
          {busy ? 'Procesando…' : creating ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </form>
      <Link
        className="text-link"
        to={`/recuperar-cuenta?continuar=${encodeURIComponent(destination)}`}
      >
        ¿Olvidaste tu contraseña?
      </Link>
      <div className="auth-divider">
        <span>o hazlo a través de otras cuentas</span>
      </div>
      <div className="social-login">
        {['Google', 'Apple', 'Facebook'].map((name) => (
          <button
            key={name}
            className="btn outline"
            onClick={() => setProvider(name)}
          >
            <img
              src={`/img/figma/login-${name === 'Google' ? 'imgSearch1' : name === 'Apple' ? 'imgVector' : 'imgVector1'}.svg`}
              alt={name}
            />
          </button>
        ))}
      </div>
      <div className="auth-secondary-actions">
        <button
          className="text-link"
          onClick={() => {

            setCreating(!creating);

            setError('');
          }}
        >
          {creating ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
        </button>
        {guest && (
          <button
            className="btn secondary"
            onClick={() => navigate('/checkout')}
          >
            Continuar como invitado
          </button>
        )}
      </div>
      <details className="demo-details">
        <summary>Probar con una cuenta de demostración</summary>
        <p>
          Correo: {demoCredentials.email}
          <br />
          Contraseña: {demoCredentials.password}
        </p>
      </details>
      {provider && (
        <Modal
          title={`Continuar con ${provider}`}
          onClose={() => setProvider('')}
        >
          <p>
            Este acceso es una demostración del prototipo. No se conectará con
            tu cuenta real de {provider}.
          </p>
          <div className="modal-actions">
            <button className="btn outline" onClick={() => setProvider('')}>
              Cancelar
            </button>
            <button
              className="btn"
              onClick={() => {

                socialLogin(provider);

                setProvider('');

                notify(`Accediste con la cuenta de prueba de ${provider}`);

                navigate(destination);
              }}
            >
              Usar cuenta de prueba
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
