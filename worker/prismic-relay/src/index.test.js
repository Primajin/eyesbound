import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import worker from './index.js';

const env = {
	PRISMIC_WEBHOOK_SECRET: 'shared-secret',
	GITHUB_TOKEN: 'github_pat_placeholder',
	GITHUB_REPO: 'Primajin/eyesbound',
};

const post = (body, options = {}) => new Request('https://relay.example/', {
	method: options.method ?? 'POST',
	body: typeof body === 'string' ? body : JSON.stringify(body),
});

const call = (request, testEnv = env) => worker.fetch(request, testEnv);

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('prismic relay', () => {
	it('rejects non-POST requests', async () => {
		const response = await call(new Request('https://relay.example/'));
		expect(response.status).toBe(405);
	});

	it('fails closed when not configured', async () => {
		const response = await call(post({}), {...env, PRISMIC_WEBHOOK_SECRET: ''});
		expect(response.status).toBe(500);
	});

	it('rejects oversized and invalid bodies', async () => {
		const large = await call(post('x'.repeat(70_000)));
		const invalid = await call(post('not json'));
		expect(large.status).toBe(413);
		expect(invalid.status).toBe(400);
	});

	it('rejects a declared oversized body without reading it', async () => {
		const text = vi.fn();
		const response = await call({method: 'POST', headers: new Headers({'content-length': '1000000'}), text});
		expect(response.status).toBe(413);
		expect(text).not.toHaveBeenCalled();
	});

	it('rejects a wrong or missing secret without calling GitHub', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		const bodies = [{type: 'api-update', secret: 'nope'}, {type: 'api-update', secret: null}, 'null'];
		const responses = await Promise.all(bodies.map(async body => call(post(body))));
		const statuses = responses.map(response => response.status);

		expect(statuses).toEqual([401, 401, 401]);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('acknowledges test triggers without dispatching', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		const response = await call(post({type: 'test-trigger', secret: 'shared-secret'}));
		expect(response.status).toBe(200);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('dispatches a fixed event and forwards nothing from the payload', async () => {
		const fetchMock = vi.fn().mockResolvedValue(new Response(null, {status: 204}));
		vi.stubGlobal('fetch', fetchMock);
		const response = await call(post({
			type: 'api-update',
			secret: 'shared-secret',
			documents: ['abc'],
			domain: 'x',
		}));
		expect(response.status).toBe(200);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://api.github.com/repos/Primajin/eyesbound/dispatches');
		expect(init.method).toBe('POST');
		expect(init.headers.authorization).toBe('Bearer github_pat_placeholder');
		expect(JSON.parse(init.body)).toEqual({event_type: 'prismic-publish'}); // eslint-disable-line camelcase
	});

	it('answers 502 (so Prismic retries) when GitHub refuses, without leaking details', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('secret detail', {status: 401})));
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const response = await call(post({type: 'api-update', secret: 'shared-secret'}));
		expect(response.status).toBe(502);
		expect(await response.text()).not.toContain('secret detail');
	});
});
