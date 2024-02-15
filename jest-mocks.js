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
	const plugin = jest.requireActual('react-helmet');
	const mockHelmet = ({children, ...properties}) =>
		React.createElement('div', {
			...properties,
			className: 'mock-helmet',
		}, children);
	return {
		...plugin,
		Helmet: jest.fn().mockImplementation(mockHelmet),
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
