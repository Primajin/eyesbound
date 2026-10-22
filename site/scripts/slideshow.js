const autoplayInterval = 5000;
const interactionEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

/**
 Wraps an index into 0..count-1.
 @param {number} index Possibly out-of-range index.
 @param {number} count Number of slides.
 @returns {number} Wrapped index.
 */
export const wrapIndex = (index, count) => ((index % count) + count) % count;

const initOne = (root, slideshow, win, interval) => {
	const scroller = slideshow.querySelector('[data-slides]');
	const slides = [...scroller.children];
	const indicators = [...slideshow.querySelectorAll('[data-slide-to]')];
	const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)');
	let active = 0;
	let timer;
	let isHovered = false;
	let hasFocus = false;

	const goTo = index => {
		const target = slides[wrapIndex(index, slides.length)];
		scroller.scrollTo({left: target.offsetLeft, behavior: reducedMotion.matches ? 'auto' : 'smooth'});
	};

	const setActive = index => {
		active = index;
		for (const [position, indicator] of indicators.entries()) {
			indicator.setAttribute('aria-current', String(position === index));
		}
	};

	const stop = () => {
		win.clearInterval(timer);
		timer = undefined;
	};

	const start = () => {
		if (timer === undefined && !reducedMotion.matches && slides.length > 1) {
			timer = win.setInterval(() => {
				if (!isHovered && !hasFocus && !root.hidden) {
					goTo(active + 1);
				}
			}, interval);
		}
	};

	for (const button of slideshow.querySelectorAll('[data-slide]')) {
		button.addEventListener('click', () => goTo(active + (button.dataset.slide === 'next' ? 1 : -1)));
	}

	for (const indicator of indicators) {
		indicator.addEventListener('click', () => goTo(Number(indicator.dataset.slideTo)));
	}

	const observer = new win.IntersectionObserver(entries => {
		for (const {isIntersecting, target} of entries) {
			if (isIntersecting) {
				setActive(slides.indexOf(target));
			}
		}
	}, {root: scroller, threshold: 0.6});
	for (const slide of slides) {
		observer.observe(slide);
	}

	slideshow.addEventListener('pointerenter', () => {
		isHovered = true;
	});
	slideshow.addEventListener('pointerleave', () => {
		isHovered = false;
	});
	slideshow.addEventListener('focusin', () => {
		hasFocus = true;
	});
	slideshow.addEventListener('focusout', () => {
		hasFocus = false;
	});
	for (const name of interactionEvents) {
		slideshow.addEventListener(name, stop, {passive: true, once: true});
	}

	reducedMotion.addEventListener('change', () => {
		if (reducedMotion.matches) {
			stop();
		}
	});

	setActive(0);
	start();
};

/**
 Wires every `[data-slideshow]`: previous/next and indicator buttons scroll the snap container, the active indicator follows
 the scroll position, and autoplay runs only without reduced motion, pauses on hover and focus and ends on the first user input.
 @param {Document} root Document to act on.
 @param {{win?: Window, interval?: number}} [options] Window and autoplay interval overrides for tests.
 */
export const initSlideshows = (root, {win = root.defaultView, interval = autoplayInterval} = {}) => {
	for (const slideshow of root.querySelectorAll('[data-slideshow]')) {
		initOne(root, slideshow, win, interval);
	}
};
