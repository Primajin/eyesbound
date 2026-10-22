import {describe, expect, test} from 'vitest';

import {planImage} from '../image.js';

const image = {
	url: 'https://images.prismic.io/eyesbound/a.jpg?auto=compress,format&rect=0,0,1500,1000', alt: '', width: 1500, height: 1000,
};

describe('planImage', () => {
	test('requests a capped, non-upscaled imgix source', () => {
		const plan = planImage(image, 1072);
		const url = new URL(plan.src);
		expect(url.searchParams.get('w')).toBe('1500');
		expect(url.searchParams.get('fit')).toBe('max');
		expect(url.searchParams.get('q')).toBe('90');
		expect(url.searchParams.has('auto')).toBe(false);
		expect(url.searchParams.get('rect')).toBe('0,0,1500,1000');
	});

	test('keeps the aspect ratio and ends the srcset at the source width', () => {
		const plan = planImage(image, 1072);
		expect(plan).toMatchObject({width: 1072, height: 715});
		expect(plan.widths).toEqual([261, 480, 768, 1072, 1280, 1500]);
	});

	test('does not exceed the intrinsic size of small thumbnails', () => {
		const plan = planImage({...image, width: 280, height: 187}, 261);
		expect(plan).toMatchObject({width: 261, height: 174});
		expect(plan.widths).toEqual([261, 280]);
	});

	test('falls back to the title for a missing alt', () => {
		expect(planImage(image, 261, 'Title').alt).toBe('Title');
		expect(planImage({...image, alt: 'Described'}, 261, 'Title').alt).toBe('Described');
	});

	test.each([null, undefined, {...image, width: null}, {...image, height: 0}])('throws for unusable dimensions (%j)', broken => {
		expect(() => planImage(broken, 100)).toThrow('has no dimensions');
	});
});
