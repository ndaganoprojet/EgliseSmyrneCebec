/* CMPS Smyrne – cache (service worker)
   - HTML pages: network first (visitors always get your latest text), cache as fallback / offline
   - Images, scripts, fonts, CDN files: cache first, refreshed quietly in the background
   Change VERSION whenever you want to force every visitor to drop the old cache. */
const VERSION = 'cmps-v1';
const CORE = 'core-' + VERSION;
const RUNTIME = 'runtime-' + VERSION;
const MAX_RUNTIME_ITEMS = 120;
const PRECACHE = [
  "./",
  "actualite.html",
  "cohabitation-pacifique.html",
  "contact.html",
  "departement.html",
  "donner.html",
  "eau-hygiene-assainissement.html",
  "evangelisation.html",
  "index.html",
  "priere.html",
  "protection-enfant.html",
  "protection-environnement.html",
  "protection-femme.html",
  "securite-alimentaire.html",
  "vision.html",
  "4pac.jpeg",
  "Roger.jpeg",
  "bonj.png",
  "bwa.jpeg",
  "charite.jpg",
  "church.jpeg",
  "cimanuka.jpg",
  "contact.js",
  "country.png",
  "gps.png",
  "image.jpeg",
  "justin.jpg",
  "pasteur.jpg",
  "pray.png",
  "propos.png",
  "steve.jpeg",
  "transcom.jpeg"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CORE)
      .then(cache => Promise.allSettled(PRECACHE.map(url => cache.add(url))))   // a missing file never breaks install
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CORE && k !== RUNTIME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map(k => cache.delete(k)));
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  if (req.headers.has('range')) return;                       // videos / partial content: let the browser handle it

  const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isPage) {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CORE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(RUNTIME).then(c => c.put(req, copy)).then(() => trim(RUNTIME, MAX_RUNTIME_ITEMS));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
