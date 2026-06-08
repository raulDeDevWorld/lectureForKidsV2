import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sourceDir =
  'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3';
const outDir = 'public/stories';

const jobs = [
  {
    src: 'ig_0fa2a6bfeaff36c9016a260afc53b08191b91b286ab4784ed8.png',
    out: 'el_leon_enamorado.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a260b4decf081918309a69d95d029f9.png',
    out: 'la_zorra_y_la_mascara.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a260b937f908191ba7011730c9affe8.png',
    out: 'la_zorra_y_el_mono_rey.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a260bf725208191b4e26558bba37854.png',
    out: 'el_mono_y_el_camello.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a260c5816ac81919d44c0829546a459.png',
    out: 'el_carbonero_y_el_lavandero.webp',
  },
];

await mkdir(outDir, { recursive: true });

for (const job of jobs) {
  const input = `${sourceDir}/${job.src}`;
  const output = `${outDir}/${job.out}`;
  await sharp(input)
    .resize(1000, 750, { fit: 'cover', position: 'center' })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);
  console.log(`${job.out}`);
}
