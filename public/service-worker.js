this.addEventListener('install', event => {
  console.log('installing');
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        '/',
        // '/js/scripts.js',
        // '/css/styles.css',
        // '/img/logo.png',
        // '/js/jquery-3.2.1.js',
        // '/index.html'
      ]);
    })
  );
});

this.addEventListener('activate', (event) => {
  let cacheWhitelist = ['assets-v1'];

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
    .then(() => clients.claim())
  );
});
