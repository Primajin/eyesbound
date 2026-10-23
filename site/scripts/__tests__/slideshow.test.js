// @vitest-environment jsdom
/* global document, HTMLImageElement, window */
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

const setup = ({reduced = false, loaded = true} = {}) => {
	document.body.innerHTML = `
		<section data-slideshow>
			<ul data-slides><li><picture><img src="a.jpg"></picture></li><li><picture><img src="b.jpg"></picture></li><li><picture><img src="c.jpg"></picture></li></ul>
			<div data-fade></div>
			<button data-slide="previous"></button>
			<button data-slide="next"></button>
			<ol><li><button data-slide-to="0"></button></li><li><button data-slide-to="1"></button></li><li><button data-slide-to="2"></button></li></ol>
		</section>`;
	const slideshow = document.querySelector('[data-slideshow]');
	const scroller = slideshow.querySelector('[data-slides]');
	const layer = slideshow.querySelector('[data-fade]');
	const slides = [...scroller.children];
	for (const [index, slide] of slides.entries()) {
		Object.defineProperty(slide, 'offsetLeft', {value: index * 1000});
	}

	Object.defineProperty(HTMLImageElement.prototype, 'complete', {configurable: true, get: () => loaded});
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
		slideshow, scroller, layer, slides, media, listeners,
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

	const click = (slideshow, selector) => slideshow.querySelector(selector).dispatchEvent(new Event('click'));

	test('next, previous and indicators cross-fade over the old slide, then jump instantly and wrap around', () => {
		const {slideshow, scroller, layer} = setup();
		initSlideshows(document, {interval: 100_000});

		click(slideshow, '[data-slide="next"]');
		expect(layer.dataset.state).toBe('in');
		expect(layer.querySelector('img').getAttribute('src')).toBe('b.jpg');
		expect(layer.querySelector('img').loading).toBe('eager');
		expect(current()).toEqual(['false', 'true', 'false']);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
		vi.advanceTimersByTime(950);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 1000, behavior: 'instant'});
		expect(layer.dataset.state).toBeUndefined();
		expect(layer.children).toHaveLength(0);
		click(slideshow, '[data-slide="previous"]');
		vi.advanceTimersByTime(950);
		click(slideshow, '[data-slide="previous"]');
		vi.advanceTimersByTime(950);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 2000, behavior: 'instant'});
		click(slideshow, '[data-slide-to="1"]');
		vi.advanceTimersByTime(950);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 1000, behavior: 'instant'});
	});

	test('waits for the incoming image before fading and ignores it when superseded', () => {
		const {slideshow, scroller, layer} = setup({loaded: false});
		initSlideshows(document, {interval: 100_000});
		click(slideshow, '[data-slide-to="1"]');
		expect(layer.dataset.state).toBe('prepared');
		layer.querySelector('img').dispatchEvent(new Event('load'));
		expect(layer.dataset.state).toBe('in');

		click(slideshow, '[data-slide-to="2"]');
		const stale = layer.querySelector('img');
		click(slideshow, '[data-slide-to="0"]');
		stale.dispatchEvent(new Event('error'));
		expect(layer.dataset.state).toBe('prepared');
		layer.querySelector('img').dispatchEvent(new Event('error'));
		expect(layer.dataset.state).toBe('in');
		vi.advanceTimersByTime(950);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 0, behavior: 'instant'});
	});

	test('a newer navigation completes the fade in progress and then fades to its own target', () => {
		const {slideshow, scroller, layer} = setup();
		initSlideshows(document, {interval: 100_000});
		click(slideshow, '[data-slide-to="1"]');
		vi.advanceTimersByTime(200);
		click(slideshow, '[data-slide-to="2"]');
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(950);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(2);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 2000, behavior: 'instant'});
		expect(layer.dataset.state).toBeUndefined();
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

	test('autoplays by itself, cross-fading to the next slide and wrapping from the last to the first', () => {
		const {scroller} = setup();
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(1950);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 1000, behavior: 'instant'});
		vi.advanceTimersByTime(2000 + 950);
		expect(scroller.scrollTo).toHaveBeenLastCalledWith({left: 0, behavior: 'instant'});
	});

	test('skips autoplay steps while the tab is hidden and resumes afterwards', () => {
		const {scroller} = setup();
		const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(3000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
		hidden.mockReturnValue(false);
		vi.advanceTimersByTime(1950);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
		hidden.mockRestore();
	});

	const stillRunning = (scroller, count = 1) => {
		vi.advanceTimersByTime(1950);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(count);
	};

	test.each([
		['hover', slideshow => slideshow.dispatchEvent(new Event('mouseover'))],
		['pointer enter', slideshow => slideshow.dispatchEvent(new Event('pointerenter'))],
		['focus', slideshow => slideshow.querySelector('[data-slide="next"]').dispatchEvent(new Event('focusin', {bubbles: true}))],
		['pointer press', slideshow => slideshow.dispatchEvent(new Event('pointerdown', {bubbles: true}))],
		['vertical wheel', slideshow => slideshow.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 0, deltaY: 100}))],
		['vertical touch move', slideshow => {
			slideshow.dispatchEvent(Object.assign(new Event('touchstart'), {touches: [{clientX: 100, clientY: 100}]}));
			slideshow.dispatchEvent(Object.assign(new Event('touchmove'), {touches: [{clientX: 105, clientY: 300}]}));
		}],
		['touch move without start', slideshow => slideshow.dispatchEvent(Object.assign(new Event('touchmove'), {touches: [{clientX: 5, clientY: 3}]}))],
		['keydown outside', () => document.body.dispatchEvent(new Event('keydown', {bubbles: true}))],
		['click outside', () => document.body.dispatchEvent(new Event('click', {bubbles: true}))],
		['scroll event', slideshow => slideshow.querySelector('[data-slides]').dispatchEvent(new Event('scroll'))],
	])('does not stop autoplay on %s', (_, interact) => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		interact(slideshow);
		stillRunning(scroller);
	});

	test.each([
		['key press on the slideshow', slideshow => slideshow.dispatchEvent(new Event('keydown', {bubbles: true}))],
		['key press on the scroller', slideshow => slideshow.querySelector('[data-slides]').dispatchEvent(new Event('keydown', {bubbles: true}))],
		['key press on an arrow', slideshow => slideshow.querySelector('[data-slide="next"]').dispatchEvent(new Event('keydown', {bubbles: true}))],
		['horizontal wheel', slideshow => slideshow.dispatchEvent(Object.assign(new Event('wheel'), {deltaX: 50, deltaY: 2}))],
		['horizontal touch swipe', slideshow => {
			slideshow.dispatchEvent(Object.assign(new Event('touchstart'), {touches: [{clientX: 300, clientY: 100}]}));
			slideshow.dispatchEvent(Object.assign(new Event('touchmove'), {touches: [{clientX: 200, clientY: 105}]}));
		}],
		['arrow click', slideshow => click(slideshow, '[data-slide="previous"]')],
		['thumbnail click', slideshow => click(slideshow, '[data-slide-to="2"]')],
	])('stops for good after %s', (_, interact) => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		interact(slideshow);
		vi.advanceTimersByTime(950);
		const calls = scroller.scrollTo.mock.calls.length;
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(calls);
	});

	test('an interaction during an autoplay fade completes the jump and stops', () => {
		const {slideshow, scroller, layer} = setup();
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(1000);
		expect(layer.dataset.state).toBe('in');
		slideshow.dispatchEvent(new Event('keydown'));
		expect(scroller.scrollTo).toHaveBeenCalledWith({left: 1000, behavior: 'instant'});
		expect(layer.dataset.state).toBeUndefined();
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
	});

	test('a click on an arrow navigates although it stops autoplay', () => {
		const {slideshow, scroller} = setup();
		initSlideshows(document, {interval: 1000});
		click(slideshow, '[data-slide="next"]');
		vi.advanceTimersByTime(950);
		expect(scroller.scrollTo).toHaveBeenCalledWith({left: 1000, behavior: 'instant'});
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).toHaveBeenCalledTimes(1);
	});

	test('never autoplays with reduced motion and jumps at once without fading', () => {
		const {slideshow, scroller, layer} = setup({reduced: true});
		initSlideshows(document, {interval: 1000});
		vi.advanceTimersByTime(10_000);
		expect(scroller.scrollTo).not.toHaveBeenCalled();
		click(slideshow, '[data-slide="next"]');
		expect(scroller.scrollTo).toHaveBeenCalledWith({left: 1000, behavior: 'instant'});
		expect(layer.dataset.state).toBeUndefined();
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

		stillRunning(scroller);
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
