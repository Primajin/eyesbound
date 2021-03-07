/* global document */
// document may be used inside useEffects - they only run in a browser
import PropTypes from 'prop-types';
import React, {useEffect, useState, useRef} from 'react';
import classnames from 'classnames';
import {css} from '@emotion/react';

import {up} from '../../utils/theming.js';

const nav = css`
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

	div {
		transition: background-color .333s, color .333s;
		background-color: var(--background);
		color: var(--foreground);

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

		div {
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

	div, li {
		cursor: pointer;
		font-weight: 700;
		text-transform: uppercase;
	}
`;

const Navigation = ({isFullscreen}) => {
	const linkOverview = useRef(null);
	const linkShuttered = useRef(null);
	const linkArchitecture = useRef(null);
	const linkEnvironment = useRef(null);
	const linkFloral = useRef(null);
	const linkLight = useRef(null);
	const linkWorldmap = useRef(null);
	const linkContact = useRef(null);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const openMenu = () => {
			const links = [
				linkOverview.current,
				linkShuttered.current,
				linkArchitecture.current,
				linkEnvironment.current,
				linkFloral.current,
				linkLight.current,
				linkWorldmap.current,
				linkContact.current
			];

			if (links.includes(document.activeElement)) {
				setMenuOpen(true);
			} else {
				setMenuOpen(false);
			}
		};

		// Register eventListener once
		document.addEventListener('focus', openMenu, true);

		return () => {
			// Unregister eventListener once
			document.removeEventListener('focus', openMenu, true);
		};
	}, []);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<nav css={nav} className={classnames({open: menuOpen, isFullscreen})}>
			<ul>
				<li><a ref={linkOverview} href="/picture" tabIndex="2">Overview</a></li>
				<li><a ref={linkShuttered} href="/series/shuttered" tabIndex="3">»Shuttered«</a></li>
				<li><a ref={linkArchitecture} href="/category/architecture" tabIndex="4">Architecture</a></li>
				<li><a ref={linkEnvironment} href="/category/environment" tabIndex="5">Environment</a></li>
				<li><a ref={linkFloral} href="/category/floral" tabIndex="6">Floral</a></li>
				<li><a ref={linkLight} href="/category/light" tabIndex="7">Light</a></li>
				<li><a ref={linkWorldmap} href="/worldmap" tabIndex="8">Worldmap</a></li>
				<li><a ref={linkContact} href="/imprint" tabIndex="9">Contact</a></li>
			</ul>
			<div onClick={toggleMenu}>Menu</div>
		</nav>
	);
};

Navigation.propTypes = {
	isFullscreen: PropTypes.bool
};

export default Navigation;
