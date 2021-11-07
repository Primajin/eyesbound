import {useState} from 'react';
import {Global, css} from '@emotion/react';
import {Helmet} from 'react-helmet';

import button from '../../styles/button.js';
import {fromLocalStorage} from '../../utils/local-storage.js';
import {userPrefersDark} from '../../utils/theming.js';
import BulbOn from './icons/bulb-on.jsx';
import BulbOff from './icons/bulb-off.jsx';

const ThemeSwitcher = () => {
	const storagePrefersDark = JSON.parse(fromLocalStorage.getItem('userPrefersDark'));
	const [prefersDark, setPrefersDark] = useState(storagePrefersDark ?? userPrefersDark);

	const switchTheme = () => {
		const flipPreference = !prefersDark;
		setPrefersDark(flipPreference);
		fromLocalStorage.setItem('userPrefersDark', flipPreference);
	};

	return (
		<button aria-label="Switch theme" css={button} type="button" onClick={switchTheme}>
			{prefersDark && (
				<>
					<BulbOff/>
					<Global styles={css`:root { --background: #000; --foreground: #fff;}`}/>
					<Helmet><meta name="theme-color" content="#000000"/></Helmet>
				</>
			)}
			{!prefersDark && (
				<>
					<BulbOn/>
					<Global styles={css`:root { --background: #fff; --foreground: #000;}`}/>
					<Helmet><meta name="theme-color" content="#ffffff"/></Helmet>
				</>
			)}
		</button>
	);
};

export default ThemeSwitcher;
