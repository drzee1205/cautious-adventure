import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST)

// Cache medical images and assets
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'medical-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Cache fonts
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        purgeOnQuotaError: true
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Cache API responses with stale-while-revalidate for medical data
registerRoute(
  ({ url }) => url.origin === 'https://bnjthwrpigvchbhsmfec.supabase.co',
  new NetworkFirst({
    cacheName: 'medical-api',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
        purgeOnQuotaError: true
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Cache AI API responses
registerRoute(
  ({ url }) => url.origin === 'https://api.mistral.ai',
  new NetworkFirst({
    cacheName: 'ai-api',
    networkTimeoutSeconds: 30,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60, // 1 hour
        purgeOnQuotaError: true
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Cache JavaScript and CSS with stale-while-revalidate
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Offline fallback for HTML pages
const offlineFallback = {
  pageFallback: '/offline.html',
  imageFallback: '/offline-image.png',
  fontFallback: '/offline-font.woff2'
}

// Install event - precache offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-fallbacks').then((cache) => {
      return cache.addAll([
        offlineFallback.pageFallback,
        offlineFallback.imageFallback,
        offlineFallback.fontFallback
      ])
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('workbox-')) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Background sync for offline medical data
self.addEventListener('sync', (event) => {
  if (event.tag === 'medical-sync') {
    event.waitUntil(syncMedicalData())
  }
})

async function syncMedicalData() {
  try {
    // Sync any pending medical data when online
    const cache = await caches.open('medical-pending')
    const requests = await cache.keys()
    
    for (const request of requests) {
      try {
        const response = await fetch(request)
        if (response.ok) {
          await cache.delete(request)
        }
      } catch (error) {
        console.error('Sync failed for request:', request.url)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push notifications for medical updates
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New medical update available',
    icon: '/pwa-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Update',
        icon: '/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Nelson-GPT Medical Update', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Message handling for medical data updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' })
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName)
          })
        )
      })
    )
  }
})

// Periodic background sync for medical content updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'medical-content-update') {
    event.waitUntil(updateMedicalContent())
  }
})

async function updateMedicalContent() {
  try {
    // Check for medical content updates
    const response = await fetch('/api/medical-content/updates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const updates = await response.json()
      if (updates.length > 0) {
        // Notify user about updates
        await self.registration.showNotification('Medical Content Updated', {
          body: `${updates.length} new medical guidelines available`,
          icon: '/pwa-192x192.png',
          badge: '/badge-72x72.png'
        })
      }
    }
  } catch (error) {
    console.error('Medical content update check failed:', error)
  }
}