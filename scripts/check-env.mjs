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
	const state = name => {
		const value = process.env[name];
		if (value === undefined) {
			return 'absent';
		}

		return value.trim() ? 'set' : 'empty';
	};

	const missing = required.filter(name => state(name) !== 'set');
	console.log(`check-env: ${required.map(name => `${name}=${state(name)}`).join(' ')}`);

	if (missing.length > 0) {
		// Names only (JSON-quoted so stray whitespace shows): helps spot typos on a host.
		const similar = Object.keys(process.env).filter(name => /prismic|maps|node_version/iv.test(name));
		console.log(`check-env: similar variable names seen: ${JSON.stringify(similar)}`);
	}

	if (missing.length > 0) {
		console.error(`check-env: missing build variables: ${missing.join(', ')}.`);
		console.error('Set them as build variables/secrets on the host (on Cloudflare: Settings > Builds > Variables and secrets), or locally in .env.local.');
		process.exitCode = 1;
	}
}
