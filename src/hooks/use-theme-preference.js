import {useState} from 'react';

import {userPrefersDark} from '../utils/theming.js';

function useThemePreference() {
	const [isDark, setIsDark] = useState(() => {
		// During SSR, we don't have access to localStorage, so use system preference
		if (globalThis.window === undefined) {
			return Boolean(userPrefersDark);
		}

		// On client, read from localStorage to match what the inline script set
		try {
			const stored = localStorage.getItem('userPrefersDark');
			if (stored !== null) {
				return JSON.parse(stored);
			}
		} catch {
			// Fallback to system preference if localStorage fails
		}

		return Boolean(userPrefersDark);
	});

	const switchTheme = () => {
		const flipPreference = !isDark;
		setIsDark(flipPreference);
		try {
			localStorage.setItem('userPrefersDark', JSON.stringify(flipPreference));
		} catch {
			// Silently fail if localStorage is not available
		}
	};

	return {isDark, switchTheme};
}

export default useThemePreference;
