import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import {css} from '@emotion/react';
import {useTranslation} from 'react-i18next';

import buttonCSS from '../../styles/button.js';

const languageSwitcherStyle = css`
	${buttonCSS};
	right: 100px;
	font-size: 14px;
	font-weight: 700;
	text-transform: uppercase;

	&.fullScreen {
		opacity: 0.65;
	}
`;

function LanguageSwitcher({isFullscreen = false}) {
	const {i18n, t} = useTranslation();

	const toggleLanguage = () => {
		const newLang = i18n.language === 'en' ? 'de' : 'en';
		i18n.changeLanguage(newLang);
	};

	const currentLang = i18n.language === 'en' ? 'EN' : 'DE';
	const targetLang = i18n.language === 'en' ? t('language.german') : t('language.english');

	return (
		<button
			type='button'
			css={languageSwitcherStyle}
			className={classnames({fullScreen: isFullscreen})}
			title={t('language.switchTo', {language: targetLang})}
			onClick={toggleLanguage}
		>
			{currentLang}
		</button>
	);
}

LanguageSwitcher.propTypes = {
	isFullscreen: PropTypes.bool,
};

export default LanguageSwitcher;
