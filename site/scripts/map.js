import {mapIdByTheme, mapIdDark, mapIdLight} from '../constants/map.js';
import {grantConsent, hasConsent} from './map-consent.js';

const apiUrl = 'https://maps.googleapis.com/maps/api/js';
const callbackName = 'eyesboundMapsReady';
const pending = new WeakMap();

/**
 Builds the Maps JavaScript API URL. `loading=async` makes the API expose `importLibrary`, which is ready when `callback` fires.
 @param {string} key Public, referrer-restricted Maps key.
 @param {string[]} mapIds Cloud-based map styles used on the page.
 @param {string} callback Name of the global function the API calls when it is ready.
 @returns {string} Script URL.
 */
export const buildApiUrl = (key, mapIds, callback) => {
	const url = new URL(apiUrl);
	url.search = new URLSearchParams({
		key, v: 'weekly', mapIds: mapIds.join(','), loading: 'async', callback,
	}).toString();
	return url.href;
};

/**
 Loads the Maps API once per document through an external script element (no inline script).
 @param {Document} root Document to load into.
 @param {string} key Public Maps API key, restricted to the site's referrers.
 @returns {Promise<object>} The `google.maps` namespace.
 */
export const loadGoogleMaps = (root, key) => {
	if (!pending.has(root)) {
		pending.set(root, new Promise((resolve, reject) => {
			const script = root.createElement('script');
			script.async = true;
			script.src = buildApiUrl(key, [mapIdDark, mapIdLight], callbackName);
			root.defaultView[callbackName] = () => {
				delete root.defaultView[callbackName];
				resolve(root.defaultView.google.maps);
			};

			script.addEventListener('error', () => {
				delete root.defaultView[callbackName];
				pending.delete(root);
				reject(new Error('The Google Maps script failed to load.'));
			});
			root.head.append(script);
		}));
	}

	return pending.get(root);
};

/**
 Validates the picture list a map element carries.
 @param {string|undefined} json Attribute value holding the picture list as JSON.
 @returns {{uid: string, title: string, latitude: number, longitude: number, image: ({src: string, width: number, height: number, alt: string}|null)}[]} The validated list, unchanged.
 @throws {Error} When the data is missing or any picture lacks a usable position.
 */
export const parsePictures = json => {
	const pictures = JSON.parse(json ?? 'null');
	if (!Array.isArray(pictures) || pictures.length === 0) {
		throw new TypeError('The map has no pictures.');
	}

	for (const {uid, latitude, longitude} of pictures) {
		if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
			throw new TypeError(`Map picture "${uid}" has no usable position.`);
		}
	}

	return pictures;
};

/**
 Builds the info window content: a link to the picture with its title and thumbnail. Text is set as text, never as HTML.
 @param {Document} root Document to create elements in.
 @param {{uid: string, title: string, href: string, image: ({src: string, width: number, height: number, alt: string}|null)}} picture Picture to show.
 @returns {HTMLAnchorElement} Link element.
 */
export const createInfoContent = (root, picture) => {
	const link = root.createElement('a');
	link.href = picture.href;
	const heading = root.createElement('h1');
	heading.textContent = picture.title;
	link.append(heading);
	if (picture.image) {
		const image = root.createElement('img');
		image.src = picture.image.src;
		image.width = picture.image.width;
		image.height = picture.image.height;
		image.alt = picture.image.alt;
		link.append(image);
	}

	return link;
};

/**
 Resolves the active theme: `data-theme` is set pre-paint, the OS preference is only a fallback.
 @param {Document} root Document to read.
 @returns {'dark'|'light'} Theme name.
 */
export const currentTheme = root => {
	const {theme} = root.documentElement.dataset;
	if (theme === 'dark' || theme === 'light') {
		return theme;
	}

	return root.defaultView.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const fail = (container, error) => {
	container.dataset.mapError = '';
	console.error(error);
};

const createLayer = async (root, container, maps, theme) => {
	const layer = root.createElement('div');
	layer.className = 'map-layer';
	layer.dataset.mapTheme = theme;
	container.append(layer);

	const {latitude, longitude, zoom} = container.dataset;
	const pictures = parsePictures(container.dataset.pictures);
	const hasInfoWindow = container.dataset.infoWindow !== undefined;
	const {Map: GoogleMap, InfoWindow} = await maps.importLibrary('maps');
	const {AdvancedMarkerElement: Marker} = await maps.importLibrary('marker');

	const map = new GoogleMap(layer, {
		center: {lat: Number(latitude), lng: Number(longitude)},
		zoom: Number(zoom),
		mapId: mapIdByTheme[theme],
		streetViewControl: false,
	});
	const infoWindow = hasInfoWindow ? new InfoWindow({maxWidth: 200}) : null;

	for (const picture of pictures) {
		const marker = new Marker({
			map, position: {lat: picture.latitude, lng: picture.longitude}, title: picture.title, gmpClickable: hasInfoWindow,
		});
		if (infoWindow) {
			marker.addEventListener('gmp-click', () => {
				infoWindow.setContent(createInfoContent(root, picture));
				infoWindow.open({map, anchor: marker});
			});
		}
	}

	return layer;
};

const showTheme = async ({root, container, maps, layers}, theme) => {
	if (!layers.has(theme)) {
		layers.set(theme, createLayer(root, container, maps, theme));
	}

	const active = await layers.get(theme);
	if (currentTheme(root) === theme) {
		for (const layer of container.querySelectorAll('.map-layer')) {
			layer.hidden = layer !== active;
		}
	}
};

const start = async (root, container, load) => {
	try {
		const key = container.dataset.apiKey;
		if (!key) {
			throw new Error('The map has no API key.');
		}

		const maps = await load(root, key);
		const context = {
			root, container, maps, layers: new Map(),
		};
		const update = () => showTheme(context, currentTheme(root));
		await update();
		new root.defaultView.MutationObserver(() => update().catch(error => fail(container, error))).observe(root.documentElement, {attributes: true, attributeFilter: ['data-theme']});
		container.dataset.mapReady = '';
	} catch (error) {
		fail(container, error);
	}
};

const whenVisible = (win, container, callback) => {
	if (!win.IntersectionObserver) {
		callback();
		return;
	}

	const observer = new win.IntersectionObserver(entries => {
		if (entries.every(entry => !entry.isIntersecting)) {
			return;
		}

		observer.disconnect();
		callback();
	}, {rootMargin: '200px'});
	observer.observe(container);
};

const askConsent = (root, container, onGranted) => {
	const panel = container.querySelector('[data-map-consent]');
	const button = panel?.querySelector('button');
	if (!button) {
		fail(container, new Error('The map has no consent panel.'));
		return;
	}

	panel.hidden = false;
	button.addEventListener('click', () => {
		grantConsent(root.defaultView);
		panel.remove();
		container.tabIndex = -1;
		container.focus();
		onGranted();
	});
};

/**
 Wires every `[data-map]`. Nothing is requested from Google until the visitor consents: without stored consent the map's own consent panel is shown, and a click on its button loads the API. With consent the API is requested only when the element is (nearly) visible. One map per theme is created lazily.
 @param {Document} root Document to act on.
 @param {{load?: typeof loadGoogleMaps}} [options] Loader override for tests.
 */
export const initMaps = (root, {load = loadGoogleMaps} = {}) => {
	// Name fixed by the Maps API: it calls this global when the key is rejected
	// eslint-disable-next-line camelcase
	root.defaultView.gm_authFailure = () => {
		for (const container of root.querySelectorAll('[data-map]')) {
			fail(container, new Error('Google Maps rejected the API key (referrer or billing).'));
		}
	};

	for (const container of root.querySelectorAll('[data-map]')) {
		const begin = () => start(root, container, load);
		if (hasConsent(root.defaultView)) {
			whenVisible(root.defaultView, container, begin);
		} else {
			askConsent(root, container, begin);
		}
	}
};
