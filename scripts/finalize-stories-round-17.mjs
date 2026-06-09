import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sourceDir =
  'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3';
const outDir = 'public/stories';

const jobs = [
  {
    src: 'ig_0fa2a6bfeaff36c9016a27354505c48191b33096a1d25487bf.png',
    out: 'el_vendedor_de_idolos.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a273655b82c8191b738a95352cd74e2.png',
    out: 'la_lampara_orgullosa.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a273886608481918e827b0ecc4ddf16.png',
    out: 'la_mula_vanidosa.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a27394736f88191adc6447066198de9.png',
    out: 'el_caballo_y_el_soldado.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a2739fc60348191b9fba244518adca8.png',
    out: 'el_ciervo_y_la_vina.webp',
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
