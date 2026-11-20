import { useState } from 'react';
import { findProductImage } from '../data/productImages';

export function ProductImage({ name, className = '', priority = false, source, category, productId, }: { name: string; className?: string; priority?: boolean; source?: string; category?: string; productId?: number; }) {

  const [failedSource, setFailedSource] = useState<string>();
  const image = source
    ? { src: source, alt: name }
    : findProductImage(name, category, productId);
  const illustrative = image && 'reference' in image;
  const src = image?.src;

  return (
    <div className={`placeholder product-photo ${className}`.trim()}>
      {src && failedSource !== src ? (
        <>
          <img
            src={src}
            alt={image?.alt}
            width={960}
            height={960}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setFailedSource(src)}
          />
          {illustrative && (
            <span className="product-photo-reference">Foto ilustrativa</span>
          )}
        </>
      ) : (
        <span className="product-photo-fallback">Imagen no disponible</span>
      )}
    </div>
  );
}
