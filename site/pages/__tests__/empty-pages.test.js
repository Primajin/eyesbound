import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {
	afterEach,
	beforeAll,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import {getHomepagePictures, getMapPictures} from '../../lib/prismic.js';
import Index from '../index.astro';
import Worldmap from '../worldmap.astro';

vi.mock('../../lib/prismic.js', async importOriginal => {
	const original = await importOriginal();
	return {
		...original,
		getHomepagePictures: vi.fn(original.getHomepagePictures),
		getMapPictures: vi.fn(original.getMapPictures),
	};
});

let container;
beforeAll(async () => {
	vi.stubEnv('PRISMIC_FIXTURES', '1');
	container = await AstroContainer.create({astroConfig: {site: 'https://eyesbound.com', trailingSlash: 'always'}});
});

afterEach(() => {
	vi.mocked(getHomepagePictures).mockClear();
	vi.mocked(getMapPictures).mockClear();
});

const render = (page, path) => container.renderToString(page, {request: new Request(`https://eyesbound.com${path}`)});

describe('empty data fails the build instead of shipping a blank page', () => {
	test('home page without a homepage picture', async () => {
		vi.mocked(getHomepagePictures).mockResolvedValueOnce([]);
		await expect(render(Index, '/')).rejects.toThrow('No picture is flagged for the homepage');
	});

	test('worldmap without a located picture', async () => {
		vi.mocked(getMapPictures).mockResolvedValueOnce([]);
		await expect(render(Worldmap, '/worldmap/')).rejects.toThrow('No pictures with coordinates');
	});

	test('both pages still render with data', async () => {
		expect(await render(Index, '/')).toContain('data-slideshow');
		expect(await render(Worldmap, '/worldmap/')).toContain('data-map');
	});
});
