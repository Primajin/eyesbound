import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {
	describe,
	expect,
	test,
	vi,
} from 'vitest';

const source = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');

const makeWorker = ({cacheNames = [], fetchResponse} = {}) => {
	const listeners = {};
	const store = new Map(cacheNames.map(name => [name, new Map()]));
	const open = async name => {
		if (!store.has(name)) {
			store.set(name, new Map());
		}

		const entries = store.get(name);
		return {
			match: async request => entries.get(request.url),
			put: vi.fn(async (request, response) => entries.set(request.url, response)),
		};
	};

	const caches = {keys: async () => store.keys().toArray(), delete: vi.fn(async name => store.delete(name)), open};
	const self = {
		location: {origin: 'https://eyesbound.com'},
		addEventListener(type, listener) {
			listeners[type] = listener;
		},
		skipWaiting: vi.fn(),
		clients: {claim: vi.fn(async () => {})},
	};
	const fetchMock = vi.fn(async () => fetchResponse ?? {
		status: 200, type: 'basic', clone() {
			return this;
		},
	});
	vm.runInNewContext(source, {
		self, caches, fetch: fetchMock, URL,
	});
	return {
		listeners, self, caches, store, fetchMock,
	};
};

const fetchEvent = (url, method = 'GET') => {
	const event = {request: {url, method}, respondWith: vi.fn()};
	return event;
};

describe('service worker', () => {
	test('skips waiting on install', () => {
		const {listeners, self} = makeWorker();
		listeners.install();
		expect(self.skipWaiting).toHaveBeenCalledOnce();
	});

	test('deletes every foreign cache on activate, keeps its own, then claims clients', async () => {
		const {listeners, self, store} = makeWorker({cacheNames: ['workbox-precache-v2-https://eyesbound.com/', 'gatsby-plugin-offline-runtime', 'eyesbound-assets-v1']});
		let pending;
		listeners.activate({
			waitUntil(promise) {
				pending = promise;
			},
		});
		await pending;
		expect(store.keys().toArray()).toEqual(['eyesbound-assets-v1']);
		expect(self.clients.claim).toHaveBeenCalledOnce();
	});

	test.each([
		'https://eyesbound.com/_astro/montserrat-latin-400-normal.BLhwKU8k.woff2',
		'https://eyesbound.com/_astro/Base.CXekgG8-.css',
		'https://eyesbound.com/logo.png',
		'https://eyesbound.com/icons/icon-192x192.png',
	])('serves %s cache-first and stores a good response', async url => {
		const {listeners, fetchMock, store} = makeWorker();
		const event = fetchEvent(url);
		listeners.fetch(event);
		const first = await event.respondWith.mock.calls[0][0];
		expect(first.status).toBe(200);
		expect(store.get('eyesbound-assets-v1').has(url)).toBe(true);

		const second = fetchEvent(url);
		listeners.fetch(second);
		await second.respondWith.mock.calls[0][0];
		expect(fetchMock).toHaveBeenCalledOnce();
	});

	test.each([
		['HTML', 'https://eyesbound.com/'],
		['hashed script', 'https://eyesbound.com/_astro/client.FVv06Hs5.js'],
		['hashed image', 'https://eyesbound.com/_astro/a.jpeg'],
		['other origin', 'https://images.prismic.io/_astro/a.css'],
		['sw itself', 'https://eyesbound.com/sw.js'],
	])('leaves %s to the network', (_name, url) => {
		const {listeners} = makeWorker();
		const event = fetchEvent(url);
		listeners.fetch(event);
		expect(event.respondWith).not.toHaveBeenCalled();
	});

	test('ignores non-GET requests', () => {
		const {listeners} = makeWorker();
		const event = fetchEvent('https://eyesbound.com/logo.png', 'POST');
		listeners.fetch(event);
		expect(event.respondWith).not.toHaveBeenCalled();
	});

	test('does not cache error responses', async () => {
		const {listeners, store} = makeWorker({
			fetchResponse: {
				status: 404, type: 'basic', clone() {
					return this;
				},
			},
		});
		const event = fetchEvent('https://eyesbound.com/_astro/missing.css');
		listeners.fetch(event);
		await event.respondWith.mock.calls[0][0];
		expect(store.get('eyesbound-assets-v1')?.size ?? 0).toBe(0);
	});
});
