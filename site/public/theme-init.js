// Classic pre-paint script (CSP: script-src 'self'). Sets data-theme so tokens.css applies before first paint.
// Keep logic in sync with site/scripts/theme.js (both covered by site/scripts/__tests__/theme.test.js).
(function () {
	try {
		var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

		try {
			var stored = JSON.parse(localStorage.getItem('userPrefersDark'));
			if (typeof stored === 'boolean') {
				isDark = stored;
			}
		} catch {
			// Storage blocked or invalid value: use the OS preference
		}

		var theme = isDark ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);

		var meta = document.querySelector('meta[name="theme-color"]');
		if (!meta) {
			meta = document.createElement('meta');
			meta.name = 'theme-color';
			document.head.appendChild(meta);
		}

		meta.content = isDark ? '#000000' : '#ffffff';
	} catch {
		// Keep the CSS defaults (prefers-color-scheme fallback in tokens.css)
	}
})();
