const widthSteps = [261, 480, 768, 1072, 1280, 1500, 2144];

/**
 Plans how Astro should fetch and render a Prismic image: an imgix source no wider than twice the display width
 (so the build downloads little) and the srcset widths Astro should generate from it.
 @param {{url: string, alt: string, width: number|null, height: number|null}} image Normalised Prismic image.
 @param {number} displayWidth Largest rendered width in CSS pixels.
 @param {string} [title] Fallback alt text when Prismic has none.
 @returns {{src: string, alt: string, width: number, height: number, widths: number[]}} Source URL, alt and the intrinsic and srcset widths.
 @throws {Error} When the image has no usable dimensions, because the layout (CLS) cannot be reserved without them.
 */
export const planImage = (image, displayWidth, title = '') => {
	if (!Number.isSafeInteger(image?.width) || !Number.isSafeInteger(image?.height) || image.width <= 0 || image.height <= 0) {
		throw new TypeError(`Prismic image "${image?.url ?? '(missing)'}" has no dimensions.`);
	}

	const sourceWidth = Math.min(displayWidth * 2, image.width);
	const source = new URL(image.url);
	source.searchParams.delete('auto');
	source.searchParams.set('w', String(sourceWidth));
	source.searchParams.set('fit', 'max');
	source.searchParams.set('q', '90');

	const shownWidth = Math.min(displayWidth, image.width);
	return {
		src: source.href,
		alt: image.alt || title,
		width: shownWidth,
		height: Math.round(shownWidth * image.height / image.width),
		widths: [...new Set([...widthSteps.filter(step => step < sourceWidth), sourceWidth])],
	};
};
