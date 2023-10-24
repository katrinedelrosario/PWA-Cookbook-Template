const staticCacheName = 'site-static-v1.4'
const dynamicCacheName = 'site-dynamic-v1.2'


const assets = [
    "/",
    "/index.html",
    "css/styles.css"
]



//register sw
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('sw registered', reg))
    .catch(err => console.error('sw not registered', err))
}

//install sw & creates cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        //creates cache & adds
        caches.open(staticCacheName)
        .then(cache => {
            cache.addAll(assets)
            console.log('caching all assets')
        })
    )
    console.log('sw installed')
}
)

//activate sw
self.addEventListener('activate', (event) => {
    console.log('activated sw', event)
    //filters and deletes caches that doesnt match new version
       event.waitUntil(
           caches.keys().then(keys => {
               const filteredkeys = keys.filter(key => key !== staticCacheName)
               filteredkeys.map(key => {
                   caches.delete(key)
               })
           })
      )    
})

//fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(async fetchRes => {
                const cache = await caches.open(dynamicCacheName)
                cache.put(event.request.url, fetchRes.clone())
                return fetchRes
                console.log('fetched res')
            })
        })
    )
})

