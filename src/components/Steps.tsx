export function Steps({ active }: { active: number }) {

  return (
    <div className="steps">
      {['Tu Carrito', 'Resumen de tu compra', 'Confirmación de tu compra'].map(
        (text, i) => (
          <div
            key={text}
            className={`step${active === i ? ' active' : ''}${i < active ? ' complete' : ''}`}
            aria-current={active === i ? 'step' : undefined}
          >
            <i>{i + 1}</i>
            <span>{text}</span>
          </div>
        ),
      )}
    </div>
  );
}
