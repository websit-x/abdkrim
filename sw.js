const CACHE_NAME = 'electricite-v6';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

// تثبيت النسخة الجديدة وتفعيلها فوراً
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// حذف كل النسخ القديمة من الكاش تلقائياً
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// جلب النسخة الأحدث من الإنترنت أولاً، والرجوع للكاش عند انقطاع الإنترنت
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
