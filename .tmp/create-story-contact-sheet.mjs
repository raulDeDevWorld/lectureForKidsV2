import { mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const dir = 'public/stories'
const out = '.tmp/story-contact-sheet.webp'
const files = readdirSync(dir).filter((file) => file.endsWith('.webp')).sort()

const columns = 5
const tileWidth = 260
const tileHeight = 220
const labelHeight = 42
const rows = Math.ceil(files.length / columns)
const composites = []

mkdirSync('.tmp', { recursive: true })

function escapeXml(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

for (let index = 0; index < files.length; index += 1) {
    const file = files[index]
    const left = (index % columns) * tileWidth
    const top = Math.floor(index / columns) * tileHeight
    const image = await sharp(path.join(dir, file))
        .resize(tileWidth, tileHeight - labelHeight, { fit: 'cover', position: 'center' })
        .toBuffer()

    const label = file.replace('.webp', '').replaceAll('_', ' ')
    const svg = `
        <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#ffffff"/>
            <text x="8" y="17" font-family="Arial" font-size="12" fill="#1f2a44">${escapeXml(label.slice(0, 34))}</text>
            <text x="8" y="33" font-family="Arial" font-size="10" fill="#6b7280">${index + 1} / ${files.length}</text>
        </svg>
    `

    composites.push({ input: image, left, top })
    composites.push({ input: Buffer.from(svg), left, top: top + tileHeight - labelHeight })
}

await sharp({
    create: {
        width: columns * tileWidth,
        height: rows * tileHeight,
        channels: 3,
        background: '#f4f6f8',
    },
})
    .composite(composites)
    .webp({ quality: 88 })
    .toFile(out)

console.log(out)
