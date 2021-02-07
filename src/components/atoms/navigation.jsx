import React, {useRef} from 'react';
import {css} from '@emotion/react';

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

	div {
		transition: background-color .333s, color .333s;
		background-color: var(--background);
		color: var(--foreground);

		&:hover {
			background: var(--foreground);
			color: var(--background);
		}
	}

	&:focus {
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

	const blur = () => {
		if (document.activeElement === navigationElement.current) {
			navigationElement.current.blur();
		}
	};

	return (
		<nav ref={navigationElement} css={nav} tabIndex="2">
			<ul>
				<li><a href="/">Hello</a></li>
				<li><a href="/">World</a></li>
				<li><a href="/">How</a></li>
				<li><a href="/">Are</a></li>
				<li><a href="/">You</a></li>
				<li><a href="/">I</a></li>
				<li><a href="/">am</a></li>
				<li><a href="/">Fine</a></li>
				<li><a href="/">Thanks</a></li>
			</ul>
			<div onClick={blur}>Menu</div>
		</nav>
	);
};

export default Navigation;
