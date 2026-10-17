import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const project = new URL('../', import.meta.url);
const manifest = JSON.parse(
  await fs.readFile(
    new URL('product-photo-sources.json', import.meta.url),
    'utf8',
  ),
);
const directory = new URL('public/img/products/', project);
await fs.mkdir(directory, { recursive: true });
const photos = [
  ...new Map(manifest.photos.map((photo) => [photo.id, photo])).values(),
];
const failures = [];
let next = 0;

async function download() {
  while (next < photos.length) {
    const photo = photos[next++];
    const target = new URL(`${photo.id}.jpg`, directory);
    try {
      try {
        if ((await fs.stat(target)).size > 1000) continue;
      } catch {
        /* Not downloaded yet. */
      }
      const response = await fetch(
        `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=960`,
        { signal: AbortSignal.timeout(30000) },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.headers.get('content-type')?.startsWith('image/'))
        throw new Error('Invalid image response');
      const data = Buffer.from(await response.arrayBuffer());
      if (data.length < 1000) throw new Error('Empty image');
      await fs.writeFile(target, data);
      console.log(`${photo.id}: ${Math.round(data.length / 1024)} KB`);
    } catch (error) {
      failures.push({ id: photo.id, error: String(error) });
    }
  }
}

await Promise.all(Array.from({ length: 5 }, () => download()));
if (failures.length) {
  console.error(JSON.stringify(failures));
  process.exitCode = 1;
} else {
  const images = Object.fromEntries(
    manifest.photos.map((photo) => [
      photo.name,
      { src: photo.file, alt: `${photo.name}, fotografía ilustrativa.` },
    ]),
  );
  images['Bolsa reutilizable'] = images['Tote Bag Lima'];
  await fs.writeFile(
    new URL('src/data/productImages.ts', project),
    `export const productImages: Record<string, { src: string; alt: string }> = ${JSON.stringify(images, null, 2)};\n`,
  );
  console.log(
    `Listas ${photos.length} fotografías en ${fileURLToPath(directory)}`,
  );
}
