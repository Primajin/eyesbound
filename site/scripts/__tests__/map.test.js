// @vitest-environment jsdom
/* global document, window */
import {
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import {mapIdDark, mapIdLight} from '../../constants/map.js';
import {
	buildApiUrl,
	createInfoContent,
	currentTheme,
	initMaps,
	loadGoogleMaps,
	parsePictures,
} from '../map.js';

const pictures = [
	{
		uid: 'a', title: 'Alpha', href: '/picture/a/', latitude: 52.5, longitude: 13.4, image: {
			src: '/_astro/a.webp', width: 164, height: 110, alt: 'Alpha',
		},
	},
	{
		uid: 'b', title: 'Beta', href: '/picture/b/', latitude: 48.1, longitude: 11.6, image: null,
	},
];

const flush = () => new Promise(resolve => {
	setTimeout(resolve, 0);
});

const setupDom = ({infoWindow = true, key = 'test-key', data = pictures} = {}) => {
	document.head.replaceChildren();
	document.documentElement.dataset.theme = 'light';
	document.body.innerHTML = `<div data-map ${infoWindow ? 'data-info-window' : ''} data-api-key="${key}" data-latitude="51.1" data-longitude="10.4" data-zoom="5"></div>`;
	const container = document.querySelector('[data-map]');
	container.dataset.pictures = JSON.stringify(data);
	return container;
};

const fakeGoogle = () => {
	const created = {maps: [], markers: [], windows: []};
	class GoogleMap {
		constructor(element, options) {
			this.element = element;
			this.options = options;
			created.maps.push(this);
		}
	}

	class InfoWindow {
		constructor(options) {
			this.options = options;
			this.setContent = vi.fn();
			this.open = vi.fn();
			created.windows.push(this);
		}
	}

	class Marker {
		constructor(options) {
			this.options = options;
			this.listeners = {};
			created.markers.push(this);
		}

		addEventListener(name, listener) {
			this.listeners[name] = listener;
		}
	}

	const maps = {
		importLibrary: vi.fn(async name => name === 'maps' ? {Map: GoogleMap, InfoWindow} : {AdvancedMarkerElement: Marker}),
	};
	return {maps, created};
};

class FakeObserver {
	static instances = [];

	constructor(callback) {
		this.callback = callback;
		this.disconnect = vi.fn();
		FakeObserver.instances.push(this);
	}

	observe() {}

	trigger(isIntersecting) {
		this.callback([{isIntersecting}]);
	}
}

describe('buildApiUrl', () => {
	test('asks for async loading, both map ids and a callback', () => {
		const url = new URL(buildApiUrl('k', [mapIdDark, mapIdLight], 'cb'));
		expect(url.origin).toBe('https://maps.googleapis.com');
		expect(Object.fromEntries(url.searchParams)).toEqual({
			key: 'k', v: 'weekly', mapIds: `${mapIdDark},${mapIdLight}`, loading: 'async', callback: 'cb',
		});
	});
});

describe('loadGoogleMaps', () => {
	beforeEach(() => {
		document.head.replaceChildren();
	});

	test('appends one external async script and resolves with google.maps when the callback fires', async () => {
		const first = loadGoogleMaps(document, 'k');
		const second = loadGoogleMaps(document, 'k');
		expect(second).toBe(first);
		const scripts = document.head.querySelectorAll('script');
		expect(scripts).toHaveLength(1);
		expect(scripts[0].async).toBe(true);
		expect(scripts[0].textContent).toBe('');
		const {searchParams} = new URL(scripts[0].src);
		window.google = {maps: {marker: 'ns'}};
		window[searchParams.get('callback')]();
		await expect(first).resolves.toEqual({marker: 'ns'});
		expect(window[searchParams.get('callback')]).toBeUndefined();
	});

	test('rejects when the script fails and allows a retry', async () => {
		const fresh = document.implementation.createHTMLDocument('');
		Object.defineProperty(fresh, 'defaultView', {value: window});
		const failing = loadGoogleMaps(fresh, 'k');
		fresh.head.querySelector('script').dispatchEvent(new Event('error'));
		await expect(failing).rejects.toThrow('failed to load');
		expect(loadGoogleMaps(fresh, 'k')).not.toBe(failing);
	});
});

describe('parsePictures', () => {
	test('returns valid pictures', () => {
		expect(parsePictures(JSON.stringify(pictures))).toEqual(pictures);
	});

	test.each([
		[undefined, 'no pictures'],
		['[]', 'no pictures'],
		['{}', 'no pictures'],
		[JSON.stringify([{uid: 'x', latitude: null, longitude: 1}]), 'no usable position'],
		[JSON.stringify([{uid: 'x', latitude: 1}]), 'no usable position'],
	])('throws for %s', (json, message) => {
		expect(() => parsePictures(json)).toThrow(message);
	});
});

describe('createInfoContent', () => {
	test('links to the picture with title and sized thumbnail', () => {
		const link = createInfoContent(document, pictures[0]);
		expect(link.getAttribute('href')).toBe('/picture/a/');
		expect(link.querySelector('h1').textContent).toBe('Alpha');
		const image = link.querySelector('img');
		expect(image.getAttribute('src')).toBe('/_astro/a.webp');
		expect(image.width).toBe(164);
		expect(image.height).toBe(110);
	});

	test('omits the image when there is none and never interprets the title as HTML', () => {
		const link = createInfoContent(document, {...pictures[1], title: '<img src=x onerror=alert(1)>'});
		expect(link.querySelector('img')).toBeNull();
		expect(link.querySelector('h1').textContent).toBe('<img src=x onerror=alert(1)>');
	});
});

describe('currentTheme', () => {
	test('prefers data-theme over the OS setting', () => {
		document.documentElement.dataset.theme = 'dark';
		expect(currentTheme(document)).toBe('dark');
	});

	test('falls back to the OS preference when data-theme is absent or invalid', () => {
		delete document.documentElement.dataset.theme;
		window.matchMedia = vi.fn(() => ({matches: true}));
		expect(currentTheme(document)).toBe('dark');
		document.documentElement.dataset.theme = 'sepia';
		window.matchMedia = vi.fn(() => ({matches: false}));
		expect(currentTheme(document)).toBe('light');
	});
});

describe('initMaps', () => {
	beforeEach(() => {
		FakeObserver.instances.length = 0;
		window.IntersectionObserver = FakeObserver;
	});

	test('does not load the Maps API until the element is near the viewport', async () => {
		setupDom();
		const {maps} = fakeGoogle();
		const load = vi.fn(async () => maps);
		initMaps(document, {load});
		await flush();
		expect(load).not.toHaveBeenCalled();

		FakeObserver.instances[0].trigger(false);
		await flush();
		expect(load).not.toHaveBeenCalled();

		FakeObserver.instances[0].trigger(true);
		await flush();
		expect(load).toHaveBeenCalledWith(document, 'test-key');
		expect(FakeObserver.instances[0].disconnect).toHaveBeenCalled();
	});

	test('loads immediately when IntersectionObserver is unavailable', async () => {
		setupDom();
		delete window.IntersectionObserver;
		const load = vi.fn(async () => fakeGoogle().maps);
		initMaps(document, {load});
		await flush();
		expect(load).toHaveBeenCalledTimes(1);
	});

	test('creates a map for the active theme with a marker per picture and opens an info window on click', async () => {
		const container = setupDom();
		const {maps, created} = fakeGoogle();
		initMaps(document, {load: async () => maps});
		FakeObserver.instances[0].trigger(true);
		await flush();

		expect(created.maps).toHaveLength(1);
		expect(created.maps[0].options).toEqual({
			center: {lat: 51.1, lng: 10.4}, zoom: 5, mapId: mapIdLight, streetViewControl: false,
		});
		expect(created.markers.map(({options}) => options.title)).toEqual(['Alpha', 'Beta']);
		expect(created.markers[0].options.gmpClickable).toBe(true);
		expect(container).toHaveProperty('dataset.mapReady', '');
		expect(container.dataset.mapError !== undefined).toBe(false);

		created.markers[0].listeners['gmp-click']();
		const [infoWindow] = created.windows;
		expect(infoWindow.options).toEqual({maxWidth: 200});
		expect(infoWindow.setContent.mock.calls[0][0].getAttribute('href')).toBe('/picture/a/');
		expect(infoWindow.open).toHaveBeenCalledWith({map: created.maps[0], anchor: created.markers[0]});
	});

	test('without an info window the markers are not clickable and no window exists', async () => {
		setupDom({infoWindow: false});
		const {maps, created} = fakeGoogle();
		initMaps(document, {load: async () => maps});
		FakeObserver.instances[0].trigger(true);
		await flush();
		expect(created.windows).toHaveLength(0);
		expect(created.markers.every(({options, listeners}) => options.gmpClickable === false && Object.keys(listeners).length === 0)).toBe(true);
	});

	test('creates the second theme map lazily on a theme switch and swaps visibility', async () => {
		const container = setupDom();
		const {maps, created} = fakeGoogle();
		initMaps(document, {load: async () => maps});
		FakeObserver.instances[0].trigger(true);
		await flush();
		expect(container.querySelectorAll('.map-layer')).toHaveLength(1);

		document.documentElement.dataset.theme = 'dark';
		await flush();
		await flush();
		expect(created.maps.map(({options}) => options.mapId)).toEqual([mapIdLight, mapIdDark]);
		const layers = [...container.querySelectorAll('.map-layer')];
		expect(layers.map(layer => [layer.dataset.mapTheme, layer.hidden])).toEqual([['light', true], ['dark', false]]);

		document.documentElement.dataset.theme = 'light';
		await flush();
		await flush();
		expect(created.maps).toHaveLength(2);
		expect(layers.map(layer => layer.hidden)).toEqual([false, true]);
	});

	test('marks the element and logs when the key is missing, the script fails or the data is bad', async () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const load = vi.fn(async () => fakeGoogle().maps);

		const noKey = setupDom({key: ''});
		initMaps(document, {load});
		FakeObserver.instances[0].trigger(true);
		await flush();
		expect(noKey.dataset.mapError !== undefined).toBe(true);
		expect(load).not.toHaveBeenCalled();

		const failing = setupDom();
		const offline = async () => {
			throw new Error('offline');
		};

		initMaps(document, {load: offline});
		FakeObserver.instances.at(-1).trigger(true);
		await flush();
		expect(failing.dataset.mapError !== undefined).toBe(true);

		const bad = setupDom({data: [{uid: 'x', latitude: null, longitude: null}]});
		initMaps(document, {load});
		FakeObserver.instances.at(-1).trigger(true);
		await flush();
		expect(bad.dataset.mapError !== undefined).toBe(true);
		expect(bad).not.toHaveProperty('dataset.mapReady');
		expect(error).toHaveBeenCalledTimes(3);
		error.mockRestore();
	});

	test('reports a rejected key through the global the Maps API calls', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const container = setupDom();
		initMaps(document, {load: async () => fakeGoogle().maps});
		window.gm_authFailure();
		expect(container.dataset.mapError !== undefined).toBe(true);
		error.mockRestore();
	});
});
