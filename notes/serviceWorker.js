const CACHE_VERSION = '1.5.9'
/**
 * @description Precache and serve files
 * @type {string} PRECACHE - Name of the cache
 * @version CACHE_VERSION
 */
const PRECACHE = `precache-v${CACHE_VERSION}`
/**
 * @description Runtime cache
 * @type {string} RUNTIME - Name of the cache
 * @since CACHE_VERSION
 */
const RUNTIME = 'runtime'

/**
 * @description List of files to cache
 * @type {string[]} PRECACHE_URLS - List of files to cache
 */
const PRECACHE_URLS = [
    // HTML
    '/',
    './',

    // CSS
    'assets/css/actionContainer.css',
    'assets/css/alert.css',
    'assets/css/base.css',
    'assets/css/contextMenu.css',
    'assets/css/dialog.css',
    'assets/css/editor.css',
    'assets/css/previewList.css',
    'assets/css/style.css',

    // Images
    'assets/img/background.webp',
    'assets/img/circle-check.svg',
    'assets/img/circle-info.svg',
    'assets/img/favicon.ico',
    'assets/img/favicon.png',
    'assets/img/shield-exclamation.svg',
    'assets/img/triangle-exclamation.svg',

    // JavaScript
    'assets/js/alert.js',
    'assets/js/contextMenu.js',
    'assets/js/database.js',
    'assets/js/dialog.js',
    'assets/js/editor.js',
    'assets/js/encryption.js',
    'assets/js/exports.js',
    'assets/js/script.js',
    'assets/js/sidebar.js',
    'assets/js/utilities.js',
]

/**
 * @description Install and activate the service worker
 * @param {string} event - Event
 * @since 1
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => {
                cache.addAll(PRECACHE_URLS)
                console.log('[ServiceWorker] Pre-cached files')
                PRECACHE_URLS.forEach(file => {
                    console.log(file)
                })
            })
            .then(self.skipWaiting())
    )
})

/**
 * @description Delete old caches
 * @param {string} event - Event
 * @since 1
 */
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME]
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                console.log('[ServiceWorker] Deleting old caches')
                return cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
            })
            .then(cachesToDelete => {
                cachesToDelete.forEach(cacheToDelete => {
                    console.log(cacheToDelete)
                })
                return Promise.all(cachesToDelete.map(cacheToDelete => {
                    console.log('[ServiceWorker] Deleting old cache')
                    console.log(cacheToDelete)
                    return caches.delete(cacheToDelete)
                }))
            })
            .then(() => {
                console.log('[ServiceWorker] Claiming clients')
                self.clients.claim()
            })
    )
})

/**
 * @description Serve from cache
 * @param {string} event - Event
 * @since 1
 */
self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('[ServiceWorker] Serving from cache')
                        console.log(event.request.url)
                        return cachedResponse
                    }
                    return caches.open(RUNTIME)
                        .then(cache => {
                            console.log('[ServiceWorker] Fetching from network')
                            console.log(event.request.url)
                            return fetch(event.request)
                                .then(response => {
                                    console.log('[ServiceWorker] Caching response')
                                    console.log(event.request.url)
                                    return cache.put(event.request, response.clone())
                                        .then(() => {
                                            console.log('[ServiceWorker] Cached response')
                                            console.log(event.request.url)
                                            return response
                                        })
                                })
                        })
                })
        )
    }
})
