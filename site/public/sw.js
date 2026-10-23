// Classic worker script (CSP: worker-src 'self'). Served at the path of the retired Gatsby/Workbox worker so returning visitors upgrade.
// Only fonts, global CSS and icons are cached (cache-first, hashed or rarely changing). HTML, Prismic images and everything else go to the network.
// Logic is covered by site/scripts/__tests__/sw.test.js and e2e/sw.spec.js.
const CACHE_NAME = 'eyesbound-assets-v1';
const ICON_PATHS = new Set(['/logo.png', '/favicon.png']);

const isCacheable = url =>
	url.origin === self.location.origin
	&& (
		(url.pathname.startsWith('/_astro/') && /\.(?:woff2|css)$/v.test(url.pathname))
		|| ICON_PATHS.has(url.pathname)
		|| /^\/icons\/icon-\d+x\d+\.png$/v.test(url.pathname)
	);

self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', event => {
	event.waitUntil((async () => {
		const names = await caches.keys();
		await Promise.all(names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)));
		await self.clients.claim();
	})());
});

self.addEventListener('fetch', event => {
	const {request} = event;
	if (request.method !== 'GET' || !isCacheable(new URL(request.url))) {
		return;
	}

	event.respondWith((async () => {
		const cache = await caches.open(CACHE_NAME);
		const cached = await cache.match(request);
		if (cached) {
			return cached;
		}

		const response = await fetch(request);
		if (response.status === 200 && response.type === 'basic') {
			await cache.put(request, response.clone());
		}

		return response;
	})());
});
