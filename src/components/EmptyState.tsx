import { Link } from 'react-router-dom';

export function EmptyState({ title, description, to = '/productos/ropa-y-accesorios', action = 'Explorar productos', }: { title: string; description: string; to?: string; action?: string; }) {

  return (
    <section className="empty-state">
      <div className="commitment-icon" aria-hidden="true">
        ⌕
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className="btn" to={to}>
        {action}
      </Link>
    </section>
  );
}
