/* global document */
// document may be used inside useEffects - they only run in a browser
import PropTypes from 'prop-types';
import {useEffect, useState, useRef} from 'react';
import classnames from 'classnames';
import {css} from '@emotion/react';
import {useTranslation} from 'react-i18next';

import AssetTypes from '../../constants/asset-types.js';
import {up} from '../../utils/theming.js';

const navigationStyle = css`
	line-height: 40px;
	opacity: 1;
	outline: 0;
	position: fixed;
	text-align: center;
	top: 100px;
	transform: translateY(calc(-100% + 40px));
	transition: transform .333s, opacity .333s;
	user-select: none;
	width: 180px;
	z-index: 9;

	${up('md')} {
		transform: translateY(calc(-100% + 20px));
	};

	&.isFullscreen {
		opacity: 0;
	}

	button {
		background-color: var(--background);
		border: none;
		color: var(--foreground);
		display: block;
		font: inherit;
		margin: 0;
		padding: 0;
		transition: background-color .333s, color .333s;
		width: 100%;

		${up('md')} {
			line-height: 20px;
		};

		&:hover {
			background: var(--foreground);
			color: var(--background);
		}
	}

	&.open {
		transform: translateY(0);

		button {
			cursor: default;

			&:hover {
				background-color: var(--background);
				color: var(--foreground);
			}
		}
	}

	ul {
		background-color: var(--foreground);
		color: var(--background);
	}

	li {
		transition: opacity .333s;

		&:hover {
			opacity: 0.666;
		}
	}

	button, li {
		cursor: pointer;
		font-weight: 700;
		text-transform: uppercase;
	}
`;

function Navigation({isFullscreen = false}) {
	const {t} = useTranslation();
	const linkOverviewRef = useRef(null);
	const linkShutteredRef = useRef(null);
	const linkArchitectureRef = useRef(null);
	const linkEnvironmentRef = useRef(null);
	const linkFloralRef = useRef(null);
	const linkLightRef = useRef(null);
	const linkWorldmapRef = useRef(null);
	const linkContactRef = useRef(null);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const openMenu = () => {
			const links = [
				linkOverviewRef.current,
				linkShutteredRef.current,
				linkArchitectureRef.current,
				linkEnvironmentRef.current,
				linkFloralRef.current,
				linkLightRef.current,
				linkWorldmapRef.current,
				linkContactRef.current,
			];

			if (links.includes(document.activeElement)) {
				setMenuOpen(true);
			} else {
				setMenuOpen(false);
			}
		};

		if (process.env.NODE_ENV === 'test') {
			openMenu();
		}

		// Register eventListener once
		document.addEventListener('focus', openMenu, {capture: true});

		return () => {
			// Unregister eventListener once
			document.removeEventListener('focus', openMenu, true);
		};
	}, []);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const {PICTURE, SERIES, CATEGORY} = AssetTypes;

	return (
		<nav css={navigationStyle} className={classnames({open: menuOpen, isFullscreen})}>
			<ul>
				<li><a ref={linkOverviewRef} href={`/${PICTURE.path}`}>{t('navigation.overview')}</a></li>
				<li><a ref={linkShutteredRef} href={`/${SERIES.path}/shuttered`}>»Shuttered«</a></li>
				<li><a ref={linkArchitectureRef} href={`/${CATEGORY.path}/architecture`}>Architecture</a></li>
				<li><a ref={linkEnvironmentRef} href={`/${CATEGORY.path}/environment`}>Environment</a></li>
				<li><a ref={linkFloralRef} href={`/${CATEGORY.path}/floral`}>Floral</a></li>
				<li><a ref={linkLightRef} href={`/${CATEGORY.path}/light`}>Light</a></li>
				<li><a ref={linkWorldmapRef} href='/worldmap'>{t('navigation.worldmap')}</a></li>
				<li><a ref={linkContactRef} href='/imprint'>{t('navigation.contact')}</a></li>
			</ul>
			<button type='button' onClick={toggleMenu}>{t('navigation.menu')}</button>
		</nav>
	);
}

Navigation.propTypes = {
	isFullscreen: PropTypes.bool,
};

export default Navigation;
