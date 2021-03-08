import React from 'react';
import {css} from '@emotion/react';

import instaIcon from '../../../static/instagram-icon.svg';

const instagramIcon = css`
	background: url("${instaIcon}") center center no-repeat;
	bottom: 13px;
	display: block;
	height: 24px;
	left: 15px;
	overflow: hidden;
	position: absolute;
	text-indent: -999em;
	width: 24px;
`;

const InstagramIcon = () => <a css={instagramIcon} href="https://www.instagram.com/jannishell" rel="noreferrer" target="_blank" title="Eyesbound on Instagram">Eyesbound on Instagram</a>;

export default InstagramIcon;
