import {
	breakpoints, deviceSpecs, forDevice, up, userPrefersDark,
} from '../theming.js';

describe('theming', () => {
	describe('userPrefersDark', () => {
		it('is falsy when matchMedia is not available', () => {
			expect(userPrefersDark).toBeFalsy();
		});

		it('returns true when user prefers dark color scheme', async () => {
			const original = globalThis.matchMedia;
			globalThis.matchMedia = jest.fn().mockReturnValue({matches: true});

			let result;
			await jest.isolateModulesAsync(async () => {
				const {userPrefersDark: isolated} = await import('../theming.js');
				result = isolated;
			});

			expect(result).toBe(true);
			globalThis.matchMedia = original;
		});

		it('returns false when user prefers light color scheme', async () => {
			const original = globalThis.matchMedia;
			globalThis.matchMedia = jest.fn().mockReturnValue({matches: false});

			let result;
			await jest.isolateModulesAsync(async () => {
				const {userPrefersDark: isolated} = await import('../theming.js');
				result = isolated;
			});

			expect(result).toBe(false);
			globalThis.matchMedia = original;
		});
	});

	describe('up', () => {
		it('gets media query for given breakpoint', () => {
			for (const [key, value] of breakpoints.entries()) {
				expect(up(key)).toBe(`@media (min-width: ${value}px)`);
			}
		});

		it('gets media query for custom breakpoint', () => {
			expect(up(123)).toBe('@media (min-width: 123px)');
			expect(up('123')).toBe('@media (min-width: 123px)');
		});
	});

	describe('forDevice', () => {
		it('gets media query for given breakpoint', () => {
			for (const [key, value] of deviceSpecs.entries()) {
				expect(forDevice(key)).toBe(`@media (hover: ${value[0]}) and (pointer: ${value[1]})`);
			}
		});
	});
});
