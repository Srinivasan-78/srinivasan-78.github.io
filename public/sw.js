/*!
 * @authormark v1 -- do not remove (authorship watermark)
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.arHInWeiRZIBbiARewF09d
 */

/* Service Worker: Stale-While-Revalidate (SWR) Snapshot & Offline Engine.
 *
 * Implements optimistic local caching for instant cold boot (<50ms):
 * 1. Navigation requests (HTML pages) return the cached snapshot immediately,
 *    while silently fetching the fresh page in the background to update the cache.
 * 2. Static assets (JS/CSS/fonts/icons) use Cache-First with network fallback.
 * 3. Works offline and survives terrible/in-flight Wi-Fi gracefully.
 */

const CACHE_NAME = 'sv-swr-v1';
const PRECACHE_URLS = [
  '/',
  '/projects',
  '/certifications',
  '/contact',
  '/manifest.webmanifest',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Tolerant to individual fetch failures during precache
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      }),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Stale-While-Revalidate for HTML page navigations
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);

        const networkFetch = fetch(req)
          .then((res) => {
            if (res && res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => cached || caches.match('/'));

        // Return cached snapshot immediately if available, else await network
        return cached || networkFetch;
      })
    );
    return;
  }

  // Cache-First for static assets, scripts, fonts, and images
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(png|ico|svg|jpg|jpeg|webp|woff2|woff|css|js)$/)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(req);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(req, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cached;
        }
      })
    );
  }
});
