import './static/reset.css';

import '@fontsource/montserrat/latin-400.css';
import '@fontsource/montserrat/latin-700.css';

import './static/global.css';

import i18n, {getBrowserLanguage} from './src/i18n/config.js';

// Detect browser language and switch after hydration to avoid text content mismatches
export const onInitialClientRender = () => {
	const detectedLanguage = getBrowserLanguage();
	if (detectedLanguage !== i18n.language) {
		i18n.changeLanguage(detectedLanguage);
	}
};
