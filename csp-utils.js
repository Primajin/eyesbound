const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function findHtmlFiles(directory) {
	const files = [];
	for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...findHtmlFiles(fullPath));
		} else if (entry.name.endsWith('.html')) {
			files.push(fullPath);
		}
	}

	return files;
}

function injectScriptHashes(html) {
	const hashes = new Set();
	for (const [fullMatch, content] of html.matchAll(/<script(?:\s[^>]*)?>([^]*?)<\/script[^>]*>/gi)) {
		if (!fullMatch.includes(' src=') && content.trim()) {
			const hash = crypto.createHash('sha256').update(content).digest('base64');
			hashes.add(`'sha256-${hash}'`);
		}
	}

	if (hashes.size === 0) {
		return html;
	}

	const hashString = [...hashes].join(' ');

	return html.replace(
		/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/i,
		cspTag => cspTag.replace(/content="([^"]*)"/, (_, cspContent) => {
			const decoded = cspContent.replaceAll('&#x27;', '\'');
			const updated = decoded.replace(/(script-src\s+[^;]*?)(?=;|$)/, `$1 ${hashString}`);
			return `content="${updated.replaceAll('\'', '&#x27;')}"`;
		}),
	);
}

function processHtmlFiles(directory) {
	for (const file of findHtmlFiles(directory)) {
		const html = fs.readFileSync(file, 'utf8');
		const updatedHtml = injectScriptHashes(html);
		if (updatedHtml !== html) {
			fs.writeFileSync(file, updatedHtml);
		}
	}
}

module.exports = {findHtmlFiles, injectScriptHashes, processHtmlFiles};
