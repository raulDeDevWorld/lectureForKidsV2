import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const TARGET_BYTES = 100 * 1024
const STORIES_DIR = path.join(process.cwd(), 'public', 'stories')
const TMP_DIR = path.join(process.cwd(), '.tmp', 'story-image-optimization')
const MAX_WIDTHS = [1000, 900, 800, 700, 600]
const QUALITIES = [82, 78, 74, 70, 66, 62, 58, 54, 50, 46, 42, 38, 34]

async function main() {
    await mkdir(TMP_DIR, { recursive: true })

    const files = (await readdir(STORIES_DIR))
        .filter((file) => file.toLowerCase().endsWith('.webp'))
        .sort()

    if (!files.length) {
        console.log('No se encontraron imagenes .webp en public/stories.')
        return
    }

    let optimized = 0
    let alreadyOk = 0
    let failedTarget = 0

    for (const file of files) {
        const result = await optimizeImage(file)

        if (result.status === 'already-ok') alreadyOk += 1
        if (result.status === 'optimized') optimized += 1
        if (result.status === 'over-target') failedTarget += 1

        console.log(formatResult(result))
    }

    await rm(TMP_DIR, { recursive: true, force: true })

    console.log('')
    console.log(`Listo. Optimizadas: ${optimized}. Ya estaban bajo 100 KB: ${alreadyOk}. Sobre 100 KB: ${failedTarget}.`)
}

async function optimizeImage(file) {
    const inputPath = path.join(STORIES_DIR, file)
    const originalBytes = (await stat(inputPath)).size
    const inputBuffer = await readFile(inputPath)

    if (originalBytes <= TARGET_BYTES) {
        return {
            file,
            originalBytes,
            outputBytes: originalBytes,
            status: 'already-ok',
        }
    }

    const metadata = await sharp(inputBuffer).metadata()
    const candidates = []

    for (const width of MAX_WIDTHS) {
        for (const quality of QUALITIES) {
            const outputBuffer = await sharp(inputBuffer)
                .resize({
                    width: Math.min(width, metadata.width || width),
                    withoutEnlargement: true,
                })
                .webp({
                    effort: 6,
                    quality,
                    smartSubsample: true,
                })
                .toBuffer()

            candidates.push({
                buffer: outputBuffer,
                bytes: outputBuffer.byteLength,
                quality,
                width,
            })

            if (outputBuffer.byteLength <= TARGET_BYTES) {
                return saveOptimizedCandidate(file, originalBytes, candidates.at(-1), 'optimized')
            }
        }
    }

    const smallest = candidates.sort((a, b) => a.bytes - b.bytes)[0]

    if (smallest && smallest.bytes < originalBytes) {
        return saveOptimizedCandidate(file, originalBytes, smallest, 'over-target')
    }

    return {
        file,
        originalBytes,
        outputBytes: originalBytes,
        status: 'over-target',
    }
}

async function saveOptimizedCandidate(file, originalBytes, candidate, status) {
    const inputPath = path.join(STORIES_DIR, file)

    await writeFile(inputPath, candidate.buffer)

    return {
        file,
        originalBytes,
        outputBytes: candidate.bytes,
        quality: candidate.quality,
        status,
        width: candidate.width,
    }
}

function formatResult(result) {
    const sizeChange = `${formatBytes(result.originalBytes)} -> ${formatBytes(result.outputBytes)}`

    if (result.status === 'already-ok') {
        return `OK   ${result.file}: ${sizeChange}`
    }

    const settings = result.width && result.quality
        ? ` ancho ${result.width}px, calidad ${result.quality}`
        : ''

    if (result.status === 'optimized') {
        return `MIN  ${result.file}: ${sizeChange}${settings}`
    }

    return `WARN ${result.file}: ${sizeChange}${settings} (no llego a 100 KB)`
}

function formatBytes(bytes) {
    return `${Math.round(bytes / 1024)} KB`
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
