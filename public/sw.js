/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌​‌​‌‌‌​​‌‌​‌​​‌‌‌‌​‌‌‌​​‌​​‌‌‌​​‌‌​‌​​‌​‌​​‌​​​​‌‌​‌​‌‌​‌​​‌‌‌​​‌‌​​‌‌​​‌​​‌​​‌‌‌‌​‌​‌‌‌‌‌​‌‌‌‌​‌​​‌​‌​‌​​​‌‌​‌​​​​‌​​​‌‌​​‌‌​​‌‌​​‌​‌‌​‌​​‌​‌​‌​​​​‌‌​​‌‌​‌​​‌‌​​​‌​‌​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.UsOrsJCZs2O_zThFfZT3LV
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
  '/hobby',
  '/contact',
  '/manifest.webmanifest',
  '/favicon.ico',
];

/* respondWith() rejects anything that is not a Response — including the
   `undefined` an exhausted cache-then-network path resolves to — and a
   rejected respondWith surfaces to the visitor as a failed request
   rather than as a handled miss. Every path below ends at a real
   Response for that reason. */
const offlineResponse = () =>
  new Response('', {
    status: 504,
    statusText: 'Offline',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

/* cache.put() rejects on a redirected or opaque response, and a
   navigation replayed from a cached redirect throws on the next visit
   instead of rendering. Only plain 200s from this origin are storable. */
const isStorable = (res) =>
  !!res && res.status === 200 && res.type === 'basic' && !res.redirected;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      /* addAll() is all-or-nothing — one 404 would discard the whole
         precache — so each URL is cached on its own and a failure is
         tolerated. */
      return Promise.all(
        PRECACHE_URLS.map((url) =>
          fetch(new Request(url, { redirect: 'follow' }))
            .then((res) => (isStorable(res) ? cache.put(url, res) : undefined))
            .catch(() => undefined)
        )
      );
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
          .then(async (res) => {
            if (isStorable(res)) {
              /* Clone before returning: the body is a stream and the
                 page consumes it. */
              await cache.put(req, res.clone()).catch(() => undefined);
            }
            return res;
          })
          .catch(async () => (await cache.match('/')) || offlineResponse());

        /* The revalidation has to outlive the response. A worker may be
           killed as soon as respondWith() settles, so when the cached
           copy is what gets returned, the background write is only
           guaranteed to land if the event is holding it open — without
           this the "revalidate" half of SWR silently never happens and
           the snapshot stays stale for good. */
        if (cached) {
          event.waitUntil(networkFetch);
          return cached;
        }
        return networkFetch;
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
          if (isStorable(networkResponse)) {
            await cache.put(req, networkResponse.clone()).catch(() => undefined);
          }
          return networkResponse;
        } catch {
          /* `cached` is known to be absent by this point — returning it
             would resolve respondWith() with `undefined` and turn a
             missing asset into a hard failure. */
          return offlineResponse();
        }
      })
    );
  }
});
