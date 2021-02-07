import React from 'react';
import {css} from '@emotion/react';

const logo = css`
	background-color: var(--foreground);
	color: var(--background);
	font-size: 37px;
	font-weight: 700;
	height: 100px;
	left: 0;
	line-height: 100px;
	position: fixed;
	text-align: center;
	top: 0;
	width: 400px;
	z-index: 10;
`;

const Logo = () => <h1 css={logo}><a href="/" rel="home" tabIndex="1">EYESBOUND</a></h1>;

export default Logo;
