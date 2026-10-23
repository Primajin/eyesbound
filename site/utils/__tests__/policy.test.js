import {describe, expect, test} from 'vitest';

import {preparePolicyHtml} from '../policy.js';

const sample = '<h1 id="privacy-policy"><strong>Policy</strong></h1>\n<p>Intro</p>\n<h2 id="1-one">1. One</h2>\n<p>See <a href="https://example.com/x">link</a> or <a href="mailto:a@b.c">mail</a>.</p>\n<p>Closing <a href="https://example.org">attribution</a>.</p>\n';

describe('preparePolicyHtml', () => {
	test('drops the h1, demotes h2 to h3 and opens external links safely', () => {
		const {body} = preparePolicyHtml(sample);
		expect(body).not.toContain('<h1');
		expect(body).not.toContain('<h2');
		expect(body).toContain('<h3 id="1-one">1. One</h3>');
		expect(body).toContain('<a href="https://example.com/x" target="_blank" rel="noreferrer">link</a>');
		expect(body).toContain('<a href="mailto:a@b.c">mail</a>');
	});

	test('splits off the closing paragraph only', () => {
		const {body, closing} = preparePolicyHtml(sample);
		expect(closing).toBe('<p>Closing <a href="https://example.org" target="_blank" rel="noreferrer">attribution</a>.</p>\n');
		expect(body).toContain('<p>See ');
		expect(body).not.toContain('Closing');
	});

	test('fails loudly when the expected structure is missing', () => {
		expect(() => preparePolicyHtml('<p>No heading</p>')).toThrow('no h1');
		expect(() => preparePolicyHtml('<h1>Only a heading</h1>')).toThrow('no closing paragraph');
	});
});
