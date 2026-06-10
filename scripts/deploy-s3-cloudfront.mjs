import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'

const bucket = 'lectorin.com'
const action = process.argv[2] || 'deploy'
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
}

loadLocalEnv()

const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID

function loadLocalEnv() {
    const envPath = '.env.local'

    if (!existsSync(envPath)) return

    const lines = readFileSync(envPath, 'utf8').split(/\r?\n/)

    for (const line of lines) {
        const trimmedLine = line.trim()

        if (!trimmedLine || trimmedLine.startsWith('#')) continue

        const separatorIndex = trimmedLine.indexOf('=')

        if (separatorIndex === -1) continue

        const key = trimmedLine.slice(0, separatorIndex).trim()
        const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')

        if (key && process.env[key] === undefined) {
            process.env[key] = value
        }
    }
}

function run(command, args) {
    console.log(`${colors.yellow}Ejecutando:${colors.reset} ${command} ${args.join(' ')}`)

    const result = spawnSync(command, args, {
        stdio: 'inherit',
        shell: process.platform === 'win32',
    })

    if (result.error) {
        console.error(`\n${colors.red}Error:${colors.reset} No se pudo ejecutar: ${command}`)
        console.error(result.error.message)
        process.exit(1)
    }

    if (result.status !== 0) {
        console.error(`\n${colors.red}Error:${colors.reset} Fallo el comando: ${command} ${args.join(' ')}`)
        process.exit(result.status || 1)
    }
}

if (action === 'deploy') {
    run(npmCommand, ['run', 'build'])
    run('aws', ['s3', 'sync', 'out', `s3://${bucket}`, '--delete'])
    console.log(`\n${colors.green}Deploy completado:${colors.reset} build generado y out/ subido a s3://${bucket}`)
    process.exit(0)
}

if (action === 'invalidate') {
    if (!distributionId) {
        console.error(`\n${colors.red}Error:${colors.reset} Falta CLOUDFRONT_DISTRIBUTION_ID. No se invalido CloudFront.`)
        console.error('Ejemplo: $env:CLOUDFRONT_DISTRIBUTION_ID="E123ABC456"; npm run invalidate')
        process.exit(1)
    }

    run('aws', ['cloudfront', 'create-invalidation', '--distribution-id', distributionId, '--paths', '/*'])
    console.log(`\n${colors.green}Invalidacion creada:${colors.reset} CloudFront ${distributionId} recibio paths /*`)
    process.exit(0)
}

console.error(`${colors.red}Accion no soportada:${colors.reset} ${action}`)
console.error('Usa: deploy o invalidate')
process.exit(1)
