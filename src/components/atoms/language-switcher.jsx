import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import {css} from '@emotion/react';
import {useTranslation} from 'react-i18next';

import {up} from '../../utils/theming.js';

const languageSwitcherStyle = css`
	cursor: pointer;
	left: 180px;
	line-height: 40px;
	opacity: 1;
	outline: 0;
	position: fixed;
	text-align: center;
	top: 100px;
	transition: opacity .333s;
	user-select: none;
	width: 40px;
	z-index: 9;

	${up('md')} {
		line-height: 20px;
		top: 120px;
		width: 20px;
	};

	&.isFullscreen {
		opacity: 0;
	}

	button {
		background-color: var(--background);
		border: 1px solid var(--foreground);
		color: var(--foreground);
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		height: 40px;
		padding: 0;
		text-transform: uppercase;
		transition: background-color .333s, color .333s;
		width: 40px;

		${up('md')} {
			font-size: 10px;
			height: 20px;
			width: 20px;
		};

		&:hover {
			background: var(--foreground);
			color: var(--background);
		}
	}
`;

function LanguageSwitcher({isFullscreen = false}) {
	const {i18n} = useTranslation();

	const toggleLanguage = () => {
		const newLang = i18n.language === 'en' ? 'de' : 'en';
		i18n.changeLanguage(newLang);
	};

	const currentLang = i18n.language === 'en' ? 'EN' : 'DE';

	return (
		<div css={languageSwitcherStyle} className={classnames({isFullscreen})}>
			<button type='button' title={`Switch to ${i18n.language === 'en' ? 'German' : 'English'}`} onClick={toggleLanguage}>
				{currentLang}
			</button>
		</div>
	);
}

LanguageSwitcher.propTypes = {
	isFullscreen: PropTypes.bool,
};

export default LanguageSwitcher;
