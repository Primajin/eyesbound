import {renderHook, act} from '@testing-library/react';

import useThemePreference from '../use-theme-preference.js';

describe('useThemePreference', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('returns isDark as false by default', () => {
		const {result} = renderHook(() => useThemePreference());
		expect(result.current.isDark).toBe(false);
	});

	it('toggles theme and persists to localStorage', () => {
		const {result} = renderHook(() => useThemePreference());
		expect(result.current.isDark).toBe(false);

		act(() => {
			result.current.switchTheme();
		});

		expect(result.current.isDark).toBe(true);
		expect(localStorage.getItem('userPrefersDark')).toBe('true');
	});

	it('reads initial value from localStorage', () => {
		localStorage.setItem('userPrefersDark', 'true');
		const {result} = renderHook(() => useThemePreference());
		expect(result.current.isDark).toBe(true);
	});

	it('handles localStorage errors gracefully', () => {
		const originalGetItem = localStorage.getItem;
		localStorage.getItem = () => {
			throw new Error('Storage error');
		};

		const {result} = renderHook(() => useThemePreference());
		expect(result.current.isDark).toBe(false);

		localStorage.getItem = originalGetItem;
	});
});
