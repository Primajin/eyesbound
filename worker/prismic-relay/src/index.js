// Prismic -> GitHub `workflow_dispatch` relay (see README.md in this folder).
// Prismic webhooks cannot send a custom body (GitHub requires `ref`) and
// expect HTTP 200 (GitHub answers 204 or 200), so this Worker translates.
// The GitHub token never leaves Cloudflare; Prismic only holds the shared secret.

const maxBodyBytes = 65_536;
const workflowFile = 'content-deploy.yml';
const encoder = new TextEncoder();

const respond = (status, message) => Response.json({message}, {
	status,
	headers: {'cache-control': 'no-store'},
});

// Compare SHA-256 digests byte by byte without early exit, so the comparison
// time does not depend on how much of the secret matched.
const secretsMatch = async (given, expected) => {
	if (typeof given !== 'string' || typeof expected !== 'string' || expected === '') {
		return false;
	}

	const [a, b] = await Promise.all([given, expected].map(async value => new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))));
	// Same length (32 bytes); every pair is visited, no early exit.
	return a.map((byte, index) => (byte === b[index] ? 0 : 1)).reduce((sum, bad) => sum + bad, 0) === 0;
};

const handle = async (request, env) => {
	if (request.method !== 'POST') {
		return respond(405, 'Method not allowed');
	}

	if (!env.PRISMIC_WEBHOOK_SECRET || !env.GITHUB_TOKEN || !env.GITHUB_REPO) {
		return respond(500, 'Relay is not configured');
	}

	// Refuse a declared oversized body before reading it; the check after reading
	// still covers bodies without (or with a lying) Content-Length.
	if (Number(request.headers.get('content-length')) > maxBodyBytes) {
		return respond(413, 'Payload too large');
	}

	const text = await request.text();
	if (encoder.encode(text).length > maxBodyBytes) {
		return respond(413, 'Payload too large');
	}

	let payload;
	try {
		payload = JSON.parse(text);
	} catch {
		return respond(400, 'Invalid JSON');
	}

	if (!await secretsMatch(payload?.secret, env.PRISMIC_WEBHOOK_SECRET)) {
		return respond(401, 'Unauthorized');
	}

	// Prismic's "Test trigger" button: acknowledge, do not build.
	if (payload.type === 'test-trigger') {
		return respond(200, 'Test trigger received, no dispatch');
	}

	// Nothing from the Prismic payload is forwarded to GitHub.
	let response;
	try {
		response = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/actions/workflows/${workflowFile}/dispatches`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${env.GITHUB_TOKEN}`,
				accept: 'application/vnd.github+json',
				'content-type': 'application/json',
				'x-github-api-version': '2022-11-28',
				'user-agent': 'eyesbound-prismic-relay',
			},
			body: JSON.stringify({ref: env.GITHUB_REF || 'main'}),
		});
	} catch {
		console.error('GitHub dispatch failed: network error');
		return respond(502, 'GitHub dispatch failed');
	}

	// 204 historically, 200 with run details on newer API versions.
	if (response.status >= 200 && response.status < 300) {
		return respond(200, 'Dispatched');
	}

	// Never echo GitHub's body (could contain details); a non-200 makes Prismic retry.
	console.error(`GitHub dispatch failed with HTTP ${response.status}`);
	return respond(502, 'GitHub dispatch failed');
};

const worker = {fetch: handle};

export default worker;
