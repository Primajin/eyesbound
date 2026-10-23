const autoplayInterval = 5000;
const fadeDuration = 450;
const interactionEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'click', 'focusin'];

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
	let fadeTimer;

	const setActive = index => {
		active = index;
		for (const [position, indicator] of indicators.entries()) {
			indicator.setAttribute('aria-current', String(position === index));
		}
	};

	let pending;

	const jump = target => {
		scroller.scrollTo({left: target.offsetLeft, behavior: 'instant'});
	};

	const finishFade = () => {
		win.clearTimeout(fadeTimer);
		if (pending) {
			jump(pending);
			pending = undefined;
		}

		delete scroller.dataset.fade;
	};

	const goTo = index => {
		const wrapped = wrapIndex(index, slides.length);
		const target = slides[wrapped];
		win.clearTimeout(fadeTimer);
		pending = undefined;
		setActive(wrapped);
		if (reducedMotion.matches) {
			jump(target);
			return;
		}

		pending = target;
		scroller.dataset.fade = 'out';
		fadeTimer = win.setTimeout(finishFade, fadeDuration);
	};

	const stop = () => {
		win.clearInterval(timer);
		timer = undefined;
		finishFade();
	};

	const start = () => {
		if (timer === undefined && !reducedMotion.matches && slides.length > 1) {
			timer = win.setInterval(() => {
				if (!root.hidden) {
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

	for (const name of interactionEvents) {
		root.addEventListener(name, stop, {capture: true, passive: true});
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
 the scroll position, and navigation fades out, jumps and fades in (instantly with reduced motion), and autoplay runs only without reduced motion and ends for good on the first user input.
 @param {Document} root Document to act on.
 @param {{win?: Window, interval?: number}} [options] Window and autoplay interval overrides for tests.
 */
export const initSlideshows = (root, {win = root.defaultView, interval = autoplayInterval} = {}) => {
	for (const slideshow of root.querySelectorAll('[data-slideshow]')) {
		initOne(root, slideshow, win, interval);
	}
};
