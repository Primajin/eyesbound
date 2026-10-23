// @vitest-environment jsdom
/* global document, window */
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';

import {initSlideshows, wrapIndex} from '../slideshow.js';

class FakeObserver {
	static instances = [];

	constructor(callback) {
		this.callback = callback;
		FakeObserver.instances.push(this);
	}

	observe() {}

	show(target) {
		this.callback([{isIntersecting: true, target}]);
	}
}

const setup = ({reduced = false} = {}) => {
	document.body.innerHTML = `
		<section data-slideshow>
			<ul data-slides><li></li><li></li><li></li></ul>
			<button data-slide="previous"></button>
			<button data-slide="next"></button>
			<ol><li><button data-slide-to="0"></button></li><li><button data-slide-to="1"></button></li><li><button data-slide-to="2"></button></li></ol>
		</section>`;
	const slideshow = document.querySelector('[data-slideshow]');
	const scroller = slideshow.querySelector('[data-slides]');
	const slides = [...scroller.children];
	for (const [index, slide] of slides.entries()) {
		Object.defineProperty(slide, 'offsetLeft', {value: index * 1000});
	}

	scroller.scrollTo = vi.fn();
	const listeners = [];
	const media = {
		matches: reduced,
		addEventListener(_, listener) {
			listeners.push(listener);
		},
	};
	window.matchMedia = vi.fn(() => media);
	return {
		slideshow, scroller, slides, media, listeners,
	};
};

const current = () => [...document.querySelectorAll('[data-slide-to]')].map(button => button.getAttribute('aria-current'));

describe('wrapIndex', () => {
	test.each([[0, 3, 0], [3, 3, 0], [-1, 3, 2], [4, 3, 1]])('wraps %i of %i to %i', (index, count, expected) => {
		expect(wrapIndex(index, count)).toBe(expected);
	});
});

describe('initSlideshows', () => {
	beforeEach(() => {
		FakeObserver.instances.length = 0;
		window.IntersectionObserver = FakeObserver;
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('next, previous and indicators fade out, jump instantly and wrap around', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		const click = selector => slideshow.querySelector(selector).dispatchEvent(new Event('click'));

		click('[data-slide="next"]');
		expect(scroller.dataset.fade).toBe('out');
		expect(current()).toEqual(['false', 'true', 'false']);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
		vi.advanceTimersByTime(450);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 1000, behavior: 'instant'});
		expect(scroller.dataset.fade).toBeUndefined();
		click('[data-slide="previous"]');
		vi.advanceTimersByTime(450);
		click('[data-slide="previous"]');
		vi.advanceTimersByTime(450);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 2000, behavior: 'instant'});
		click('[data-slide-to="1"]');
		vi.advanceTimersByTime(450);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 1000, behavior: 'instant'});
	});

	test('a newer navigation completes the fade in progress and then fades to its own target', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 100_000});
		const click = selector => slideshow.querySelector(selector).dispatchEvent(new Event('click'));
		click('[data-slide-to="1"]');
		vi.advanceTimersByTime(200);
		click('[data-slide-to="2"]');
		vi.advanceTimersByTime(450);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(2);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 2000, behavior: 'instant'});
		expect(scroller.dataset.fade).toBeUndefined();
	});

	test('marks the indicator of the slide that scrolls into view as current', () => {
		const {slides} = setup();
		initSlideshows(document);
		expect(current()).toEqual(['true', 'false', 'false']);
		FakeObserver.instances[0].show(slides[2]);
		expect(current()).toEqual(['false', 'false', 'true']);
	});

	test('ignores slides that scroll out of view', () => {
		const {slides} = setup();
		initSlideshows(document);
		FakeObserver.instances[0].callback([{isIntersecting: false, target: slides[2]}]);
		expect(current()).toEqual(['true', 'false', 'false']);
	});

	test('autoplays by fading to the next slide and wraps from the last to the first', () => {
		const {scroller} = setup();
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(1450);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 1000, behavior: 'instant'});
		vi.advanceTimersByTime(2000 + 450);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 0, behavior: 'instant'});
	});

	test('skips autoplay steps while the tab is hidden', () => {
		const {scroller} = setup();
		const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(3000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
		hidden.mockReturnValue(false);
		vi.advanceTimersByTime(1450);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
		hidden.mockRestore();
	});

	test('is not paused by hover alone', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		slideshow.dispatchEvent(new Event('pointerenter'));
		slideshow.dispatchEvent(new Event('mouseover'));
		vi.advanceTimersByTime(1450);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
	});

	test.each(['pointerdown', 'keydown', 'wheel', 'touchstart', 'click', 'focusin'])('stops for good after %s', name => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		slideshow.dispatchEvent(new Event(name, {bubbles: true}));
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
	});

	test.each([
		['pointerdown', '[data-slides]'],
		['touchstart', '[data-slides]'],
		['wheel', '[data-slides]'],
		['keydown', '[data-slide="next"]'],
		['focusin', '[data-slide="previous"]'],
		['pointerdown', '[data-slide-to="2"]'],
		['focusin', '[data-slide-to="1"]'],
	])('stops for good after %s bubbling from %s', (name, selector) => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		slideshow.querySelector(selector).dispatchEvent(new Event(name, {bubbles: true}));
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
	});

	test('stops after keyboard input while nothing in the slideshow has focus', () => {
		const {scroller} = setup();
		initSlideshows(document, {interval: 1000});
		document.body.dispatchEvent(new Event('keydown', {bubbles: true}));
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
	});

	test('stays stopped after hover, blur and later movement', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		slideshow.dispatchEvent(new Event('pointerdown', {bubbles: true}));
		slideshow.dispatchEvent(new Event('pointerleave'));
		slideshow.dispatchEvent(new Event('focusout'));
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
	});

	test('an interaction during an autoplay fade completes the jump and stops', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(1000);
		expect(scroller.dataset.fade).toBe('out');
		slideshow.dispatchEvent(new Event('touchstart', {bubbles: true}));
		expect(scroller.scrollTo).toHaveBeenCalledWith({left: 1000, behavior: 'instant'});
		expect(scroller.dataset.fade).toBeUndefined();
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
	});

	test('a click on an arrow still navigates although it stops autoplay', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		slideshow.querySelector('[data-slide="next"]').dispatchEvent(new Event('click', {bubbles: true}));
		vi.advanceTimersByTime(450);
		expect(scroller.scrollTo).toHaveBeenCalledWith({left: 1000, behavior: 'instant'});
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
	});

	test('never autoplays with reduced motion and jumps at once without fading', () => {
		const {slideshow, scroller} = setup({reduced: true});
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
		slideshow.querySelector('[data-slide="next"]').dispatchEvent(new Event('click'));
		expect(scroller.scrollTo).toHaveBeenCalledWith({left: 1000, behavior: 'instant'});
		expect(scroller.dataset.fade).toBeUndefined();
	});

	test('stops when reduced motion is switched on while running', () => {
		const {scroller, media, listeners} = setup();
		initSlideshows(document, {interval: 1000});
		media.matches = true;
		for (const listener of listeners) {
			listener();
		}

		vi.advanceTimersByTime(5000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
	});

	test('keeps running when reduced motion changes without being on', () => {
		const {scroller, listeners} = setup();
		initSlideshows(document, {interval: 1000});
		for (const listener of listeners) {
			listener();
		}

		vi.advanceTimersByTime(1450);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
	});

	test('a single slide never autoplays', () => {
		const {scroller} = setup();
		scroller.lastElementChild.remove();
		scroller.lastElementChild.remove();
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(5000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
	});
});
