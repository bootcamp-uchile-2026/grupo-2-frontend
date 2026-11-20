export function Pagination({ page, pages, onChange, label, }: { page: number; pages: number; onChange: (page: number) => void; label: string; }) {

  if (pages <= 1) return null;

  return (
    <nav className="pagination" aria-label={label}>
      <button
        className="btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      <span aria-live="polite">
        Página {page} de {pages}
      </span>
      <button
        className="btn"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}
