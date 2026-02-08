import React, {useState} from 'react';
import {css} from '@emotion/react';

import Header from '../components/molecules/header.jsx';
import HelmetMetaTags from '../components/atoms/helmet-meta-tags.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';
import {userPrefersDark} from '../utils/theming.js';

const notFoundContent = css`
	text-align: center;
	padding: 40px 0;

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		color: var(--foreground);
	}

	a {
		display: inline-block;
		padding: 12px 24px;
		background: var(--foreground);
		color: var(--background);
		text-decoration: none;
		border-radius: 4px;
		transition: opacity 0.3s ease;

		&:hover {
			opacity: 0.8;
		}
	}
`;

function NotFoundPage() {
	const [isDark, setIsDark] = useState(() => {
		// During SSR, we don't have access to localStorage, so use system preference
		if (globalThis.window === undefined) {
			return userPrefersDark;
		}

		// On client, read from localStorage to match what the inline script set
		try {
			const stored = localStorage.getItem('userPrefersDark');
			if (stored !== null) {
				return JSON.parse(stored);
			}
		} catch {
			// Fallback to system preference if localStorage fails
		}

		return userPrefersDark;
	});

	const switchTheme = () => {
		const flipPreference = !isDark;
		setIsDark(flipPreference);
		try {
			localStorage.setItem('userPrefersDark', JSON.stringify(flipPreference));
		} catch {
			// Silently fail if localStorage is not available
		}
	};

	return (
		<>
			<HelmetMetaTags title='404 - Page Not Found' path='404'/>
			<Header isDark={isDark} switchTheme={switchTheme}/>
			<MainWrapper>
				<div css={notFoundContent}>
					<h1>404 - Page Not Found</h1>
					<p>The page you are looking for does not exist or has been moved.</p>
					<a href='/'>Return to Home</a>
				</div>
			</MainWrapper>
		</>
	);
}

export default NotFoundPage;
