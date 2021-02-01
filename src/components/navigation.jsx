import {css} from '@emotion/react';
import React from 'react';

const nav = css`
	background-color: var(--background);
	color: var(--foreground);
	height: 40px;
	line-height: 40px;
	position: fixed;
	text-align: center;
	top: 100px;
	width: 180px;
	z-index: 9;
`;

const Navigation = () => {
	return (
		<nav css={nav}>
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
		</nav>
	);
};

export default Navigation;
