import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const sourcePath = path.join(publicDir, 'lectorin-logo.webp')

const brandBlue = '#25c5ff'

async function writeSquareIcon(size, fileName) {
  await sharp(sourcePath)
    .resize(size, size, { fit: 'cover', position: 'center' })
    .png({ compressionLevel: 9, palette: size <= 32 })
    .toFile(path.join(publicDir, fileName))
}

async function writeMaskableIcon(size, fileName) {
  const innerSize = Math.round(size * 0.82)
  const logo = await sharp(sourcePath)
    .resize(innerSize, innerSize, { fit: 'contain', background: brandBlue })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: brandBlue,
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, fileName))
}

async function writeOgImage() {
  const logo = await sharp(sourcePath)
    .resize(360, 360, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer()

  const textSvg = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="${brandBlue}"/>
      <circle cx="1090" cy="70" r="130" fill="#FFD166" opacity="0.95"/>
      <circle cx="120" cy="555" r="145" fill="#A7D8F5" opacity="0.9"/>
      <rect x="64" y="62" width="1072" height="506" rx="54" fill="#FFFFFF" opacity="0.96"/>
      <rect x="104" y="108" width="172" height="48" rx="24" fill="#EAF8F1"/>
      <text x="132" y="141" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" fill="#237A4D" letter-spacing="2">LECTORIN</text>
      <text x="104" y="250" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="900" fill="#1F2A44">Aprende a leer</text>
      <text x="104" y="326" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="#1F2A44">con cuentos, voz y juegos</text>
      <text x="106" y="398" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#5A6478">Cuentos, vocales, letras, numeros y silabas</text>
      <rect x="104" y="450" width="92" height="72" rx="22" fill="#A7D8F5"/>
      <rect x="216" y="450" width="92" height="72" rx="22" fill="#BFE8D4"/>
      <rect x="328" y="450" width="120" height="72" rx="22" fill="#FFC3A1"/>
      <rect x="468" y="450" width="92" height="72" rx="22" fill="#FFD166"/>
      <text x="135" y="500" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#1D4E89">A</text>
      <text x="248" y="500" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#237A4D">B</text>
      <text x="360" y="500" font-family="Arial, Helvetica, sans-serif" font-size="37" font-weight="900" fill="#A64B22">ma</text>
      <text x="500" y="500" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" fill="#8A5A00">1</text>
      <rect x="740" y="130" width="360" height="360" rx="48" fill="#25c5ff"/>
    </svg>
  `)

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: brandBlue,
    },
  })
    .composite([
      { input: textSvg, top: 0, left: 0 },
      { input: logo, top: 130, left: 740 },
    ])
    .webp({ quality: 88 })
    .toFile(path.join(publicDir, 'og-lectorin.webp'))
}

await Promise.all([
  writeSquareIcon(16, 'favicon-16x16.png'),
  writeSquareIcon(32, 'favicon-32x32.png'),
  writeSquareIcon(180, 'apple-touch-icon.png'),
  writeSquareIcon(192, 'logo-lectorin-192.png'),
  writeSquareIcon(512, 'logo-lectorin-512.png'),
  writeMaskableIcon(192, 'logo-lectorin-maskable-192.png'),
  writeMaskableIcon(512, 'logo-lectorin-maskable-512.png'),
])

await writeOgImage()

console.log('Brand assets generated in public/')
