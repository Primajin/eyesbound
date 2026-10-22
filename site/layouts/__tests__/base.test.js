import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {expect, test} from 'vitest';

import Base from '../Base.astro';

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
