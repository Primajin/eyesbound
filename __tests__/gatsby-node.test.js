import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {findHtmlFiles, injectScriptHashes, processHtmlFiles} from '../gatsby-node.js';

function sha256(content) {
	return crypto.createHash('sha256').update(content).digest('base64');
}

describe('findHtmlFiles', () => {
	const temporaryDir = path.join(os.tmpdir(), 'gatsby-node-test');

	beforeEach(() => {
		fs.mkdirSync(temporaryDir, {recursive: true});
		fs.mkdirSync(path.join(temporaryDir, 'subdir'), {recursive: true});
	});

	afterEach(() => {
		fs.rmSync(temporaryDir, {recursive: true, force: true});
	});

	it('finds HTML files recursively', () => {
		fs.writeFileSync(path.join(temporaryDir, 'index.html'), '<html></html>');
		fs.writeFileSync(path.join(temporaryDir, 'subdir', 'page.html'), '<html></html>');
		fs.writeFileSync(path.join(temporaryDir, 'style.css'), 'body{}');

		const files = findHtmlFiles(temporaryDir);
		expect(files).toHaveLength(2);
		expect(files.every(f => f.endsWith('.html'))).toBe(true);
	});

	it('returns empty array for directory with no HTML files', () => {
		fs.writeFileSync(path.join(temporaryDir, 'style.css'), 'body{}');
		expect(findHtmlFiles(temporaryDir)).toHaveLength(0);
	});
});

describe('injectScriptHashes', () => {
	const cspMeta = '<meta http-equiv="Content-Security-Policy" content="script-src &#x27;self&#x27;; style-src &#x27;self&#x27;"/>';

	it('adds SHA256 hashes for inline scripts to the CSP meta tag', () => {
		const scriptContent = 'console.log("hello")';
		const html = `${cspMeta}<script>${scriptContent}</script>`;

		const result = injectScriptHashes(html);
		const expectedHash = sha256(scriptContent);
		expect(result).toContain(`&#x27;sha256-${expectedHash}&#x27;`);
	});

	it('ignores external scripts with src attribute', () => {
		const html = `${cspMeta}<script src="/app.js"></script>`;

		const result = injectScriptHashes(html);
		expect(result).toBe(html);
	});

	it('ignores empty scripts', () => {
		const html = `${cspMeta}<script>  </script>`;

		const result = injectScriptHashes(html);
		expect(result).toBe(html);
	});

	it('handles multiple inline scripts with unique hashes', () => {
		const script1 = 'var a = 1;';
		const script2 = 'var b = 2;';
		const html = `${cspMeta}<script>${script1}</script><script>${script2}</script>`;

		const result = injectScriptHashes(html);
		expect(result).toContain(`sha256-${sha256(script1)}`);
		expect(result).toContain(`sha256-${sha256(script2)}`);
	});

	it('deduplicates identical inline scripts', () => {
		const scriptContent = 'var x = 1;';
		const html = `${cspMeta}<script>${scriptContent}</script><script>${scriptContent}</script>`;

		const result = injectScriptHashes(html);
		const hash = `sha256-${sha256(scriptContent)}`;
		const occurrences = result.split(hash).length - 1;
		expect(occurrences).toBe(1);
	});

	it('handles scripts with type="module" attribute', () => {
		const scriptContent = 'const e = document.body;';
		const html = `${cspMeta}<script type="module">${scriptContent}</script>`;

		const result = injectScriptHashes(html);
		expect(result).toContain(`sha256-${sha256(scriptContent)}`);
	});

	it('handles mixed inline and external scripts', () => {
		const inlineContent = 'window.pagePath="/";';
		const html = `${cspMeta}<script>${inlineContent}</script><script src="/app.js"></script>`;

		const result = injectScriptHashes(html);
		expect(result).toContain(`sha256-${sha256(inlineContent)}`);
	});

	it('returns unchanged HTML when no CSP meta tag exists', () => {
		const html = '<html><script>var a = 1;</script></html>';

		const result = injectScriptHashes(html);
		expect(result).toBe(html);
	});

	it('handles multiline script content correctly', () => {
		const scriptContent = `
			(function() {
				var isDark = true;
				document.documentElement.style.colorScheme = 'dark';
			})();
		`;
		const html = `${cspMeta}<script>${scriptContent}</script>`;

		const result = injectScriptHashes(html);
		expect(result).toContain(`sha256-${sha256(scriptContent)}`);
	});

	it('preserves other CSP directives when adding hashes', () => {
		const scriptContent = 'var a = 1;';
		const html = `${cspMeta}<script>${scriptContent}</script>`;

		const result = injectScriptHashes(html);
		expect(result).toContain('style-src');
		expect(result).toContain('script-src');
	});
});

describe('processHtmlFiles', () => {
	const temporaryDir = path.join(os.tmpdir(), 'gatsby-node-process-test');
	const cspMeta = '<meta http-equiv="Content-Security-Policy" content="script-src &#x27;self&#x27;; style-src &#x27;self&#x27;"/>';

	beforeEach(() => {
		fs.mkdirSync(temporaryDir, {recursive: true});
		fs.mkdirSync(path.join(temporaryDir, 'subdir'), {recursive: true});
	});

	afterEach(() => {
		fs.rmSync(temporaryDir, {recursive: true, force: true});
	});

	it('injects hashes into HTML files on disk', () => {
		const scriptContent = 'var x = 1;';
		const html = `${cspMeta}<script>${scriptContent}</script>`;
		fs.writeFileSync(path.join(temporaryDir, 'index.html'), html);

		processHtmlFiles(temporaryDir);

		const result = fs.readFileSync(path.join(temporaryDir, 'index.html'), 'utf8');
		expect(result).toContain(`sha256-${sha256(scriptContent)}`);
	});

	it('processes files in subdirectories', () => {
		const scriptContent = 'var y = 2;';
		const html = `${cspMeta}<script>${scriptContent}</script>`;
		fs.writeFileSync(path.join(temporaryDir, 'subdir', 'page.html'), html);

		processHtmlFiles(temporaryDir);

		const result = fs.readFileSync(path.join(temporaryDir, 'subdir', 'page.html'), 'utf8');
		expect(result).toContain(`sha256-${sha256(scriptContent)}`);
	});

	it('skips files that do not need modification', () => {
		const html = `${cspMeta}<script src="/app.js"></script>`;
		const filePath = path.join(temporaryDir, 'external.html');
		fs.writeFileSync(filePath, html);
		const {mtimeMs} = fs.statSync(filePath);

		processHtmlFiles(temporaryDir);

		const result = fs.readFileSync(filePath, 'utf8');
		expect(result).toBe(html);
		expect(fs.statSync(filePath).mtimeMs).toBe(mtimeMs);
	});
});
