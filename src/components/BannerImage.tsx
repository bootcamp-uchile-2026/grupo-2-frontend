import { bannerImages } from '../data/bannerImages';

export function BannerImage({
  category,
  priority = false,
}: {
  category: string;
  priority?: boolean;
}) {

  const photo = bannerImages[category];

  return (
    <img
      className="banner-image"
      src={photo.src ?? `/img/banners/${category}.jpg?v=${photo.id}`}
      alt={photo.alt}
      style={{ objectPosition: photo.position }}
      width={1800}
      height={650}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
