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
