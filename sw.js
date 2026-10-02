const C = 'taxi-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html', './pedir.html'])).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if(r.method !== 'GET') return;
  const h = new URL(r.url).hostname;
  if(h.endsWith('nominatim.openstreetmap.org') || h === 'router.project-osrm.org' || h === 'wa.me') return;
  e.respondWith(fetch(r).then(res => { if(res.ok || res.type === 'opaque'){ const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r, {ignoreSearch:true}).then(m => m || caches.match('./index.html'))));
});
