jest.mock('gatsby-plugin-image', () => {
	const React = require('react');
	const plugin = jest.requireActual('gatsby-plugin-image');
	const mockImage = ({imgClassName, ...props}) =>
		React.createElement('img', {
			...props,
			className: imgClassName,
		});
	return {
		...plugin,
		GatsbyImage: jest.fn().mockImplementation(mockImage),
		StaticImage: jest.fn().mockImplementation(mockImage),
	};
});

jest.mock('react-helmet', () => {
	const React = require('react');
	const plugin = jest.requireActual('react-helmet');
	const mockHelmet = ({children, ...props}) =>
		React.createElement('div', {
			...props,
			className: 'mock-helmet',
		}, children);
	return {
		...plugin,
		Helmet: jest.fn().mockImplementation(mockHelmet),
	};
});
