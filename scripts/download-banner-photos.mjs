import fs from 'node:fs/promises';
import { bannerImages } from '../src/data/bannerImages.ts';

const photos = Object.entries(bannerImages).map(([category, photo]) => ({
  category,
  id: photo.id,
  source:
    photo.source ??
    (photo.src
      ? 'Recurso visual del proyecto'
      : `https://www.pexels.com/photo/${photo.id}/`),
  file: photo.src ?? `/img/banners/${category}.jpg`,
  generated: Boolean(photo.src && !photo.source),
}));

const directory = new URL('../public/img/banners/', import.meta.url);

await fs.mkdir(directory, { recursive: true });

await Promise.all(
  photos.map(async (photo) => {
    if (photo.generated || process.argv.includes('--manifest-only')) return;

    const crop = photo.category === 'limpieza-del-hogar' ? 'bottom' : 'center';

    const response = await fetch(
      photo.category === 'mascotas'
        ? `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=1800&h=600&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.65`
        : `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=1800&h=650&fit=crop&crop=${crop}`,
      { signal: AbortSignal.timeout(45000) },
    );

    if (
      !response.ok ||
      !response.headers.get('content-type')?.startsWith('image/')
    ) {
      throw new Error(`${photo.category}: HTTP ${response.status}`);
    }

    await fs.writeFile(
      new URL(`../public${photo.file}`, import.meta.url),
      Buffer.from(await response.arrayBuffer()),
    );
    console.log(`Descargado: ${photo.category}`);
  }),
);

await fs.writeFile(
  new URL('banner-photo-sources.json', import.meta.url),
  JSON.stringify(
    { license: 'https://www.pexels.com/license/', photos },
    null,
    2,
  ) + '\n',
);
