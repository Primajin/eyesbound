// @vitest-environment jsdom
/* global document, KeyboardEvent, MouseEvent */
import {expect, test} from 'vitest';

import {initNavigation} from '../navigation.js';

const setup = () => {
	document.body.innerHTML = '<nav data-navigation><button aria-expanded="false">Menu</button><ul><li><a href="/x/">x</a></li></ul></nav><p id="outside">y</p>';
	initNavigation(document);
	return {
		nav: document.querySelector('nav'), button: document.querySelector('button'), link: document.querySelector('nav a'), outside: document.querySelector('#outside'),
	};
};

test('button click toggles the menu and aria-expanded', () => {
	const {nav, button} = setup();
	button.click();
	expect(nav.classList.contains('open')).toBe(true);
	expect(button.getAttribute('aria-expanded')).toBe('true');
	button.click();
	expect(nav.classList.contains('open')).toBe(false);
	expect(button.getAttribute('aria-expanded')).toBe('false');
});

test('a click elsewhere closes the menu', () => {
	const {nav, button, outside} = setup();
	button.click();
	outside.click();
	expect(nav.classList.contains('open')).toBe(false);
});

test('clicking a link inside keeps the menu open', () => {
	const {nav, button, link} = setup();
	button.click();
	link.addEventListener('click', event => {
		event.preventDefault();
	});
	link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
	expect(nav.classList.contains('open')).toBe(true);
});

test('Escape closes the menu and releases focus', () => {
	const {nav, button, link} = setup();
	button.click();
	link.focus();
	document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
	expect(nav.classList.contains('open')).toBe(false);
	expect(document.activeElement).not.toBe(link);
});

test('other keys leave the open menu and its focus alone', () => {
	const {nav, button, link} = setup();
	button.click();
	link.focus();
	document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
	expect(nav.classList.contains('open')).toBe(true);
	expect(document.activeElement).toBe(link);
});
