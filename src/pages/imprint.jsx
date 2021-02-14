import React from 'react';
import {Helmet} from 'react-helmet';

import Header from '../components/molecules/header.jsx';
import MainWrapper from '../components/atoms/main-wrapper.jsx';

const Imprint = () => (
	<>
		<Helmet><title>Imprint | EYESBOUND</title></Helmet>
		<Header/>
		<MainWrapper>
			<h1>Imprint</h1>
			<div>Hello world!</div>
		</MainWrapper>
	</>
);

export default Imprint;
