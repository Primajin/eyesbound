import React, {useState} from 'react';
import {Global, css} from '@emotion/react';

import BulbOff from './icons/bulb-off.jsx';
import BulbOn from './icons/bulb-on.jsx';
import button from '../../styles/button.js';
import {fromLocalStorage} from '../../utils/local-storage.js';
import {userPrefersDark} from '../../utils/theming.js';

const ThemeSwitcher = () => {
	const storagePrefersDark = JSON.parse(fromLocalStorage.getItem('userPrefersDark'));
	const [prefersDark, setPrefersDark] = useState(storagePrefersDark ?? userPrefersDark);

	const switchTheme = () => {
		const flipPreference = !prefersDark;
		setPrefersDark(flipPreference);
		fromLocalStorage.setItem('userPrefersDark', flipPreference);
	};

	return (
		<button css={button} type="button" onClick={switchTheme}>
			{prefersDark && (
				<>
					<BulbOff/>
					<Global styles={css`:root { --background: #000; --foreground: #fff;}`}/>
				</>
			)}
			{!prefersDark && (
				<>
					<BulbOn/>
					<Global styles={css`:root { --background: #fff; --foreground: #000;}`}/>
				</>
			)}
		</button>
	);
};

export default ThemeSwitcher;
