import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	beforeAll,
	describe,
	expect,
	test,
} from 'vitest';

import Fullscreen from '../Fullscreen.astro';
import Group from '../Group.astro';
import Header from '../Header.astro';
import List from '../List.astro';
import LocalizedDate from '../LocalizedDate.astro';
import MainWrapper from '../MainWrapper.astro';
import Member from '../Member.astro';
import Navigation from '../Navigation.astro';
import PictureImage from '../PictureImage.astro';
import TagLinks from '../TagLinks.astro';
import Thumbnails from '../Thumbnails.astro';

const image = {
	url: 'https://images.prismic.io/eyesbound/a.jpg?auto=compress,format', alt: 'A alt', width: 1500, height: 1000,
};
const picture = {
	uid: 'a', title: 'A', image, thumbnail: {...image, width: 280, height: 187},
};

let container;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (component, props, options = {}) => container.renderToString(component, {props, ...options});

describe('Header and Navigation', () => {
	test('Header renders logo, navigation, language and theme switchers', async () => {
		const html = await render(Header);
		expect(html).toContain('class="logo');
		expect(html).toContain('data-navigation');
		expect(html).toContain('data-language-switcher');
		expect(html).toContain('data-theme-switcher');
	});

	test('Navigation links all use trailing slashes and localized labels, never raw keys', async () => {
		const html = await render(Navigation);
		const hrefs = html.matchAll(/<a[^>]*href="(?<href>[^"]+)"/gv).map(({groups}) => groups.href).toArray();
		expect(hrefs).toEqual(['/picture/', '/series/shuttered/', '/category/architecture/', '/category/environment/', '/category/floral/', '/category/light/', '/worldmap/', '/imprint/']);
		expect(html).toContain('<span data-lang="de" lang="de">Übersicht</span>');
		expect(html).toContain('aria-expanded="false"');
		expect(html).not.toMatch(/navigation\.\w+/v);
	});
});

describe('Fullscreen', () => {
	test('renders an accessible toggle bound to the selector', async () => {
		const html = await render(Fullscreen, {selector: '[data-fullscreen-target]'});
		expect(html).toContain('data-fullscreen-toggle="[data-fullscreen-target]"');
		expect(html).toContain('aria-pressed="false"');
		expect(html).toContain('Toggle fullscreen');
	});
});

describe('content components', () => {
	test('MainWrapper renders its slot in main', async () => {
		const html = await render(MainWrapper, {}, {slots: {default: '<p>inside</p>'}});
		expect(html).toMatch(/<main[^>]*>\s*<p>inside<\/p>\s*<\/main>/v);
	});

	test('TagLinks separates links with a pipe and uses the uid when untitled', async () => {
		const html = await render(TagLinks, {tags: [{uid: 'one', title: 'One'}, {uid: 'two', title: null}]});
		expect(html).toContain('<a href="/tag/one/">One</a> | <a href="/tag/two/">two</a>');
	});

	test('List shows the count and keeps dotted uids unchanged', async () => {
		const html = await render(List, {items: [{uid: 'holland-8664-z.z.g.', title: 'Holland'}], type: {path: 'series'}});
		expect(html).toContain('lang="en">Series</span><span data-lang="de" lang="de">Serien</span> (1)');
		expect(html).toContain('href="/series/holland-8664-z.z.g./"');
	});

	test('List falls back to the uid for an untitled item', async () => {
		const html = await render(List, {items: [{uid: 'bare', title: null}], type: {path: 'tag'}});
		expect(html).toContain('<a href="/tag/bare/">bare</a>');
	});

	test('Group wraps the list in main', async () => {
		const html = await render(Group, {items: [{uid: 'x', title: 'X'}], type: {path: 'tag'}});
		expect(html).toContain('<main');
		expect(html).toContain('lang="en">Tags</span><span data-lang="de" lang="de">Schlagwörter</span> (1)');
	});

	test('LocalizedDate renders both languages from one ISO datetime', async () => {
		const html = await render(LocalizedDate, {datetime: '2020-05-01T10:00:00+0000'});
		expect(html).toContain('<time datetime="2020-05-01T10:00:00.000Z">');
		expect(html).toContain('May 01, 2020');
		expect(html).toContain('01. Mai 2020');
	});

	test('LocalizedDate fails on an invalid datetime', async () => {
		await expect(render(LocalizedDate, {datetime: 'nope'})).rejects.toThrow('Invalid datetime');
	});
});

describe('images', () => {
	const props = {
		image, displayWidth: 1072, sizes: '90vw',
	};

	test('PictureImage lazy loads with explicit dimensions, alt and AVIF/WebP sources', async () => {
		const html = await render(PictureImage, props);
		expect(html).toContain('loading="lazy"');
		expect(html).toContain('width="1072"');
		expect(html).toContain('height="715"');
		expect(html).toContain('alt="A alt"');
		expect(html).toContain('type="image/avif"');
		expect(html).toContain('type="image/webp"');
		expect(html).not.toContain('fetchpriority="high"');
	});

	test('PictureImage priority is eager with high fetch priority', async () => {
		const html = await render(PictureImage, {...props, priority: true});
		expect(html).toContain('loading="eager"');
		expect(html).toContain('fetchpriority="high"');
	});

	test('PictureImage fails the render for an image without dimensions', async () => {
		await expect(render(PictureImage, {...props, image: {...image, width: null}})).rejects.toThrow('has no dimensions');
	});

	test('Thumbnails link to the picture and prefer the full image for sharp high-density thumbnails', async () => {
		const html = await render(Thumbnails, {pictures: [picture], title: 'Floral', typeKey: 'assetTypes.category.name'});
		expect(html).toContain('lang="en">Category</span><span data-lang="de" lang="de">Kategorie</span>: Floral (1)');
		expect(html).toContain('href="/picture/a/"');
		expect(html).toContain('aria-label="A"');
		expect(html).toContain('width="261"');
		expect(html).toContain('522w');
	});

	test('Thumbnails load only the first thumbnail eagerly with high priority', async () => {
		const html = await render(Thumbnails, {pictures: [picture, {...picture, uid: 'b'}], title: 'Floral', typeKey: 'assetTypes.category.name'});
		expect(html.match(/loading="eager"/gv)).toHaveLength(1);
		expect(html.match(/fetchpriority="high"/gv)).toHaveLength(1);
		expect(html.match(/loading="lazy"/gv)).toHaveLength(1);
		expect(html.indexOf('loading="eager"')).toBeLessThan(html.indexOf('loading="lazy"'));
	});

	test('Thumbnails fall back to the thumbnail when there is no full image', async () => {
		const html = await render(Thumbnails, {pictures: [{...picture, image: null}], title: 'Floral', typeKey: 'assetTypes.category.name'});
		expect(html).toContain('<img');
		expect(html).not.toContain('522w');
	});

	test('Thumbnails show the title instead of an image for a picture without one', async () => {
		const html = await render(Thumbnails, {pictures: [{...picture, image: null, thumbnail: null}], title: 'Floral', typeKey: 'assetTypes.category.name'});
		expect(html).toContain('href="/picture/a/"');
		expect(html).toMatch(/<span class="missing"[^>]*>A<\/span>/v);
		expect(html).not.toContain('<img');
	});

	test('Thumbnails name an untitled picture by its uid, with or without an image', async () => {
		const untitled = {...picture, title: null};
		const imageless = {
			...untitled, uid: 'b', image: null, thumbnail: null,
		};
		const html = await render(Thumbnails, {pictures: [untitled, imageless], title: 'Floral', typeKey: 'assetTypes.category.name'});
		expect(html).toContain('aria-label="a"');
		expect(html).toContain('alt="A alt"');
		expect(html).toMatch(/<span class="missing"[^>]*>b<\/span>/v);
	});

	test('Member wraps thumbnails in main', async () => {
		const html = await render(Member, {pictures: [picture], typeKey: 'assetTypes.series.name', title: 'Berlin'});
		expect(html).toContain('<main');
		expect(html).toContain('lang="de">Serie</span>: Berlin (1)');
	});
});
