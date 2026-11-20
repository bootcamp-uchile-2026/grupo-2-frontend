import { hitoAsset } from '../data/hito3';
import { cartFootprint } from '../store/cart';
import type { CartItem } from '../store/cart';

export function GreenFootprint({ items }: { items: CartItem[] }) {

  const { co2, points } = cartFootprint(items);

  return (
    <aside className="hito-footprint" aria-label="Tu Huella Verde">
      <h2>Tu Huella Verde</h2>
      <div className="hito-footprint-cards">
        <div>
          <img src={hitoAsset('cloud.svg')} alt="" />
          <strong>
            {co2 === null
              ? 'Sin estimación'
              : co2.toLocaleString('es-CL', { maximumFractionDigits: 2 }) +
                ' kg'}
          </strong>
          <span>CO₂ ahorrado</span>
          <small>Impacto ambiental estimado</small>
        </div>
        <div>
          <img src={hitoAsset('leaf.svg')} alt="" />
          <strong>+{points.toLocaleString('es-CL')}</strong>
          <span>Puntos Verdes</span>
          <small>Que acumulas con esta compra</small>
        </div>
      </div>
    </aside>
  );
}
