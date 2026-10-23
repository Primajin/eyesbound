import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	afterEach,
	beforeAll,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import Map from '../Map.astro';
import Slideshow from '../Slideshow.astro';

const env = vi.hoisted(() => ({key: 'test-key'}));
vi.mock('astro:env/client', () => ({
	get MAPS_API_KEY() {
		return env.key;
	},
}));

const image = {
	url: 'https://images.prismic.io/eyesbound/a.jpg?auto=compress,format', alt: 'A alt', width: 1500, height: 1000,
};
const thumbnail = {
	url: 'https://images.prismic.io/eyesbound/a.jpg?auto=compress,format&w=280', alt: 'A thumb', width: 280, height: 187,
};
const picture = {
	uid: 'a', title: 'A', image, thumbnail, coordinates: {latitude: 52.5, longitude: 13.4},
};

let container;
beforeAll(async () => {
	container = await AstroContainer.create();
});

afterEach(() => {
	env.key = 'test-key';
	vi.unstubAllEnvs();
});

const render = (component, props) => container.renderToString(component, {props});

const mapData = html => {
	const {json} = /data-pictures="(?<json>[^"]*)"/v.exec(html).groups;
	return JSON.parse(json.replaceAll('&#34;', '"').replaceAll('&quot;', '"'));
};

describe('Map', () => {
	const props = {pictures: [picture], labelledBy: 'label'};

	test('refuses to render without pictures', async () => {
		vi.stubEnv('PRISMIC_FIXTURES', '1');
		await expect(render(Map, {...props, pictures: []})).rejects.toThrow('Map rendered without pictures.');
	});

	test('fails the build without a maps key unless fixtures are in use', async () => {
		env.key = undefined;
		vi.stubEnv('PRISMIC_FIXTURES', '');
		await expect(render(Map, props)).rejects.toThrow('MAPS_API_KEY is missing');
	});

	test('renders without a maps key for a fixture build, and passes a real key on', async () => {
		env.key = undefined;
		vi.stubEnv('PRISMIC_FIXTURES', '1');
		expect(await render(Map, props)).not.toContain('data-api-key');
		env.key = 'real-key';
		vi.stubEnv('PRISMIC_FIXTURES', '');
		expect(await render(Map, props)).toContain('data-api-key="real-key"');
	});

	test('renders with defaults for center, zoom and without an info window', async () => {
		vi.stubEnv('PRISMIC_FIXTURES', '1');
		const html = await render(Map, props);
		expect(html).toContain('data-zoom="5"');
		expect(html).toContain('data-latitude="51.');
		expect(html).toContain('aria-labelledby="label"');
		expect(html).not.toContain('data-info-window');
		expect(html).not.toContain('fullscreen');
		expect(mapData(html)).toEqual([{
			uid: 'a', title: 'A', href: '/picture/a/', latitude: 52.5, longitude: 13.4, image: null,
		}]);
	});

	test('renders a hidden consent panel inside the map with a privacy link and a button, in both languages', async () => {
		vi.stubEnv('PRISMIC_FIXTURES', '1');
		const html = await render(Map, props);
		const panel = /<div[^>]*data-map-consent[^>]*>[\s\S]*?<\/button>/v.exec(html)[0];
		expect(panel).toContain(' hidden');
		expect(panel).toContain('href="/imprint/#privacy-policy"');
		expect(panel).toContain('data-lang="en" lang="en">Load map<');
		expect(panel).toContain('data-lang="de" lang="de">Karte laden<');
		expect(panel).toContain('type="button"');
		expect(html).not.toMatch(/\sstyle="|googleapis|gstatic/v);
	});

	test('honours center, zoom, fullscreen and the info window', async () => {
		vi.stubEnv('PRISMIC_FIXTURES', '1');
		const html = await render(Map, {
			...props, center: {latitude: 1.5, longitude: 2.5}, zoom: 11, fullscreen: true, hasInfoWindow: true,
		});
		expect(html).toContain('data-latitude="1.5"');
		expect(html).toContain('data-longitude="2.5"');
		expect(html).toContain('data-zoom="11"');
		expect(html).toContain('data-info-window');
		expect(html).toMatch(/class="[^"]*\bfullscreen\b/v);
		const [{image: info}] = mapData(html);
		expect(info).toMatchObject({alt: 'A thumb', width: 164});
		expect(info.src).toContain('f=webp');
	});

	test.each([
		['uses the full image when there is no thumbnail', {thumbnail: null}, 'A', 'A alt'],
		['uses the title as alt when the image has none', {image: {...image, alt: ''}, thumbnail: {...thumbnail, alt: ''}}, 'A', 'A'],
		['falls back to the uid and an empty alt for an untitled picture without alt', {title: null, thumbnail: {...thumbnail, alt: ''}}, 'a', ''],
	])('info window %s', async (_name, overrides, title, alt) => {
		vi.stubEnv('PRISMIC_FIXTURES', '1');
		const html = await render(Map, {...props, pictures: [{...picture, ...overrides}], hasInfoWindow: true});
		const [data] = mapData(html);
		expect(data.title).toBe(title);
		expect(data.image).toMatchObject({alt, width: 164});
	});

	test('has no info window image for a picture without any image', async () => {
		vi.stubEnv('PRISMIC_FIXTURES', '1');
		const html = await render(Map, {...props, pictures: [{...picture, image: null, thumbnail: null}], hasInfoWindow: true});
		expect(mapData(html)).toEqual([{
			uid: 'a', title: 'A', href: '/picture/a/', latitude: 52.5, longitude: 13.4, image: null,
		}]);
	});
});

describe('Slideshow', () => {
	test('refuses to render without pictures', async () => {
		await expect(render(Slideshow, {pictures: []})).rejects.toThrow('Slideshow rendered without pictures.');
	});

	test('a single picture has no arrows but still one indicator', async () => {
		const html = await render(Slideshow, {pictures: [picture]});
		expect(html).not.toContain('data-slide="next"');
		expect(html).not.toContain('data-slide="previous"');
		expect(html.match(/data-slide-to="\d"/gv)).toHaveLength(1);
		expect(html).toContain('aria-current="true"');
	});

	test('names untitled slides by their uid and falls back to the image for the indicator', async () => {
		const html = await render(Slideshow, {pictures: [{...picture, title: null, thumbnail: null}, {...picture, uid: 'b', title: 'B'}]});
		expect(html).toContain('aria-label="a"');
		expect(html).toContain('aria-label="B"');
		expect(html).toContain('data-slide="next"');
		expect(html.match(/aria-current="false"/gv)).toHaveLength(1);
		expect(html).toContain('href="/picture/a/"');
	});
});
