const CACHE_NAME = 'fabulas-3000-v5'
const APP_SHELL = [
  '/',
  '/cuentos',
  '/aprender',
  '/aprender/vocales',
  '/aprender/abecedario',
  '/aprender/numeros',
  '/aprender/silabas',
  '/aprender/vocales/a_abeja.webp',
  '/aprender/vocales/e_estrella.webp',
  '/aprender/vocales/i_isla.webp',
  '/aprender/vocales/o_oso.webp',
  '/aprender/vocales/u_uva.webp',
  '/manifest.json',
  '/ambiente.mp3',
  '/tiger.png',
  '/stories/el_leon_y_el_raton.webp',
  '/stories/la_liebre_y_la_tortuga.webp',
  '/stories/la_zorra_y_las_uvas.webp',
  '/stories/la_hormiga_y_la_cigarra.webp',
  '/stories/el_cuervo_y_la_jarra.webp',
  '/stories/el_pastorcito_y_el_lobo.webp',
  '/stories/la_zorra_y_el_cuervo.webp',
  '/stories/el_perro_y_su_reflejo.webp',
  '/stories/el_viento_y_el_sol.webp',
  '/stories/la_gallina_de_los_huevos_dorados.webp',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    )
    return
  }

  if (url.pathname.startsWith('/_next/static/') || isCacheableAsset(request)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        return response
      }))
    )
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        return response
      })
      .catch(() => caches.match(request))
  )
})

function isCacheableAsset(request) {
  return ['image', 'font', 'style', 'script'].includes(request.destination)
}
