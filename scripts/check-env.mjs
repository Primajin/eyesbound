/*
 * Runs before `astro:build` (npm `pre` hook) and names every missing build
 * variable at once, so a misconfigured host fails with a clear message instead
 * of a stack trace from the middle of the build. Prints names only, never values.
 */
import process from 'node:process';

const required = ['PRISMIC_ACCESS_TOKEN', 'MAPS_API_KEY'];

if (process.env.PRISMIC_FIXTURES === '1') {
	console.log('check-env: PRISMIC_FIXTURES=1, building with local fixtures.');
} else {
	const missing = required.filter(name => !process.env[name]?.trim());
	const report = required.map(name => `${name}=${missing.includes(name) ? 'MISSING' : 'set'}`).join(' ');
	console.log(`check-env: ${report}`);

	if (missing.length > 0) {
		console.error(`check-env: missing build variables: ${missing.join(', ')}.`);
		console.error('Set them as build variables/secrets on the host (on Cloudflare: Settings > Builds > Variables and secrets), or locally in .env.local.');
		process.exitCode = 1;
	}
}
