/* A PWA gerencia somente os próprios caches e recursos dentro do seu escopo. */
const PREFIX = 'idiomas-', V = PREFIX + '5d02da030f', AUDIO_CACHE = PREFIX + 'audio-v1';
const ASSETS = ["assets/c6bfe16efec91a123fcd.webp", "assets/e7245faa3817a7f27d9a.js", "assets/295efa32d0c9f5d3d971.js", "assets/75f6c9982653158d33b9.js", "assets/492a7e6b4f70cfda524a.js", "assets/64ce7cadd9f14fce4562.js", "assets/0fffe9886293678beb14.js", "assets/27535720bc0b15e6a541.js", "assets/b42e717cbb0db7138680.js", "assets/eca617750f7770680c27.css", "assets/12725c10c7f8e4f20e1c.css", "assets/eb8495b7e3976d66e829.css", "assets/8655ef5b06083818ff61.css", "assets/f6546f320e981c99ad3e.css"];
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
