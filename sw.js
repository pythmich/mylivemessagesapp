self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('static-v1').then(function(cache) {
        return cache.addAll([
          '.',
          'index.html',
          'style.css',
          'script.js',
          'manifest.json',
          'icon.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(function() {
        console.log('Service Worker Registered');
      });
  }