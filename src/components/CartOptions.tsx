import { productLabels } from '../data/products';
import { useCart } from '../store/cart';

export function CartOptions({ index }: { index: number }) {

  const { cart } = useCart();
  const item = cart[index];
  const labels = productLabels(item);

  return (
    <dl className="cart-variant-options">
      {(['size', 'color'] as const).map((field) => (
        <div key={field}>
          <dt>{labels[field]}:</dt>
          <dd>{item[field]}</dd>
        </div>
      ))}
    </dl>
  );
}
