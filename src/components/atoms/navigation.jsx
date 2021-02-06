import {css} from '@emotion/react';
import React from 'react';

const nav = css`
	background-color: var(--background);
	color: var(--foreground);
	line-height: 40px;
	outline: 0;
	position: fixed;
	text-align: center;
	top: 100px;
	transform: translateY(calc(-100% + 40px));
	transition: transform .3s;
	user-select: none;
	width: 180px;
	z-index: 9;

	&:focus {
		transform: translateY(0);

		div {
			cursor: default;
		}
	}

	ul {
		background-color: var(--foreground);
		color: var(--background);
	}

	li {
		transition: opacity .3s;

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
	return (
		<nav css={nav} tabIndex="1">
			<ul>
				<li>Hello</li>
				<li>World</li>
				<li>How</li>
				<li>Are</li>
				<li>You</li>
				<li>I</li>
				<li>am</li>
				<li>Fine</li>
				<li>Thanks</li>
			</ul>
			<div>Menu</div>
		</nav>
	);
};

export default Navigation;
