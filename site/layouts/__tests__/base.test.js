import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	afterEach,
	expect,
	test,
	vi,
} from 'vitest';

import Base from '../Base.astro';

const renderBase = async props => {
	const container = await AstroContainer.create({astroConfig: {site: 'https://eyesbound.com', trailingSlash: 'always'}});
	return container.renderToString(Base, {request: new Request('https://eyesbound.com/x/'), props});
};

test('renders canonical, title and description with trailing slash', async () => {
	const container = await AstroContainer.create({astroConfig: {site: 'https://eyesbound.com', trailingSlash: 'always'}});
	const html = await container.renderToString(Base, {
		request: new Request('https://eyesbound.com/picture/exoplanet'),
		props: {title: 'Exoplanet'},
	});

	expect(html).toContain('<link rel="canonical" href="https://eyesbound.com/picture/exoplanet/">');
	expect(html).toContain('<title>Exoplanet | EYESBOUND</title>');
	expect(html).toContain('<meta name="description" content="Portfolio Website for Eyesbound Photography');
});

test('omits optional metadata when no props are given', async () => {
	const html = await renderBase({});
	expect(html).toContain('<title>EYESBOUND</title>');
	expect(html).not.toContain('og:image');
	expect(html).not.toContain('twitter:image');
	expect(html).not.toContain('geo.position');
	expect(html).not.toContain('name="ICBM"');
	expect(html).not.toContain('name="date"');
});

test('emits image, position and date metadata when given', async () => {
	const html = await renderBase({
		title: 'T', imageSource: 'https://eyesbound.com/a.jpg', coordinates: [52.5, 13.4], dateTime: '2020-05-01T10:00:00+0000', description: 'Custom text',
	});
	expect(html).toContain('<meta property="og:image" content="https://eyesbound.com/a.jpg">');
	expect(html).toContain('<meta name="twitter:image" content="https://eyesbound.com/a.jpg">');
	expect(html).toContain('<meta name="geo.position" content="52.5;13.4">');
	expect(html).toContain('<meta name="ICBM" content="52.5, 13.4">');
	expect(html).toContain('<meta name="date" content="2020-05-01T10:00:00+0000">');
	expect(html).toContain('<meta name="description" content="Custom text">');
});

test('derives the site from the request when Astro has no site configured', async () => {
	const container = await AstroContainer.create({astroConfig: {trailingSlash: 'always'}});
	const html = await container.renderToString(Base, {request: new Request('https://preview.example/x/')});
	expect(html).toContain('<link rel="canonical" href="https://preview.example/x/">');
	expect(html).toContain('<meta name="msapplication-starturl" content="https://preview.example/">');
});

afterEach(() => {
	vi.unstubAllEnvs();
});

test('registers the service worker in production only', async () => {
	vi.stubEnv('PROD', true);
	expect(await renderBase({})).toContain('<script src="/register-sw.js" defer></script>');
	vi.stubEnv('PROD', false);
	expect(await renderBase({})).not.toContain('register-sw.js');
});
