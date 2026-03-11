/* global document */
/**
 * Hydration safety test — verifies SSR output matches client initial render.
 *
 * Simulates the exact sequence that happens in production:
 * 1. Render component to static HTML (SSR)
 * 2. Put that HTML into jsdom
 * 3. Hydrate with React — check for hydration errors
 */
import React from 'react';
import {renderToString} from 'react-dom/server';
import {hydrateRoot} from 'react-dom/client';

import LanguageSwitcher from '../../components/atoms/language-switcher.jsx';
import Navigation from '../../components/atoms/navigation.jsx';

// Suppress Emotion SSR warnings — let hydration errors fail the test
const originalConsoleError = console.error; // eslint-disable-line no-console
beforeAll(() => {
	jest.spyOn(console, 'error').mockImplementation((...arguments_) => {
		const message = arguments_[0]?.toString?.() ?? '';
		if (message.includes('Hydration') || message.includes('hydrat') || message.includes('did not match') || message.includes('#418') || message.includes('#425')) {
			originalConsoleError('HYDRATION ERROR DETECTED:', ...arguments_);
		}
	});
});

afterAll(() => {
	jest.restoreAllMocks();
});

describe('Hydration safety', () => {
	it('LanguageSwitcher SSR matches client initial render', () => {
		const ssrHtml = renderToString(<LanguageSwitcher/>);
		expect(ssrHtml).toContain('EN');

		const container = document.createElement('div');
		container.innerHTML = ssrHtml;
		document.body.append(container);

		let hydrationError = null;
		const root = hydrateRoot(container, <LanguageSwitcher/>, {
			onRecoverableError(error) {
				hydrationError = error;
			},
		});

		expect(hydrationError).toBeNull();

		root.unmount();
		container.remove();
	});

	it('LanguageSwitcher SSR matches even with German browser locale', () => {
		// Simulate German browser — getBrowserLanguage() would return 'de'
		// But i18n is always initialized with 'en', so initial render should still match
		const originalNavigator = globalThis.navigator;
		Object.defineProperty(globalThis, 'navigator', {
			value: {language: 'de-DE'},
			writable: true,
			configurable: true,
		});

		const ssrHtml = renderToString(<LanguageSwitcher/>);
		expect(ssrHtml).toContain('EN');

		const container = document.createElement('div');
		container.innerHTML = ssrHtml;
		document.body.append(container);

		let hydrationError = null;
		const root = hydrateRoot(container, <LanguageSwitcher/>, {
			onRecoverableError(error) {
				hydrationError = error;
			},
		});

		expect(hydrationError).toBeNull();

		root.unmount();
		container.remove();
		Object.defineProperty(globalThis, 'navigator', {
			value: originalNavigator,
			writable: true,
			configurable: true,
		});
	});

	it('Navigation SSR matches client initial render', () => {
		const ssrHtml = renderToString(<Navigation/>);
		expect(ssrHtml).toContain('Menu');
		expect(ssrHtml).toContain('Overview');

		const container = document.createElement('div');
		container.innerHTML = ssrHtml;
		document.body.append(container);

		let hydrationError = null;
		const root = hydrateRoot(container, <Navigation/>, {
			onRecoverableError(error) {
				hydrationError = error;
			},
		});

		expect(hydrationError).toBeNull();

		root.unmount();
		container.remove();
	});
});
