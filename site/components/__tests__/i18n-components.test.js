import {experimental_AstroContainer as AstroContainer} from 'astro/container';
import {expect, test} from 'vitest';

import LanguageSwitcher from '../LanguageSwitcher.astro';
import T from '../T.astro';

test('T emits both languages and never a raw key', async () => {
	const container = await AstroContainer.create();
	const html = await container.renderToString(T, {props: {key: 'navigation.menu'}});
	expect(html).toContain('<span data-lang="en" lang="en">Menu</span>');
	expect(html).toMatch(/<span data-lang="de" lang="de">[^<]+<\/span>/v);
	expect(html).not.toContain('navigation.menu');
});

test('T interpolates params', async () => {
	const container = await AstroContainer.create();
	const html = await container.renderToString(T, {props: {key: 'language.switchTo', params: {language: 'X'}}});
	expect(html).toContain('Switch to X');
});

test('T fails the render on a missing key', async () => {
	const container = await AstroContainer.create();
	await expect(container.renderToString(T, {props: {key: 'nope.nope'}})).rejects.toThrow('Missing translation');
});

test('LanguageSwitcher renders both labels and titles', async () => {
	const container = await AstroContainer.create();
	const html = await container.renderToString(LanguageSwitcher);
	expect(html).toContain('data-language-switcher');
	expect(html).toContain('title="Switch to German"');
	expect(html).toContain('data-title-de=');
	expect(html).not.toContain('language.');
});
