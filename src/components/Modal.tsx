import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;

    dialog?.focus();

    function keyboard(event: KeyboardEvent) {

      if (event.key === 'Escape') onClose();

      if (event.key !== 'Tab' || !dialog) return;

      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select, textarea, [tabindex="0"]',
        ),
      );
      const first = controls[0];
      const last = controls.at(-1);

      if (!first) {
        event.preventDefault();

        return;
      }

      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();

        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === dialog)
      ) {
        event.preventDefault();

        first.focus();
      }
    }

    document.addEventListener('keydown', keyboard);

    return () => {

      document.removeEventListener('keydown', keyboard);

      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="ux-modal"
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
