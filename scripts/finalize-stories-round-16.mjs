import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sourceDir =
  'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3';
const outDir = 'public/stories';

const jobs = [
  {
    src: 'ig_0fa2a6bfeaff36c9016a2725b45d9081919e4ddcf89496893f.png',
    out: 'el_gato_y_el_gallo.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a272654ad3081918b24ab413db10d84.png',
    out: 'el_camello_visto_por_primera_vez.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a2727056fc4819198e46395f0a6830c.png',
    out: 'el_hombre_y_la_estatua.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a2727d3d6c88191a1539d0efabeb052.png',
    out: 'el_herrero_y_su_perro.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a272955127081918bde09da7641ab86.png',
    out: 'el_pez_grande_y_los_peces_pequenos.webp',
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
