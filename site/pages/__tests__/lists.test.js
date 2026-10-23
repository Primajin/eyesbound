import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	afterAll,
	beforeAll,
	describe,
	expect,
	test,
} from 'vitest';

import {getCategories, getPicturesByCategory} from '../../lib/prismic.js';
import NotFound from '../404.astro';
import CategoryList from '../category/index.astro';
import CategoryPage, {getStaticPaths as categoryPaths} from '../category/[uid].astro';
import Imprint from '../imprint.astro';
import PictureList from '../picture/index.astro';
import SeriesList from '../series/index.astro';
import SeriesPage, {getStaticPaths as seriesPaths} from '../series/[uid].astro';
import TagList from '../tag/index.astro';
import TagPage, {getStaticPaths as tagPaths} from '../tag/[uid].astro';

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

const render = (page, path, extra = {}) => container.renderToString(page, {request: new Request(`https://eyesbound.com${path}`), ...extra});

const renderDetail = async (page, getPaths, family, uid) => {
	const paths = await getPaths();
	const {params, props} = paths.find(({params}) => params.uid === uid);
	return render(page, `/${family}/${uid}/`, {params, props});
};

describe('list pages', () => {
	test('picture list shows every picture with an eager first and lazy other thumbnails and a trailing-slash canonical', async () => {
		const html = await render(PictureList, '/picture/');
		expect(html).toContain('<link rel="canonical" href="https://eyesbound.com/picture/">');
		expect(html).toContain('<title>Pictures | ');
		expect(html).toContain('href="/picture/exoplanet/"');
		expect(html).toMatch(/<img[^>]*loading="lazy"/v);
		expect(html.match(/loading="eager"/gv)).toHaveLength(1);
		expect(html).toMatch(/<span class="missing"[^>]*>No image<\/span>/v);
		expect(html).toMatch(/<ul class="thumbnails cropped-photo"/v);
		expect(html).toMatch(/<img[^>]*width="\d+"[^>]*height="\d+"|<img[^>]*height="\d+"[^>]*width="\d+"/v);
	});

	test.each([
		[CategoryList, 'category', 'Categories', '/category/abstract/'],
		[SeriesList, 'series', 'Series', '/series/'],
		[TagList, 'tag', 'Tags', '/tag/infrared/'],
	])('%# %s list links to trailing-slash detail pages', async (page, family, title, href) => {
		const html = await render(page, `/${family}/`);
		expect(html).toContain(`<link rel="canonical" href="https://eyesbound.com/${family}/">`);
		expect(html).toMatch(new RegExp(String.raw`<h1[^>]*>${title} \(\d+\)</h1>`, 'v'));
		expect(html).toContain(`href="${href}`);
	});
});

describe('detail pages', () => {
	test('category page lists exactly the pictures of the category', async () => {
		const [category] = await getCategories();
		const pictures = await getPicturesByCategory(category.uid);
		const html = await renderDetail(CategoryPage, categoryPaths, 'category', category.uid);
		expect(html).toContain(`Category: ${category.title} (${pictures.length})`);
		expect(html.match(/<li[^>]*><a href="\/picture\/[^"]+\/" aria-label/gv) ?? []).toHaveLength(pictures.length);
		expect(html).toContain(`<link rel="canonical" href="https://eyesbound.com/category/${category.uid}/">`);
	});

	test('series and tag pages keep dotted and plain uids unchanged', async () => {
		const series = await seriesPaths();
		const tags = await tagPaths();
		const seriesHtml = await renderDetail(SeriesPage, seriesPaths, 'series', series[0].params.uid);
		const tagHtml = await renderDetail(TagPage, tagPaths, 'tag', tags[0].params.uid);
		expect(seriesHtml).toContain('Series: ');
		expect(tagHtml).toContain('Tag: ');
		expect(seriesHtml).toContain(`href="https://eyesbound.com/series/${series[0].params.uid}/"`);
	});

	test.each([
		[CategoryPage, categoryPaths, 'category', 'Category'],
		[SeriesPage, seriesPaths, 'series', 'Series'],
		[TagPage, tagPaths, 'tag', 'Tag'],
	])('%# an untitled %s document falls back to its uid in heading and title', async (page, getPaths, family, label) => {
		const [{props}] = await getPaths();
		const html = await render(page, `/${family}/x/`, {params: {uid: 'x'}, props: {item: {...props.item, uid: 'x', title: null}}});
		expect(html).toContain(`${label}: x (0)`);
		expect(html).toContain('<title>x | ');
	});
});

describe('static pages', () => {
	test('imprint renders the localized headings and external links safely', async () => {
		const html = await render(Imprint, '/imprint/');
		expect(html).toContain('<title>Imprint &amp; Contact | ');
		expect(html).toContain('data-lang="de" lang="de">Kontakt &amp; Impressum<');
		expect(html).toContain('Friedrich-Wilhelm-Platz 2');
		expect(html).not.toMatch(/imprint\.\w+/v);
		for (const {groups: {attributes}} of html.matchAll(/<a (?<attributes>[^>]*target="_blank"[^>]*)>/gv)) {
			expect(attributes).toContain('rel="noreferrer"');
		}

		expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/v);
		expect(html).not.toMatch(/\sstyle="/v);
	});

	test('404 page links home and has no inline script or style attributes', async () => {
		const html = await render(NotFound, '/404/');
		expect(html).toContain('404 - Page Not Found');
		expect(html).toContain('href="/"');
		expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/v);
		expect(html).not.toMatch(/\sstyle="/v);
	});
});
