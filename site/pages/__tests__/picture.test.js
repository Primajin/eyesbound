import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	afterAll,
	beforeAll,
	describe,
	expect,
	test,
} from 'vitest';

import {hasLocation} from '../../lib/pictures.js';
import {getStaticPathsFor} from '../../lib/prismic.js';
import Page, {getStaticPaths} from '../picture/[uid].astro';

let container;
let paths;
const previous = process.env.PRISMIC_FIXTURES;

beforeAll(async () => {
	process.env.PRISMIC_FIXTURES = '1';
	container = await AstroContainer.create({astroConfig: {site: 'https://eyesbound.com', trailingSlash: 'always'}});
	paths = await getStaticPaths();
});

afterAll(() => {
	if (previous === undefined) {
		delete process.env.PRISMIC_FIXTURES;
	} else {
		process.env.PRISMIC_FIXTURES = previous;
	}
});

const renderPicture = async uid => {
	const {params, props} = paths.find(({params}) => params.uid === uid);
	return container.renderToString(Page, {params, props, request: new Request(`https://eyesbound.com/picture/${uid}/`)});
};

describe('picture page', () => {
	test('getStaticPaths yields one unnormalised path per picture', async () => {
		const expected = await getStaticPathsFor('picture');
		expect(paths.map(({params}) => params.uid)).toEqual(expected.map(({params}) => params.uid));
		expect(paths.length).toBeGreaterThan(0);
	});

	test('renders hero, metadata and links for a picture with everything', async () => {
		const html = await renderPicture('exoplanet');
		expect(html).toContain('<link rel="canonical" href="https://eyesbound.com/picture/exoplanet/">');
		expect(html).toMatch(/<h1[^>]*>Exoplanet<\/h1>/v);
		expect(html).toContain('href="/category/abstract/"');
		expect(html).toContain('href="/tag/infrared/"');
		expect(html).toContain('May 01, 2020');
		expect(html).toContain('<meta property="og:image" content="https://eyesbound.com/');
		expect(html).toContain('data-fullscreen-toggle');
		expect(html).toMatch(/<figure class="cropped-photo"/v);
		expect(html).not.toMatch(/picture\.\w+/v);
	});

	test('the only picture is the eager LCP image with explicit size', async () => {
		const html = await renderPicture('exoplanet');
		expect(html.match(/<img\b/gv)).toHaveLength(1);
		expect(html).toMatch(/<img[^>]*fetchpriority="high"/v);
		expect(html).toMatch(/<img[^>]*loading="eager"/v);
		expect(html).toMatch(/<img[^>]*width="\d+"[^>]*height="\d+"|<img[^>]*height="\d+"[^>]*width="\d+"/v);
		expect(html).toContain('type="image/avif"');
	});

	test('series link and map placeholder appear only when the data exists', async () => {
		const withSeries = paths.find(({props}) => props.item.series);
		const withCoordinates = paths.find(({props}) => hasLocation(props.item.coordinates));
		const seriesHtml = await renderPicture(withSeries.params.uid);
		expect(seriesHtml).toContain(`href="/series/${withSeries.props.item.series.uid}/"`);

		const without = paths.find(({props}) => !props.item.series);
		expect(await renderPicture(without.params.uid)).not.toContain('lang="en">Series<');

		expect(await renderPicture(withCoordinates.params.uid)).toContain('data-map');

		const unset = paths.find(({props}) => props.item.coordinates && !hasLocation(props.item.coordinates));
		const unsetHtml = await renderPicture(unset.params.uid);
		expect(unsetHtml).not.toContain('data-map');
		expect(unsetHtml).not.toContain('name="geo.position"');
	});

	test('emits no inline script or style attributes (strict CSP)', async () => {
		const html = await renderPicture('exoplanet');
		expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/v);
		expect(html).not.toMatch(/\sstyle="/v);
	});

	test('renders a bare picture without optional sections', async () => {
		const {props} = paths.find(({props}) => props.item.uid === 'exoplanet');
		const item = {
			...props.item, title: null, datetime: null, coordinates: null, category: null, series: null, tags: [],
		};
		const html = await container.renderToString(Page, {params: {uid: 'exoplanet'}, props: {item}, request: new Request('https://eyesbound.com/picture/exoplanet/')});
		const main = html.slice(html.indexOf('<main'));
		expect(main).not.toContain('<h1');
		expect(main).not.toContain('class="details"');
		expect(main).not.toContain('class="taxonomy"');
		expect(html).not.toContain('data-map');
		expect(html).not.toContain('name="date"');
		expect(html).not.toContain('name="geo.position"');
		expect(html).toContain('<title>EYESBOUND</title>');
		expect(html).toContain('<meta name="description" content="Portfolio Website');
		expect(html).toMatch(/<img[^>]*alt="Exoplanet"/v);
	});

	test('falls back to uids for untitled links and lists tags in the description', async () => {
		const {props} = paths.find(({props}) => props.item.uid === 'exoplanet');
		const item = {
			...props.item,
			title: null,
			category: {uid: 'cat', title: null},
			series: {uid: 'ser', title: null},
			tags: [{uid: 'one', title: null}, {uid: 'two', title: 'Two'}],
		};
		const html = await container.renderToString(Page, {params: {uid: 'exoplanet'}, props: {item}, request: new Request('https://eyesbound.com/picture/exoplanet/')});
		expect(html).toMatch(/<a href="\/category\/cat\/"[^>]*>cat<\/a>/v);
		expect(html).toMatch(/<a href="\/series\/ser\/"[^>]*>ser<\/a>/v);
		expect(html).toContain('<a href="/tag/one/">one</a> | <a href="/tag/two/">Two</a>');
		expect(html).toContain('<meta name="description" content="Tags: one Two">');
		expect(html).toContain('<meta name="date" content="2020-05-01T10:00:00+0000">');
	});

	test('fails loudly for a picture without an image', async () => {
		const {props} = paths[0];
		await expect(container.renderToString(Page, {params: {uid: 'x'}, props: {item: {...props.item, image: null}}})).rejects.toThrow('has no image');
	});
});
