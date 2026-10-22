import {
	afterEach,
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

const getAllByType = vi.fn(async () => []);
const createClient = vi.fn(() => ({getAllByType}));
vi.mock('@prismicio/client', () => ({createClient}));

const load = async () => {
	vi.resetModules();
	return import('../prismic.js');
};

beforeEach(() => {
	vi.stubEnv('PRISMIC_FIXTURES', '');
	vi.stubEnv('PRISMIC_ACCESS_TOKEN', '');
	getAllByType.mockClear();
	createClient.mockClear();
});

afterEach(() => {
	vi.unstubAllEnvs();
});

describe('real mode', () => {
	test('fails clearly without a token, even if the repo is otherwise configured', async () => {
		const {getAllPictures} = await load();
		await expect(getAllPictures()).rejects.toThrow('PRISMIC_ACCESS_TOKEN is missing');
		expect(getAllByType).not.toHaveBeenCalled();
	});

	test('fetches each type once, with fetchLinks, and caches the result', async () => {
		vi.stubEnv('PRISMIC_ACCESS_TOKEN', 'test-token');
		const {getAllPictures, getHomepagePictures, getMapPictures, getRoutes} = await load();
		await Promise.all([getAllPictures(), getHomepagePictures(), getMapPictures(), getRoutes()]);
		expect(getAllByType.mock.calls.map(([type]) => type).toSorted((a, b) => a.localeCompare(b))).toEqual(['category', 'picture', 'series', 'tags']);
		expect(getAllByType).toHaveBeenCalledWith('picture', expect.objectContaining({fetchLinks: ['category.title', 'series.title', 'tags.title']}));
		expect(createClient).toHaveBeenCalledWith('eyesbound', {accessToken: 'test-token'});
	});
});

describe('fixture mode', () => {
	beforeEach(() => {
		vi.stubEnv('PRISMIC_FIXTURES', '1');
	});

	test('serves fixtures without a token or API call', async () => {
		const {getAllPictures, isUsingFixtures, getCategories} = await load();
		expect(isUsingFixtures()).toBe(true);
		const [first] = await getAllPictures();
		const categories = await getCategories();
		expect(first.uid).toBe('home-7');
		expect(categories.map(({title}) => title)).toEqual(['Abstract', 'Architecture']);
		expect(getAllByType).not.toHaveBeenCalled();
	});

	test('is not enabled by anything but PRISMIC_FIXTURES=1', async () => {
		vi.stubEnv('PRISMIC_FIXTURES', 'true');
		const lib = await load();
		expect(lib.isUsingFixtures()).toBe(false);
	});

	test('derived getters filter the cached list', async () => {
		const lib = await load();
		expect(await lib.getHomepagePictures()).toHaveLength(5);
		const holland = await lib.getPicturesBySeries('holland');
		const architecture = await lib.getPicturesByCategory('architecture');
		const hdr = await lib.getPicturesByTag('hdr');
		expect(holland.map(({uid}) => uid)).toEqual(['home-6', 'holland-8664-z.z.g.']);
		expect(architecture.length).toBeGreaterThan(0);
		expect(hdr.length).toBeGreaterThan(0);
	});

	test('getStaticPathsFor keeps uids unnormalised', async () => {
		const lib = await load();
		const paths = await lib.getStaticPathsFor('picture');
		expect(paths.map(({params}) => params.uid)).toContain('holland-8664-z.z.g.');
		expect(paths[0].props.item.uid).toBe(paths[0].params.uid);
	});

	test('routes include all families and the dotted uid', async () => {
		const lib = await load();
		const all = await lib.getRoutes();
		expect(all).toContain(lib.routes.picture('holland-8664-z.z.g.'));
		expect(all).toEqual(expect.arrayContaining(['/', '/worldmap/', '/imprint/', '/category/abstract/', '/series/berlin/', '/tag/hdr/', '/tag/']));
	});
});
