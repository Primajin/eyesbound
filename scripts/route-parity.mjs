import {readFile} from 'node:fs/promises';
import process from 'node:process';
import {getRoutes} from '../site/lib/prismic.js';
import {diffRoutes, parseSitemap} from '../site/lib/routes.js';

const liveSitemap = 'https://eyesbound.com/sitemap-0.xml';
const source = process.argv[2] ?? liveSitemap;

const loadExpected = async () => {
	if (/^https?:/v.test(source)) {
		const response = await fetch(source);
		if (!response.ok) {
			throw new Error(`Could not fetch ${source}: HTTP ${response.status}`);
		}

		return parseSitemap(await response.text());
	}

	const content = await readFile(source, 'utf8');
	return content.split('\n').map(line => line.trim()).filter(Boolean);
};

const expected = await loadExpected();
const {missing, extra} = diffRoutes(expected, await getRoutes());

console.log(`expected ${expected.length} routes (${source})`);
for (const route of missing) {
	console.log(`missing: ${route}`);
}

for (const route of extra) {
	console.log(`extra:   ${route}`);
}

if (missing.length > 0 || extra.length > 0) {
	console.error('Route parity check failed.');
	process.exitCode = 1;
} else {
	console.log('Route parity OK.');
}
