import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	afterAll,
	beforeAll,
	describe,
	expect,
	test,
} from 'vitest';

import en from '../../i18n/locales/en.json';
import {t} from '../../i18n/index.js';
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

const flatten = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) => (
	typeof value === 'object' && value !== null ? flatten(value, `${prefix}${key}.`) : [`${prefix}${key}`]
));

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
		expect(html).toMatch(new RegExp(String.raw`<h1[^>]*><span data-lang="en" lang="en">${title}</span><span data-lang="de" lang="de">[^<]+</span> \(\d+\)</h1>`, 'v'));
		expect(html).toContain(`href="${href}`);
	});
});

describe('detail pages', () => {
	test('category page lists exactly the pictures of the category', async () => {
		const [category] = await getCategories();
		const pictures = await getPicturesByCategory(category.uid);
		const html = await renderDetail(CategoryPage, categoryPaths, 'category', category.uid);
		expect(html).toContain(`lang="de">Kategorie</span>: ${category.title} (${pictures.length})`);
		expect(html.match(/<li[^>]*><a href="\/picture\/[^"]+\/" aria-label/gv) ?? []).toHaveLength(pictures.length);
		expect(html).toContain(`<link rel="canonical" href="https://eyesbound.com/category/${category.uid}/">`);
	});

	test('series and tag pages keep dotted and plain uids unchanged', async () => {
		const series = await seriesPaths();
		const tags = await tagPaths();
		const seriesHtml = await renderDetail(SeriesPage, seriesPaths, 'series', series[0].params.uid);
		const tagHtml = await renderDetail(TagPage, tagPaths, 'tag', tags[0].params.uid);
		expect(seriesHtml).toContain('lang="de">Serie</span>: ');
		expect(tagHtml).toContain('lang="de">Schlagwort</span>: ');
		expect(seriesHtml).toContain(`href="https://eyesbound.com/series/${series[0].params.uid}/"`);
	});

	test.each([
		[CategoryPage, categoryPaths, 'category', 'Kategorie'],
		[SeriesPage, seriesPaths, 'series', 'Serie'],
		[TagPage, tagPaths, 'tag', 'Schlagwort'],
	])('%# an untitled %s document falls back to its uid in heading and title', async (page, getPaths, family, label) => {
		const [{props}] = await getPaths();
		const html = await render(page, `/${family}/x/`, {params: {uid: 'x'}, props: {item: {...props.item, uid: 'x', title: null}}});
		expect(html).toContain(`lang="de">${label}</span>: x (0)`);
		expect(html).toContain('<title>x | ');
	});
});

describe('static pages', () => {
	test('imprint renders the localized headings and external links safely', async () => {
		const html = await render(Imprint, '/imprint/');
		expect(html).toContain('<title>Imprint &amp; Contact | ');
		expect(html).toContain('data-lang="de" lang="de">Kontakt &amp; Impressum<');
		expect(html).not.toMatch(/imprint\.(?!astro)\w+/v);
		for (const {groups: {attributes}} of html.matchAll(/<a (?<attributes>[^>]*target="_blank"[^>]*)>/gv)) {
			expect(attributes).toContain('rel="noreferrer"');
		}

		expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/v);
		expect(html).not.toMatch(/\sstyle="/v);
	});

	test('imprint documents Cloudflare and Google Maps in both languages and offers the withdraw control', async () => {
		const html = await render(Imprint, '/imprint/');
		expect(html).toMatch(/<h2 id="privacy-policy"/v);
		expect(html).toContain('data-lang="en" lang="en">12. Google Maps<');
		expect(html).toContain('data-lang="de" lang="de">11. Hosting durch Cloudflare<');
		expect(html).toContain('href="https://www.cloudflare.com/privacypolicy/"');
		expect(html).toContain('href="https://policies.google.com/privacy"');
		expect(html).toMatch(/<button[^>]*data-map-consent-revoke[^>]*>/v);
		expect(html).not.toMatch(/privacy\.(?:withdraw|cloudflare|maps)\.\w+/v);
	});

	test('every imprint text exists in English and German and the German side has no English-only block', async () => {
		const html = await render(Imprint, '/imprint/');
		const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll('\'', '&#39;');
		const keys = [
			...flatten(en.privacy).map(key => `privacy.${key}`),
			...flatten(en.imprint.address).map(key => `imprint.address.${key}`),
			...flatten(en.imprint.license).map(key => `imprint.license.${key}`),
			'imprint.pageTitle',
			'imprint.design',
			'imprint.privacyPolicy',
		].filter(key => !key.endsWith('Url'));
		for (const key of keys) {
			for (const lang of ['en', 'de']) {
				expect(html, `${key} (${lang})`).toContain(escape(t(key, lang, {siteName: 'EYESBOUND'})));
			}
		}

		expect(html.match(/<span data-lang="en" lang="en">/gv)).toHaveLength(html.match(/<span data-lang="de" lang="de">/gv).length);
		expect(html).toContain('E-Mail</span>: admin@eyesbound.com');
		expect(html).not.toContain('84183026');
		expect(html).not.toContain('Friedrich-Wilhelm-Platz');
		expect(html).not.toContain('12161');
		expect(html).toContain('lang="de">Deutschland</span>');
		expect(html).toContain('data-title-de="Namensnennung');
		expect(html).toContain('<p data-lang="de" lang="de"');
		expect(html).not.toMatch(/(?:privacy|imprint)\.\w+\.\w+/v);
		expect(html).not.toContain('{{');
	});

	test('imprint headings never skip a level and keep the privacy policy anchor', async () => {
		const html = await render(Imprint, '/imprint/');
		const levels = html.matchAll(/<h(?<level>[1-6])[\s>]/gv).map(match => Number(match.groups.level)).toArray();
		expect(levels[0]).toBe(1);
		for (const [index, level] of levels.entries()) {
			if (index > 0) {
				expect(level, `heading ${index}`).toBeLessThanOrEqual(levels[index - 1] + 1);
			}
		}

		expect(html).toMatch(/<h2 id="privacy-policy"/v);
	});

	test('404 page links home and has no inline script or style attributes', async () => {
		const html = await render(NotFound, '/404/');
		expect(html).toContain('404 - Page Not Found');
		expect(html).toContain('href="/"');
		expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/v);
		expect(html).not.toMatch(/\sstyle="/v);
	});
});
