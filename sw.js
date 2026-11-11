var CACHE_NAME = 'rdg-cache-v5';
var CORE_ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(event){
 self.skipWaiting();
 event.waitUntil(
  caches.open(CACHE_NAME).then(function(cache){
   return cache.addAll(CORE_ASSETS);
  })
 );
});

self.addEventListener('activate', function(event){
 event.waitUntil(
  caches.keys().then(function(names){
   return Promise.all(names.map(function(name){
    if(name !== CACHE_NAME){ return caches.delete(name); }
   }));
  }).then(function(){ return self.clients.claim(); })
 );
});

self.addEventListener('fetch', function(event){
 if(event.request.method !== 'GET'){ return; }
 event.respondWith(
  fetch(event.request).then(function(response){
   var copy = response.clone();
   caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
   return response;
  }).catch(function(){
   return caches.match(event.request).then(function(cached){
    return cached || caches.match('./index.html');
   });
  })
 );
});
