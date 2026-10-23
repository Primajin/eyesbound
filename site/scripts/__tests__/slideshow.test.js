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

	test('next, previous and indicators scroll the snap container, wrapping around', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		const click = selector => slideshow.querySelector(selector).dispatchEvent(new Event('click'));

		click('[data-slide="next"]');
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 1000, behavior: 'smooth'});
		click('[data-slide="previous"]');
		click('[data-slide="previous"]');
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 2000, behavior: 'smooth'});
		click('[data-slide-to="1"]');
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 1000, behavior: 'smooth'});
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

	test('autoplays, and pauses while hovered or focused', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(1000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);

		slideshow.dispatchEvent(new Event('pointerenter'));
		vi.advanceTimersByTime(3000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
		slideshow.dispatchEvent(new Event('pointerleave'));
		slideshow.dispatchEvent(new Event('focusin'));
		vi.advanceTimersByTime(3000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
		slideshow.dispatchEvent(new Event('focusout'));
		vi.advanceTimersByTime(1000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(2);
	});

	test.each(['pointerdown', 'keydown', 'wheel', 'touchstart'])('stops for good after %s', name => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		slideshow.dispatchEvent(new Event(name));
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
	});

	test('never autoplays with reduced motion and jumps instead of animating', () => {
		const {slideshow, scroller} = setup({reduced: true});
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
		slideshow.querySelector('[data-slide="next"]').dispatchEvent(new Event('click'));
		expect(scroller.scrollTo).toHaveBeenCalledWith({left: 1000, behavior: 'auto'});
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

		vi.advanceTimersByTime(1000);
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
