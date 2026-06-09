import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sourceDir =
  'C:/Users/ZBOOK G17/.codex/generated_images/019ea3fe-e7c9-7c52-9677-3ca3bb4547f3';
const outDir = 'public/stories';

const jobs = [
  {
    src: 'ig_0fa2a6bfeaff36c9016a2745d163f08191b61f1fe877365a5f.png',
    out: 'el_abeto_y_la_zarza.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a2746b1cc3c81918be85897d26b0258.png',
    out: 'el_ruisenor_y_el_halcon.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a27495c01d8819199a4dcf9fc7d2239.png',
    out: 'los_perros_y_la_piel_del_leon.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a274a2b96cc81919098d0f71852148c.png',
    out: 'el_nino_y_el_escorpion.webp',
  },
  {
    src: 'ig_0fa2a6bfeaff36c9016a274c128aa88191a22fadd08f4ff273.png',
    out: 'el_labrador_y_la_fortuna.webp',
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
