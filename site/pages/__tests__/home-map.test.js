import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	afterAll,
	beforeAll,
	describe,
	expect,
	test,
} from 'vitest';

import Index from '../index.astro';
import Worldmap from '../worldmap.astro';

let container;
const previous = process.env.PRISMIC_FIXTURES;

beforeAll(async () => {
	process.env.PRISMIC_FIXTURES = '1';
	container = await AstroContainer.create({astroConfig: {site: 'https://eyesbound.com', trailingSlash: 'always'}});
});

afterAll(() => {
	if (previous === undefined) {
		delete process.env.PRISMIC_FIXTURES;
	} else {
		process.env.PRISMIC_FIXTURES = previous;
	}
});

const render = (page, path) => container.renderToString(page, {request: new Request(`https://eyesbound.com${path}`)});

describe('home page', () => {
	test('shows the newest homepage pictures with an eager high-priority hero and lazy rest', async () => {
		const html = await render(Index, '/');
		const slides = html.match(/<li class="slide[^"]*"[^>]*>.*?<\/li>/gsv);
		expect(slides).toHaveLength(5);
		expect(slides[0]).toMatch(/<img[^>]*fetchpriority="high"/v);
		expect(slides[0]).toMatch(/<img[^>]*loading="eager"/v);
		for (const slide of slides.slice(1)) {
			expect(slide).toMatch(/<img[^>]*loading="lazy"/v);
			expect(slide).not.toContain('fetchpriority="high"');
		}

		expect(html).toContain('href="/picture/home-7/"');
		expect(html).toContain('<link rel="canonical" href="https://eyesbound.com/">');
		expect(html).toContain('og:image" content="https://eyesbound.com/social-image.png"');
	});

	test('has keyboard-reachable controls with translated names and an indicator per slide', async () => {
		const html = await render(Index, '/');
		expect(html).toMatch(/<ul[^>]*data-slides[^>]*tabindex="0"/v);
		expect(html).toMatch(/<button[^>]*data-slide="previous"[^>]*>.*Previous slide.*<\/button>/sv);
		expect(html).toMatch(/<button[^>]*data-slide="next"[^>]*>.*Next slide.*<\/button>/sv);
		expect(html.match(/data-slide-to="\d"/gv)).toHaveLength(5);
		expect(html).toContain('aria-current="true"');
		expect(html).toContain('data-fullscreen-toggle="[data-slideshow]"');
	});

	test('has a main landmark', async () => {
		expect(await render(Index, '/')).toContain('<main>');
	});

	test('emits no inline script or style attributes (strict CSP)', async () => {
		const html = await render(Index, '/');
		expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/v);
		expect(html).not.toMatch(/\sstyle="/v);
	});
});

describe('worldmap page', () => {
	test('renders a labelled map region with every located picture as JSON data', async () => {
		const html = await render(Worldmap, '/worldmap/');
		expect(html).toContain('<link rel="canonical" href="https://eyesbound.com/worldmap/">');
		expect(html).toMatch(/<title>Worldmap \| /v);
		expect(html).toMatch(/<h1 id="map-label" class="visually-hidden"[^>]*>.*Worldmap.*<\/h1>/sv);
		const region = /<div[^>]*role="region"[^>]*aria-labelledby="map-label"[^>]*data-map[^>]*>/v.exec(html)[0];
		expect(region).toContain('data-info-window');
		const json = /data-pictures="(?<json>[^"]*)"/v.exec(region).groups.json.replaceAll('&#34;', '"').replaceAll('&quot;', '"');
		const pictures = JSON.parse(json);
		expect(pictures.length).toBeGreaterThan(0);
		for (const picture of pictures) {
			expect(picture.href).toBe(`/picture/${picture.uid}/`);
			expect(Number.isFinite(picture.latitude) && Number.isFinite(picture.longitude)).toBe(true);
			expect(picture.image === null || new URL(picture.image.src, 'https://eyesbound.com').origin === 'https://eyesbound.com').toBe(true);
		}

		expect(pictures.some(({uid, image}) => uid === 'no-image' && image === null)).toBe(true);
	});

	test('has a main landmark and preconnects to the Google origins in the head', async () => {
		const html = await render(Worldmap, '/worldmap/');
		expect(html).toContain('<main>');
		const head = html.slice(0, html.indexOf('</head>'));
		for (const origin of ['https://maps.googleapis.com', 'https://mapsresources-pa.googleapis.com', 'https://maps.gstatic.com']) {
			expect(head).toContain(`<link rel="preconnect" href="${origin}"`);
		}
	});

	test('emits no inline script or style attributes (strict CSP)', async () => {
		const html = await render(Worldmap, '/worldmap/');
		expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/v);
		expect(html).not.toMatch(/\sstyle="/v);
	});
});
