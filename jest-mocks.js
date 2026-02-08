/* global jest */
/* eslint-disable unicorn/prefer-module */
jest.mock('gatsby-plugin-image', () => {
	const React = require('react');
	const plugin = jest.requireActual('gatsby-plugin-image');
	const mockImage = ({imgClassName, image, ...properties}) => {
		// Serialize image object for better snapshots
		const imageData = image
			? {
				'data-image-width': image.width,
				'data-image-height': image.height,
				'data-image-layout': image.layout,
			}
			: {};

		return React.createElement('img', {
			...properties,
			...imageData,
			className: imgClassName,
		});
	};

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

	const serializeObject = (object, prefix = '') => {
		if (!object || typeof object !== 'object') {
			return {};
		}

		const result = {};
		for (const [key, value] of Object.entries(object)) {
			const attrKey = prefix ? `${prefix}-${key}` : `data-${key}`;
			if (typeof value === 'object' && value !== null) {
				result[attrKey] = JSON.stringify(value);
			} else if (value !== undefined && value !== null) {
				result[attrKey] = String(value);
			}
		}

		return result;
	};

	const mockGoogleMap = ({children, center, mapContainerStyle, options, ...properties}) => {
		const centerAttrs = center
			? {
				'data-center-lat': String(center.lat),
				'data-center-lng': String(center.lng),
			}
			: {};
		const styleAttrs = mapContainerStyle ? serializeObject(mapContainerStyle, 'data-style') : {};
		const optionAttrs = options ? serializeObject(options, 'data-option') : {};

		return React.createElement('div', {
			...properties,
			...centerAttrs,
			...styleAttrs,
			...optionAttrs,
			className: 'mock-google-map',
		}, children);
	};

	const mockInfoWindow = ({children, position, options, onCloseClick, ...properties}) => {
		const positionAttrs = position
			? {
				'data-position-lat': String(position.lat),
				'data-position-lng': String(position.lng),
			}
			: {};
		const optionAttrs = options ? serializeObject(options, 'data-option') : {};

		return React.createElement('div', {
			...properties,
			...positionAttrs,
			...optionAttrs,
			className: 'mock-info-window',
		}, [
			children,
			onCloseClick && React.createElement('button', {
				key: 'close-button',
				type: 'button',
				className: 'mock-close-button',
				onClick: onCloseClick,
			}, 'Close'),
		]);
	};

	const mockMarker = ({children, position, options, ...properties}) => {
		const positionAttrs = position
			? {
				'data-position-lat': String(position.lat),
				'data-position-lng': String(position.lng),
			}
			: {};
		const optionAttrs = options ? serializeObject(options, 'data-option') : {};

		return React.createElement('div', {
			...properties,
			...positionAttrs,
			...optionAttrs,
			className: 'mock-marker',
		}, children);
	};

	return {
		...plugin,
		GoogleMap: jest.fn().mockImplementation(mockGoogleMap),
		InfoWindow: jest.fn().mockImplementation(mockInfoWindow),
		Marker: jest.fn().mockImplementation(mockMarker),
	};
});
