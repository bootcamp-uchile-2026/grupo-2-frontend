import { useState } from 'react';
import { useAccount, demoAccountSummary } from '../store/account';

export function WelcomeBanner() {

  const [visible, setVisible] = useState(true);
  const { user } = useAccount();
  const account = user ?? demoAccountSummary;

  if (!visible) return null;

  return (
    <div className="toast show welcome-toast" role="status">
      {`¡Bienvenido, ${account.name}! Tienes ${account.points.toLocaleString('es-CL')} Puntos Verdes disponibles.`}
      <button aria-label="Cerrar bienvenida" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
}
