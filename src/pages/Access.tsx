import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAccount } from '../store/account';

export function Login() {

  const [params] = useSearchParams();
  const requested = params.get('continuar');
  const destination =
    requested === '/checkout' ? '/checkout' : '/mi-cuenta/compras';

  return (
    <main className="auth-layout">
      <div className="auth-forest" role="img" aria-label="Bosque verde" />
      <div className="account-page auth-page">
        <img
          className="auth-logo"
          src="/img/figma/login-imgLogoCompletoBuenOrigen3.png"
          alt="Buen Origen"
        />
        <AuthForm destination={destination} />
      </div>
    </main>
  );
}

export function Recovery() {

  const [email, setEmail] = useState('');
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { recover } = useAccount();
  const [params] = useSearchParams();

  async function submit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();

    const data = new FormData(event.currentTarget);

    setError('');

    if (!stage) {
      setEmail(String(data.get('email')));

      setStage(1);

      return;
    }

    if (data.get('code') !== '123456') {
      setError(
        'El código de recuperación es incorrecto. Inténtalo nuevamente.',
      );

      return;
    }

    if (data.get('password') !== data.get('confirm')) {
      setError('Las contraseñas no coinciden.');

      return;
    }

    setBusy(true);

    try {
      await recover(email, String(data.get('password')));

      setStage(2);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'No pudimos recuperar tu cuenta.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-layout">
      <div className="auth-forest" role="img" aria-label="Bosque verde" />
      <div className="account-page auth-page">
        <img
          className="auth-logo"
          src="/img/figma/login-imgLogoCompletoBuenOrigen3.png"
          alt="Buen Origen"
        />
        <h1>{stage === 2 ? 'Contraseña actualizada' : 'Recupera tu cuenta'}</h1>
        {stage === 2 ? (
          <>
            <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <Link
              className="btn"
              to={`/acceso?continuar=${encodeURIComponent(params.get('continuar') || '')}`}
            >
              Volver a iniciar sesión
            </Link>
          </>
        ) : (
          <>
            <p>
              {stage
                ? `Ingresa el código de recuperación para ${email}.`
                : 'Ingresa el correo con el que creaste tu cuenta.'}
            </p>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <form className="account-form" onSubmit={submit}>
              {!stage ? (
                <label>
                  Correo electrónico
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </label>
              ) : (
                <>
                  <p className="demo-notice">
                    Recuperación de demostración: usa el código 123456. Este
                    prototipo no envía correos.
                  </p>
                  <label>
                    Código de recuperación
                    <input
                      name="code"
                      required
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                  </label>
                  <label>
                    Nueva contraseña
                    <input
                      name="password"
                      type="password"
                      required
                      autoComplete="new-password"
                    />
                  </label>
                  <small>Al menos 8 caracteres, una letra y un número.</small>
                  <label>
                    Repite la contraseña
                    <input
                      name="confirm"
                      type="password"
                      required
                      autoComplete="new-password"
                    />
                  </label>
                </>
              )}
              <button className="btn" disabled={busy}>
                {busy
                  ? 'Actualizando…'
                  : stage
                    ? 'Actualizar contraseña'
                    : 'Continuar'}
              </button>
            </form>
            {stage === 1 && (
              <button
                className="text-link"
                onClick={() => {

                  setStage(0);

                  setError('');
                }}
              >
                Usar otro correo
              </button>
            )}
            <Link className="text-link" to="/acceso">
              Volver a iniciar sesión
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
