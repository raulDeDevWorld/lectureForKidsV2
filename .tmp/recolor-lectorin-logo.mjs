import sharp from 'sharp'

const input = '.tmp/logo-propuestas/lectorin-01-cielo-25c5ff-limpio.png'
const output = '.tmp/logo-propuestas/lectorin-final-tor-light-capa-azul.png'

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }

  return [h, s, l]
}

function hslToRgb(h, s, l) {
  let r
  let g
  let b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ]
}

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value))
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function blendChannel(from, to, weight) {
  return Math.round(from * (1 - weight) + to * weight)
}

function inBox(x, y, box) {
  return x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1
}

function inPolygon(x, y, points) {
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0]
    const yi = points[i][1]
    const xj = points[j][0]
    const yj = points[j][1]
    const intersects =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

const letterBoxes = [
  // O in TOR
  { x0: 715, y0: 535, x1: 880, y1: 765 },
  // R in TOR
  { x0: 840, y0: 520, x1: 1015, y1: 750 },
]

const capePolygons = [
  // Main cape underside behind the mascot. The polygon avoids the cream page surface.
  [
    [30, 408],
    [72, 352],
    [160, 318],
    [255, 318],
    [360, 354],
    [440, 405],
    [405, 456],
    [275, 458],
    [118, 438],
  ],
  // Small underside fold near the right arm.
  [
    [555, 412],
    [612, 365],
    [676, 382],
    [707, 430],
    [672, 466],
    [594, 456],
  ],
]

const image = sharp(input).ensureAlpha()
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })

for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const index = (y * info.width + x) * info.channels
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]

    const inLetter = letterBoxes.some((box) => inBox(x, y, box))
    if (inLetter) {
      const cyanLetter =
        b > 105 &&
        g > 95 &&
        r < 165 &&
        b >= r + 35 &&
        g >= r + 28

      if (cyanLetter) {
        const [h, s, l] = rgbToHsl(r, g, b)
        const raised = clamp(Math.max(l + 0.24, 0.78), 0, 0.98)
        const shade = Math.round((1 - raised) * 44)
        const white = [clamp(246 - shade), clamp(246 - shade), clamp(252)]
        const weight = clamp(0.86 + s * 0.12, 0, 0.98)
        data[index] = blendChannel(r, white[0], weight)
        data[index + 1] = blendChannel(g, white[1], weight)
        data[index + 2] = blendChannel(b, white[2], weight)
        continue
      }
    }

    const inCape = capePolygons.some((polygon) => inPolygon(x, y, polygon))
    if (inCape) {
      const [, s] = rgbToHsl(r, g, b)
      const redCape =
        r > 45 &&
        g < 160 &&
        b < 130 &&
        r > g * 1.18 &&
        r > b * 1.35 &&
        s > 0.32

      const notMouth =
        x > 390 &&
        x < 525 &&
        y > 335 &&
        y < 455

      if (redCape && !notMouth) {
        const [, , l] = rgbToHsl(r, g, b)
        const targetL = clamp(l * 1.08, 0.12, 0.72)
        const [nr, ng, nb] = hslToRgb(0.59, clamp(s * 1.08, 0.5, 0.95), targetL)
        const redness = clamp((r - Math.max(g, b)) / 120, 0, 1)
        const weight = 0.78 + redness * 0.2
        data[index] = blendChannel(r, nr, weight)
        data[index + 1] = blendChannel(g, ng, weight)
        data[index + 2] = blendChannel(b, nb, weight)
      }
    }
  }
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: info.channels,
  },
})
  .png({ compressionLevel: 9 })
  .toFile(output)

console.log(output)
