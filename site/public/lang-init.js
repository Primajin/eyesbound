(function () {
	try {
		var stored = localStorage.getItem('userLanguage');
		var lang = stored === 'de' || stored === 'en' ? stored : (navigator.language || '').split('-', 1)[0] === 'de' ? 'de' : 'en';
		document.documentElement.lang = lang;
	} catch {
		// Storage or navigator unavailable: keep the server-rendered default
	}
})();
