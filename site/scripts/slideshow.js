const autoplayInterval = 5000;
const fadeDuration = 900;
const fadeMargin = 50;

/**
 Wraps an index into 0..count-1.
 @param {number} index Possibly out-of-range index.
 @param {number} count Number of slides.
 @returns {number} Wrapped index.
 */
export const wrapIndex = (index, count) => ((index % count) + count) % count;

const initOne = (root, slideshow, win, interval) => {
	const scroller = slideshow.querySelector('[data-slides]');
	const layer = slideshow.querySelector('[data-fade]');
	const slides = [...scroller.children];
	const indicators = [...slideshow.querySelectorAll('[data-slide-to]')];
	const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)');
	let active = 0;
	let timer;
	let fadeTimer;
	let pending;
	let token = 0;
	let touchStart;

	const setActive = index => {
		active = index;
		for (const [position, indicator] of indicators.entries()) {
			indicator.setAttribute('aria-current', String(position === index));
		}
	};

	const jump = target => {
		scroller.scrollTo({left: target.offsetLeft, behavior: 'instant'});
	};

	const finishFade = () => {
		token += 1;
		win.clearTimeout(fadeTimer);
		if (pending) {
			jump(pending);
			pending = undefined;
		}

		layer.replaceChildren();
		delete layer.dataset.state;
	};

	const goTo = index => {
		finishFade();
		const wrapped = wrapIndex(index, slides.length);
		const target = slides[wrapped];
		setActive(wrapped);
		if (reducedMotion.matches) {
			jump(target);
			return;
		}

		pending = target;
		const id = token;
		const picture = target.querySelector('picture').cloneNode(true);
		const image = picture.querySelector('img');
		image.loading = 'eager';
		layer.append(picture);
		layer.dataset.state = 'prepared';
		const fadeIn = () => {
			if (id !== token) {
				return;
			}

			layer.getBoundingClientRect();
			layer.dataset.state = 'in';
			fadeTimer = win.setTimeout(finishFade, fadeDuration + fadeMargin);
		};

		if (image.complete) {
			fadeIn();
		} else {
			image.addEventListener('load', fadeIn, {once: true});
			image.addEventListener('error', fadeIn, {once: true});
		}
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

	const isHorizontal = (dx, dy) => Math.abs(dx) > Math.abs(dy);

	for (const button of slideshow.querySelectorAll('[data-slide]')) {
		button.addEventListener('click', () => {
			stop();
			goTo(active + (button.dataset.slide === 'next' ? 1 : -1));
		});
	}

	for (const indicator of indicators) {
		indicator.addEventListener('click', () => {
			stop();
			goTo(Number(indicator.dataset.slideTo));
		});
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

	slideshow.addEventListener('keydown', stop, {passive: true});
	slideshow.addEventListener('wheel', ({deltaX, deltaY}) => {
		if (isHorizontal(deltaX, deltaY)) {
			stop();
		}
	}, {passive: true});
	slideshow.addEventListener('touchstart', ({touches}) => {
		touchStart = touches[0];
	}, {passive: true});
	slideshow.addEventListener('touchmove', ({touches}) => {
		if (touchStart && isHorizontal(touches[0].clientX - touchStart.clientX, touches[0].clientY - touchStart.clientY)) {
			stop();
		}
	}, {passive: true});

	reducedMotion.addEventListener('change', () => {
		if (reducedMotion.matches) {
			stop();
		}
	});

	setActive(0);
	start();
};

/**
 Wires every `[data-slideshow]`: previous/next and indicator buttons cross-fade to the target slide (instantly with reduced motion),
 the active indicator follows the scroll position, and autoplay runs only without reduced motion and ends for good when the user
 swipes or scrolls horizontally on the slideshow, presses a key in it or uses its controls.
 @param {Document} root Document to act on.
 @param {{win?: Window, interval?: number}} [options] Window and autoplay interval overrides for tests.
 */
export const initSlideshows = (root, {win = root.defaultView, interval = autoplayInterval} = {}) => {
	for (const slideshow of root.querySelectorAll('[data-slideshow]')) {
		initOne(root, slideshow, win, interval);
	}
};
