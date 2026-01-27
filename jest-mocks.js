/* global jest */
/* eslint-disable unicorn/prefer-module */
jest.mock('gatsby-plugin-image', () => {
	const React = require('react');
	const plugin = jest.requireActual('gatsby-plugin-image');
	const mockImage = ({imgClassName, ...properties}) =>
		React.createElement('img', {
			...properties,
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
	const mockHelmet = props => {
		const children = Array.isArray(props.children) ? props.children : [props.children];
		const validChildren = children.filter(child => child !== null && child !== undefined);

		// Convert children to div elements with metadata
		// This is needed because <title> and <meta> don't render in document.body
		const convertedChildren = validChildren.map((child, index) => {
			if (!child || !child.type) {
				return null;
			}

			const childProps = child.props || {};
			const attrs = {
				key: index,
				'data-helmet-tag': child.type,
			};

			// Copy relevant attributes
			for (const key of Object.keys(childProps)) {
				if (key !== 'children') {
					attrs[`data-${key}`] = String(childProps[key]);
				}
			}

			return React.createElement(
				'div',
				attrs,
				childProps.children || null,
			);
		});

		return React.createElement(
			'div',
			{className: 'mock-helmet'},
			convertedChildren.filter(Boolean),
		);
	};

	return {
		Helmet: mockHelmet,
	};
});

jest.mock('@react-google-maps/api', () => {
	const React = require('react');
	const plugin = jest.requireActual('@react-google-maps/api');
	const mockGoogleMap = ({children, ...properties}) =>
		React.createElement('div', {
			...properties,
			className: 'mock-google-map',
		}, children);

	const mockInfoWindow = ({children, ...properties}) =>
		React.createElement('div', {
			...properties,
			className: 'mock-info-window',
		}, children);

	const mockMarker = ({children, ...properties}) =>
		React.createElement('div', {
			...properties,
			className: 'mock-marker',
		}, children);
	return {
		...plugin,
		GoogleMap: jest.fn().mockImplementation(mockGoogleMap),
		InfoWindow: jest.fn().mockImplementation(mockInfoWindow),
		Marker: jest.fn().mockImplementation(mockMarker),
	};
});
