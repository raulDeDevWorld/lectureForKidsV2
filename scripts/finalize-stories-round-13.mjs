import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sourceDir =
  'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3';
const outDir = 'public/stories';

const jobs = [
  {
    src: 'ig_0fa2a6bfeaff36c9016a26206ada9881918ca8c64a11c3a77e.png',
    out: 'el_asno_y_el_perrito.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a2620def0748191ab6bbe7d324ea5fd.png',
    out: 'el_asno_y_las_ranas.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a26217592c4819190a234b4baa96038.png',
    out: 'el_muchacho_y_las_ortigas.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a2621f727108191a7414d26d2f8eaf3.png',
    out: 'el_viejo_y_la_muerte.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a2622644dd48191b60ecebe768e5567.png',
    out: 'el_nogal.webp',
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
