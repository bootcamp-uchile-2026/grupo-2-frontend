import { useState } from 'react';
import { productImages } from '../data/productImages';

export function ProductImage({
  name,
  className = '',
  priority = false,
}: {
  name: string;
  className?: string;
  priority?: boolean;
}) {

  const [failed, setFailed] = useState(false);
  const image = productImages[name];

  return (
    <div className={`placeholder product-photo ${className}`.trim()}>
      {image && !failed ? (
        <img
          src={image.src}
          alt={image.alt}
          width={960}
          height={960}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="product-photo-fallback">Imagen no disponible</span>
      )}
    </div>
  );
}
