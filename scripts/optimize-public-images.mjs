import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DEFAULT_TARGET_KB = 60
const DEFAULT_DIRS = ['public/aprender', 'public/stories']
const START_QUALITY = 70
const RESET_QUALITY = 62
const MIN_QUALITY = 18
const MIN_WIDTH = 280
const MAX_WIDTH = 1000
const MAX_ATTEMPTS = 14

async function main() {
    const options = parseArgs(process.argv.slice(2))
    const targetBytes = options.targetKb * 1024

    const files = []

    for (const dir of options.dirs) {
        files.push(...await findWebpFiles(path.resolve(process.cwd(), dir)))
    }

    files.sort((a, b) => a.localeCompare(b))

    if (!files.length) {
        console.log('No se encontraron imagenes .webp en las carpetas indicadas.')
        return
    }

    let optimized = 0
    let alreadyOk = 0
    let overTarget = 0
    let savedBytes = 0

    for (const filePath of files) {
        const result = await optimizeImage(filePath, targetBytes, options)

        if (result.status === 'already-ok') alreadyOk += 1
        if (result.status === 'optimized') optimized += 1
        if (result.status === 'over-target') overTarget += 1

        savedBytes += Math.max(0, result.originalBytes - result.outputBytes)

        if (result.status !== 'already-ok' || options.verbose) {
            console.log(formatResult(result, targetBytes, options))
        }
    }

    console.log('')
    console.log(`Listo${options.dryRun ? ' (dry-run)' : ''}. Target: ${options.targetKb} KB.`)
    console.log(`Optimizadas: ${optimized}. Ya estaban OK: ${alreadyOk}. Sobre target: ${overTarget}. Ahorro: ${formatBytes(savedBytes)}.`)

    if (overTarget > 0) {
        process.exitCode = 1
    }
}

async function findWebpFiles(dir) {
    const files = []
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const entryPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            files.push(...await findWebpFiles(entryPath))
            continue
        }

        if (entry.isFile() && entry.name.toLowerCase().endsWith('.webp')) {
            files.push(entryPath)
        }
    }

    return files
}

async function optimizeImage(filePath, targetBytes, options) {
    const originalBytes = (await stat(filePath)).size

    if (originalBytes <= targetBytes && !options.force) {
        return {
            filePath,
            originalBytes,
            outputBytes: originalBytes,
            status: 'already-ok',
        }
    }

    const inputBuffer = await readFile(filePath)
    const metadata = await sharp(inputBuffer).metadata()
    const originalWidth = metadata.width || MAX_WIDTH
    let width = estimateStartWidth(originalWidth, originalBytes, targetBytes)
    let quality = START_QUALITY
    const candidates = []

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        const outputBuffer = await sharp(inputBuffer)
            .resize({
                width,
                withoutEnlargement: true,
            })
            .webp({
                effort: 4,
                quality,
                smartSubsample: true,
            })
            .toBuffer()

        const candidate = {
            buffer: outputBuffer,
            bytes: outputBuffer.byteLength,
            quality,
            width: Math.min(width, originalWidth),
        }

        candidates.push(candidate)

        if (candidate.bytes <= targetBytes) {
            return saveOptimizedCandidate(filePath, originalBytes, candidate, 'optimized', options)
        }

        if (quality > 38) {
            quality = Math.max(MIN_QUALITY, quality - 8)
            continue
        }

        const nextWidth = Math.max(MIN_WIDTH, Math.floor(width * 0.84))

        if (nextWidth === width && quality === MIN_QUALITY) {
            break
        }

        width = nextWidth
        quality = RESET_QUALITY
    }

    const smallest = candidates.sort((a, b) => a.bytes - b.bytes)[0]

    if (smallest && smallest.bytes < originalBytes) {
        return saveOptimizedCandidate(filePath, originalBytes, smallest, 'over-target', options)
    }

    return {
        filePath,
        originalBytes,
        outputBytes: originalBytes,
        status: 'over-target',
    }
}

async function saveOptimizedCandidate(filePath, originalBytes, candidate, status, options) {
    if (!options.dryRun) {
        await writeFile(filePath, candidate.buffer)
    }

    return {
        filePath,
        originalBytes,
        outputBytes: candidate.bytes,
        quality: candidate.quality,
        status,
        width: candidate.width,
    }
}

function estimateStartWidth(originalWidth, originalBytes, targetBytes) {
    const maxWidth = Math.min(originalWidth, MAX_WIDTH)
    const estimatedRatio = Math.sqrt(targetBytes / originalBytes)

    return clamp(Math.round(originalWidth * estimatedRatio * 1.12), MIN_WIDTH, maxWidth)
}

function parseArgs(args) {
    const options = {
        dirs: [...DEFAULT_DIRS],
        dryRun: false,
        force: false,
        targetKb: DEFAULT_TARGET_KB,
        verbose: false,
    }

    for (const arg of args) {
        if (arg === '--dry-run') options.dryRun = true
        if (arg === '--force') options.force = true
        if (arg === '--verbose') options.verbose = true

        if (arg.startsWith('--target-kb=')) {
            options.targetKb = Number(arg.replace('--target-kb=', ''))
        }

        if (arg.startsWith('--dir=')) {
            options.dirs = [arg.replace('--dir=', '')]
        }

        if (arg.startsWith('--add-dir=')) {
            options.dirs.push(arg.replace('--add-dir=', ''))
        }
    }

    if (!Number.isFinite(options.targetKb) || options.targetKb <= 0) {
        throw new Error('El parametro --target-kb debe ser un numero mayor a 0.')
    }

    return options
}

function formatResult(result, targetBytes, options) {
    const relativePath = path.relative(process.cwd(), result.filePath)
    const sizeChange = `${formatBytes(result.originalBytes)} -> ${formatBytes(result.outputBytes)}`
    const prefix = options.dryRun ? 'DRY ' : ''

    if (result.status === 'already-ok') {
        return `${prefix}OK   ${relativePath}: ${sizeChange}`
    }

    const settings = result.width && result.quality
        ? ` ancho ${result.width}px, calidad ${result.quality}`
        : ''

    if (result.status === 'optimized') {
        return `${prefix}MIN  ${relativePath}: ${sizeChange}${settings}`
    }

    return `${prefix}WARN ${relativePath}: ${sizeChange}${settings} (no llego a ${formatBytes(targetBytes)})`
}

function formatBytes(bytes) {
    return `${Math.round(bytes / 1024)} KB`
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
