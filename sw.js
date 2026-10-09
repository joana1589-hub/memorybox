// MemoryBox — Service Worker
// Muda a versão sempre que publicares uma alteração para os telemóveis apanharem a versão nova.
const VERSAO = 'memorybox-v8';

const ESSENCIAIS = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const CDN_CACHE = ['www.gstatic.com'];
const NUNCA = ['firestore.googleapis.com', 'identitytoolkit.googleapis.com', 'securetoken.googleapis.com',
  'firebaseapp.com', 'apis.google.com', 'accounts.google.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ESSENCIAIS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (NUNCA.some(h => url.hostname.includes(h))) return;
  if (url.origin === self.location.origin) {
    // rede primeiro (versão mais recente), cache quando não há rede
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
  } else if (CDN_CACHE.some(h => url.hostname.includes(h))) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const c = res.clone(); caches.open(VERSAO).then(x => x.put(req, c)); return res; })));
  }
});
