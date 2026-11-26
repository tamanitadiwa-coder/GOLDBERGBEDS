// Goldberg Beds — makes the shop installable and quick to reopen.
// Photos are cached after first view; pages and data always try the network first.
const V = 'gb-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(V).then(c => c.addAll(['./', './index.html', './products.js', './img/mark.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;   // never touches the backend or WhatsApp
  if (u.pathname.includes('/img/')) {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const c = res.clone(); caches.open(V).then(k => k.put(r, c)); return res; })));
    return;
  }
  e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(k => k.put(r, c)); return res; }).catch(() => caches.match(r).then(hit => hit || caches.match('./index.html'))));
});
