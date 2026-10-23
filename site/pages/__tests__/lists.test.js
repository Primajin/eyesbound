import {readFileSync} from 'node:fs';
import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	afterAll,
	beforeAll,
	describe,
	expect,
	test,
} from 'vitest';

import de from '../../i18n/locales/de.json';
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

const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll('\'', '&#39;');
const policyPath = lang => new URL(`../../content/privacy/privacy.${lang}.md`, import.meta.url);
const numberedHeadings = lang => readFileSync(policyPath(lang), 'utf8').matchAll(/^## \*\*(?<number>\d+)\. /gmv).map(match => Number(match.groups.number)).toArray();
const policies = {
	en: {
		opening: 'We are pleased that you are interested in our organization.',
		cloudflare: 'Cloudflare offers a wide range of services to improve the security, performance and reliability of websites and web applications.',
		maps: 'Google Maps is a comprehensive mapping and navigation service provided by Google LLC',
		closing: 'This privacy policy was created using a generator developed with the support of',
	},
	de: {
		opening: 'Es freut uns sehr, dass Sie sich für unsere Organisation interessieren.',
		cloudflare: 'Cloudflare bietet eine breite Palette an Diensten zur Verbesserung der Sicherheit, Leistung und Zuverlässigkeit von Webseiten und Webanwendungen.',
		maps: 'Google Maps ist ein umfangreicher Kartierungs- und Navigationsdienst der Google LLC',
		closing: 'Die oben stehende Datenschutzerklärung wurde mit Unterstützung eines Generators erstellt',
	},
};
// Assembled from fragments so this file does not itself contain the withheld address and phone data
const withheld = [['Ber', 'ner'], ['Friedrich', '-Wilhelm'], ['8418', '3026'], ['122', '05'], ['121', '61']].map(parts => parts.join(''));

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

	test('imprint renders both generated privacy policies in language wrappers with the anchor and the withdraw control', async () => {
		const html = await render(Imprint, '/imprint/');
		expect(html.match(/<h2 id="privacy-policy"/gv)).toHaveLength(1);
		expect(html.match(/id="privacy-policy"/gv)).toHaveLength(1);
		const english = html.indexOf('<div class="policy" data-lang="en" lang="en"');
		const german = html.indexOf('<div class="policy" data-lang="de" lang="de"');
		expect(english).toBeGreaterThan(0);
		expect(german).toBeGreaterThan(english);
		const sections = {
			en: html.slice(english, german),
			de: html.slice(german),
		};
		for (const lang of ['en', 'de']) {
			const text = policies[lang];
			expect(sections[lang], lang).toContain(text.opening);
			expect(sections[lang], lang).toContain(text.cloudflare);
			expect(sections[lang], lang).toContain(text.maps);
			expect(sections[lang], lang).toContain(text.closing);
			expect(sections[lang], lang).toContain('href="mailto:admin@eyesbound.com"');
			expect(sections[lang].match(/<h3 id="\d+-/gv), lang).toHaveLength(numberedHeadings('en').length);
			expect(sections[lang], lang).not.toContain('<h1');
			expect(sections[lang], lang).not.toContain('<h2');
			const at = needle => sections[lang].indexOf(needle);
			const [settingsHeading, settingsText, mapsHeading] = [t('privacy.settings.heading', lang), escape(t('privacy.settings.text', lang)), t('privacy.maps.heading', lang)];
			expect(at(text.maps), lang).toBeLessThan(at(settingsHeading));
			expect(at(settingsHeading), lang).toBeLessThan(at(settingsText));
			expect(at(settingsText), lang).toBeLessThan(at(mapsHeading));
			expect(sections[lang].indexOf(t('privacy.maps.heading', lang)), lang).toBeLessThan(sections[lang].indexOf(text.closing));
			const subsection = sections[lang].slice(sections[lang].indexOf(t('privacy.maps.heading', lang)), sections[lang].indexOf(text.closing));
			expect(subsection, lang).not.toMatch(/Art\.|GDPR|DSGVO|legal basis|Rechtsgrundlage/v);
			expect(sections[lang], lang).toContain(escape(t('privacy.withdraw.button', lang)));
			expect(sections[lang], lang).toContain(escape(t('privacy.withdraw.done', lang)));
		}

		expect(html.match(/<button[^>]*data-map-consent-revoke[^>]*>/gv)).toHaveLength(2);
		expect(html.match(/data-map-consent-done hidden/gv)).toHaveLength(2);
		expect(html).not.toMatch(/privacy\.\w+\.\w+/v);
		expect(html).not.toContain('{{');
	});

	test('external policy links open safely', async () => {
		const html = await render(Imprint, '/imprint/');
		expect(html).toContain('<a href="https://www.cloudflare.com" target="_blank" rel="noreferrer">');
		expect(html).toContain('<a href="mailto:admin@eyesbound.com">');
	});

	test('no policy link target ends in punctuation', async () => {
		const html = await render(Imprint, '/imprint/');
		const targets = html.matchAll(/<a href="(?<url>https?:[^"]*)"/gv).map(match => match.groups.url).toArray();
		expect(targets.length).toBeGreaterThan(8);
		for (const target of targets) {
			expect(target).not.toMatch(/[\),.:;]$/v);
		}
	});

	test('both generated policies number their sections 1 to n without gaps and in parallel', () => {
		const english = numberedHeadings('en');
		expect(english.length).toBeGreaterThan(0);
		expect(english).toEqual(english.map((_, index) => index + 1));
		expect(numberedHeadings('de')).toEqual(english);
	});

	test('the generated policies keep none of the customer, staff, shareholder or social media wording', () => {
		const removed = {
			en: ['social media', 'customer', 'business partners', 'shareholders', 'injured', 'Recital 47'],
			de: ['Social Media', 'Kunde', 'Geschäftspartner', 'Anteilseigner', 'verletzt', 'Erwägungsgrund 47'],
		};
		for (const [lang, phrases] of Object.entries(removed)) {
			const source = readFileSync(policyPath(lang), 'utf8');
			for (const phrase of phrases) {
				expect(source, `${lang}: ${phrase}`).not.toContain(phrase);
			}
		}
	});

	test('the imprint publishes no street address, postcode or phone number', async () => {
		const html = await render(Imprint, '/imprint/');
		const sources = [
			html,
			readFileSync(policyPath('en'), 'utf8'),
			readFileSync(policyPath('de'), 'utf8'),
			JSON.stringify(en),
			JSON.stringify(de),
		];
		for (const source of sources) {
			for (const forbidden of withheld) {
				expect(source).not.toContain(forbidden);
			}
		}
	});

	test('the controller section keeps only name, privacy e-mail and website', async () => {
		const html = await render(Imprint, '/imprint/');
		expect(html).toContain('<p>Jannis Hell</p>');
		expect(html).toContain('Website: eyesbound.com');
		expect(html).not.toMatch(/(?:Phone|Tel)\.:/v);
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

	test('every remaining imprint text exists in English and German', async () => {
		const html = await render(Imprint, '/imprint/');
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
				expect(html, `${key} (${lang})`).toContain(escape(t(key, lang)));
			}
		}

		expect(html.match(/<span data-lang="en" lang="en">/gv)).toHaveLength(html.match(/<span data-lang="de" lang="de">/gv).length);
		expect(html).toContain('E-Mail</span>: admin@eyesbound.com');
		expect(html).toContain('lang="de">Deutschland</span>');
		expect(html).toContain('data-title-de="Namensnennung');
	});

	test('404 page links home and has no inline script or style attributes', async () => {
		const html = await render(NotFound, '/404/');
		expect(html).toContain('404 - Page Not Found');
		expect(html).toContain('href="/"');
		expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/v);
		expect(html).not.toMatch(/\sstyle="/v);
	});
});
