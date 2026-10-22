import {readFileSync} from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');

/**
 Reads the STRICT policy (the `/*` rule) from the built `_headers`, so the test enforces what Cloudflare will send.
 `astro preview` does not serve `_headers`.
 @returns {string} The Content-Security-Policy value.
 */
export const strictPolicy = () => {
	const headers = readFileSync(path.join(dist, '_headers'), 'utf8');
	const block = headers.split('\n\n').find(part => part.split('\n').some(line => line.trim() === '/*'));
	const line = block?.split('\n').find(candidate => candidate.trimStart().startsWith('Content-Security-Policy:'));
	if (!line) {
		throw new Error('No STRICT Content-Security-Policy for /* found in dist/_headers');
	}

	return line.trim().slice('Content-Security-Policy:'.length).trim();
};

/**
 Picks a built picture detail page from the sitemap.
 @returns {string} Path such as `/picture/exoplanet/`.
 */
export const firstPicturePath = () => {
	const sitemap = readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8');
	const match = /<loc>[^<]*?(?<path>\/picture\/[^\/<]+\/)<\/loc>/v.exec(sitemap);
	if (!match) {
		throw new Error('No /picture/<uid>/ page in dist/sitemap-0.xml, build first');
	}

	return match.groups.path;
};

/**
 Applies the STRICT policy to every document response and records violations.
 @param {import('@playwright/test').Page} page Page to instrument.
 @returns {Promise<string[]>} Live list of violation descriptions.
 */
export const enforceStrictCsp = async page => {
	const policy = strictPolicy();
	const violations = [];
	await page.route('**/*', async route => {
		const response = await route.fetch();
		const headers = route.request().resourceType() === 'document' ? {...response.headers(), 'content-security-policy': policy} : response.headers();

		await route.fulfill({response, headers});
	});
	await page.exposeFunction('reportViolation', description => {
		violations.push(description);
	});
	/* global document */
	await page.addInitScript(() => {
		document.addEventListener('securitypolicyviolation', event => {
			globalThis.reportViolation(`${event.violatedDirective} ${event.blockedURI} ${event.sourceFile ?? ''}`);
		});
	});
	page.on('console', message => {
		if (/content security policy/iv.test(message.text())) {
			violations.push(message.text());
		}
	});
	return violations;
};
