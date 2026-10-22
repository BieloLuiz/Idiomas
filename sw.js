/* A PWA gerencia somente os próprios caches e recursos dentro do seu escopo. */
const PREFIX = 'idiomas-', V = PREFIX + '0c16ac54c9', AUDIO_CACHE = PREFIX + 'audio-v1';
const ASSETS = ["assets/c6bfe16efec91a123fcd.webp", "assets/e7245faa3817a7f27d9a.js", "assets/295efa32d0c9f5d3d971.js", "assets/4192643eb0fddf5cf769.js", "assets/07b5486bbc404de8770f.js", "assets/913efd47cbb83b3b08b9.js", "assets/0fffe9886293678beb14.js", "assets/27535720bc0b15e6a541.js", "assets/b42e717cbb0db7138680.js", "assets/eca617750f7770680c27.css", "assets/12725c10c7f8e4f20e1c.css", "assets/e884d13cc6425d81b1b4.css", "assets/937bb9903234161a07b3.css", "assets/f6546f320e981c99ad3e.css"];
const SHELL = ['./', 'index.html', 'config.js', 'auth.js', 'sync.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'].concat(ASSETS);
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== V && k !== AUDIO_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'download-unit' || !/^(en|fr)\|(\d|[1-5]\d)$/.test(e.data.unit)) return;
  const [lang, raw] = e.data.unit.split('|'), n = Number(raw), levels = ['', 'a2-', 'b1-', 'b2-', 'c1-'];
  const file = 'audio/' + lang + '-' + levels[Math.floor(n / 12)] + 'u' + String(n % 12 + 1).padStart(2, '0') + '.mp3';
  e.waitUntil(caches.open(AUDIO_CACHE).then(c => c.add(new URL(file, self.registration.scope).href)).then(() => e.ports[0] && e.ports[0].postMessage({ ok: true })).catch(() => e.ports[0] && e.ports[0].postMessage({ ok: false })));
});
async function rangeResponse(request, response) {
  const range = request.headers.get('Range'); if (!range) return response;
  const data = await response.arrayBuffer(), match = /^bytes=(\d+)-(\d*)$/.exec(range);
  if (!match) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + data.byteLength } });
  const start = Number(match[1]), end = match[2] ? Math.min(Number(match[2]), data.byteLength - 1) : data.byteLength - 1;
  if (start > end || start >= data.byteLength) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + data.byteLength } });
  return new Response(data.slice(start, end + 1), { status: 206, headers: { 'Content-Type': 'audio/mpeg', 'Content-Range': 'bytes ' + start + '-' + end + '/' + data.byteLength, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url), scope = new URL(self.registration.scope);
  if (e.request.method !== 'GET' || u.origin !== scope.origin || !u.pathname.startsWith(scope.pathname)) return;
  if (u.pathname.includes('/audio/')) {
    e.respondWith(caches.open(AUDIO_CACHE).then(c => c.match(new Request(e.request.url))).then(cached => cached ? rangeResponse(e.request, cached) : fetch(e.request))); return;
  }
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); e.waitUntil(caches.open(V).then(c => c.put(e.request, copy))); }
    return r;
  }).catch(async () => {
    const cache = await caches.open(V), hit = await cache.match(e.request); if (hit) return hit;
    if (e.request.mode === 'navigate') return await cache.match('index.html') || Response.error();
    return Response.error();
  }));
});
/* Lembrete diário (Web Push) */
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { corpo: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Idiomas', { body: d.corpo || 'Hora de estudar um pouquinho?', icon: 'icon-192.png', badge: 'icon-192.png', tag: 'lembrete-diario', renotify: true, data: { url: './?de=lembrete' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow(e.notification.data && e.notification.data.url || './');
  }));
});
