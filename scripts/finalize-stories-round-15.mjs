import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sourceDir =
  'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3';
const outDir = 'public/stories';

const jobs = [
  {
    src: 'ig_0fa2a6bfeaff36c9016a26361a99d481919da35648a050c541.png',
    out: 'el_pescador_que_tocaba_la_flauta.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a26370baf3c81919efcf81549737410.png',
    out: 'el_lobo_y_el_pastor.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a2637cb86fc8191a100cfe3cd0761a9.png',
    out: 'el_pastor_y_las_ovejas_salvajes.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a263bb98a9c81918d2a0a5bf009b268.png',
    out: 'la_zorra_y_el_erizo.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a263d0e792c819187cf4e4c6ba8fc2f.png',
    out: 'los_bueyes_y_el_eje.webp',
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
