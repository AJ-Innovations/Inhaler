const CACHE_NAME = "spirox-cache-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Bypass caching on localhost for a friction-free local development experience
  if (
    self.location.hostname === "localhost" ||
    self.location.hostname === "127.0.0.1"
  ) {
    return;
  }

  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Prevent handling non-http/https protocols (like chrome-extension://)
  if (!event.request.url.startsWith("http")) return;

  const url = new URL(event.request.url);

  // 1. Navigation requests (HTML document like `/`) -> Network-First
  // Ensures the user always gets the latest page version when online, fallback to cache when offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cacheCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("/");
          });
        })
    );
    return;
  }

  // 2. Next.js static files (hashed & immutable) -> Cache-First
  // Saves bandwidth and loads assets instantly as filenames change on new builds anyway
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cacheCopy);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Other static assets (images, audios, public assets, fonts, manifest) -> Stale-While-Revalidate
  // Serves from cache immediately for rapid loading, but fetches latest from network to keep it updated
  if (
    url.origin === self.location.origin &&
    !url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/_next/data/")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
});

// Push Notifications Listener
self.addEventListener("push", (event) => {
  let data = {
    title: "Mindful Moment",
    body: "Take a deep breath with Inhale.",
  };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Mindful Moment", body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      { action: "explore", title: "Start Breathing" },
      { action: "close", title: "Close" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle Notification Clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore" || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // If an app window is already open, focus on it
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      }),
    );
  }
});
