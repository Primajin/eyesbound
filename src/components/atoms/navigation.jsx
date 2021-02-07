import React, {useEffect, useState, useRef} from 'react';
import classnames from 'classnames';
import {css} from '@emotion/react';

import {up} from '../../utils/theming.js';

const nav = css`
	line-height: 40px;
	outline: 0;
	position: fixed;
	text-align: center;
	top: 100px;
	transform: translateY(calc(-100% + 40px));
	transition: transform .333s;
	user-select: none;
	width: 180px;
	z-index: 9;

	${up('md')} {
		transform: translateY(calc(-100% + 20px));
	};

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

const Navigation = () => {
	const navigationElement = useRef(null);
	const [menuOpen, setMenuOpen] = useState(false);

	const openMenu = () => {
		if (document.activeElement === navigationElement.current) {
			setMenuOpen(true);
		}
	};

	useEffect(() => {
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
		<nav ref={navigationElement} css={nav} className={classnames({open: menuOpen})} tabIndex="2">
			<ul>
				<li><a href="/picture" tabIndex="3">Overview</a></li>
				<li><a href="/series/shuttered" tabIndex="4">»Shuttered«</a></li>
				<li><a href="/category/architecture" tabIndex="5">Architecture</a></li>
				<li><a href="/category/environment" tabIndex="6">Environment</a></li>
				<li><a href="/category/floral" tabIndex="7">Floral</a></li>
				<li><a href="/category/light" tabIndex="8">Light</a></li>
				<li><a href="/worldmap" tabIndex="9">Worldmap</a></li>
				<li><a href="/imprint" tabIndex="10">Contact</a></li>
			</ul>
			<div onClick={toggleMenu}>Menu</div>
		</nav>
	);
};

export default Navigation;
