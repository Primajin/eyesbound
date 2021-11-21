import React from 'react';
import {css} from '@emotion/react';

import IconInstagram from './icons/instagram.jsx';

const instagramIcon = css`
	bottom: 13px;
	display: block;
	height: 24px;
	left: 15px;
	overflow: hidden;
	position: absolute;
	width: 24px;
	z-index: 2;

	svg {
		fill: var(--background);
	}
`;

const InstagramIcon = () => <a css={instagramIcon} href="https://www.instagram.com/jannishell" rel="noreferrer" target="_blank" title="Eyesbound on Instagram"><IconInstagram/></a>;

export default InstagramIcon;
