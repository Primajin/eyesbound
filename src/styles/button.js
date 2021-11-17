import {css} from '@emotion/react';

const button = css`
	align-items: center;
	background-color: var(--foreground);
	color: var(--background);
	cursor: pointer;
	display: flex;
	height: 50px;
	justify-content: center;
	opacity: 1;
	padding: 0;
	position: fixed;
	right: 50px;
	top: 0;
	transition: background-color .333s, color .333s, opacity .333s;
	width: 50px;
	z-index: 8;

	&:hover {
		background: var(--background);
		color: var(--foreground);
	}

	&.fullScreen {
		opacity: 0.65;
	}

	svg {
		fill: currentColor;
		height: 40px;
		width: 40px;
	}
`;

export default button;
