// FIX: previous "cache-first" strategy meant that once a service worker was
// installed with an old build's JS/CSS filenames cached, EVERY future
// deploy would keep serving those stale, now-nonexistent files forever
// (they 404 on Vercel, and the SW's fallback to caches.match('/index.html')
// returns HTML in place of JS -> "Uncaught SyntaxError: expected
// expression, got '<'"). This only affected long-lived domains like
// socialcal-zeta.vercel.app where a service worker had already been
// registered; the *-git-main-* URL is treated as a different origin/scope
// path history-wise and often had no old SW installed yet.
//
// New strategy: network-first for navigation/JS/CSS, so every deploy is
// picked up immediately. Cache is only used as an offline fallback, and the
// cache name is versioned so old caches get cleared automatically.
const CACHE = 'socialcal-v2';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith(
    fetch(req)
      .then(res => {
        // Cache a copy of successful responses for offline fallback
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('/index.html') : undefined))
      )
  );
});
