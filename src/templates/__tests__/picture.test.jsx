import React from 'react';
import {render} from '@testing-library/react';

import Picture from '../picture.jsx';

// Mock the fullscreen hook
jest.mock('../../utils/fullscreen.js', () => ({
	useFullscreen: () => [false, jest.fn()],
}));

// Mock the local storage
jest.mock('../../utils/local-storage.js', () => ({
	fromLocalStorage: {
		getItem: jest.fn(() => null),
		setItem: jest.fn(),
	},
}));

describe('Picture Template', () => {
	const mockPictureData = {
		prismicPicture: {
			uid: 'test-picture',
			data: {
				title: 'Test Picture',
				datetime: '2024-01-15T10:30:00+0000',
				coordinates: {
					latitude: 52.473_092,
					longitude: 13.327_628,
				},
				image: {
					alt: 'Test image',
					gatsbyImageData: {
						images: {
							fallback: {
								src: 'https://example.com/image.jpg',
							},
						},
					},
				},
				tags: [],
			},
		},
	};

	it('should display date correctly when datetime is provided', () => {
		const {container} = render(<Picture data={mockPictureData}/>);

		// Check that the date is displayed and not "Invalid Date"
		const timeElement = container.querySelector('time');
		expect(timeElement).toBeTruthy();

		const displayedText = timeElement.textContent;
		expect(displayedText).not.toContain('Invalid Date');
		expect(displayedText).not.toBe('Invalid Date');

		// The date should be formatted correctly (e.g., "January 15, 2024")
		// Using a regex to check for a valid date format
		expect(displayedText).toMatch(/\w+\s+\d{2},\s+\d{4}/);
	});

	it('should have correct datetime attribute on time element', () => {
		const {container} = render(<Picture data={mockPictureData}/>);

		const timeElement = container.querySelector('time');
		expect(timeElement).toBeTruthy();
		expect(timeElement.getAttribute('datetime')).toBe('2024-01-15T10:30:00+0000');
	});

	it('should not display date when datetime is not provided', () => {
		const dataWithoutDateTime = {
			prismicPicture: {
				uid: 'test-picture',
				data: {
					title: 'Test Picture',
					coordinates: {
						latitude: 52.473_092,
						longitude: 13.327_628,
					},
					image: {
						alt: 'Test image',
						gatsbyImageData: {
							images: {
								fallback: {
									src: 'https://example.com/image.jpg',
								},
							},
						},
					},
					tags: [],
				},
			},
		};

		const {container} = render(<Picture data={dataWithoutDateTime}/>);

		// Should not have a time element when no datetime is provided
		const timeElement = container.querySelector('time');
		expect(timeElement).toBeFalsy();
	});

	it('should display tags when provided', () => {
		const dataWithTags = {
			prismicPicture: {
				uid: 'test-picture',
				data: {
					title: 'Test Picture',
					datetime: '2024-01-15T10:30:00+0000',
					coordinates: {
						latitude: 52.473_092,
						longitude: 13.327_628,
					},
					image: {
						alt: 'Test image',
						gatsbyImageData: {
							images: {
								fallback: {
									src: 'https://example.com/image.jpg',
								},
							},
						},
					},
					tags: [
						{tag: {document: {data: {title: 'Nature'}, uid: 'nature'}}},
						{tag: {document: {data: {title: 'Urban'}, uid: 'urban'}}},
					],
					category: {
						document: {data: {title: 'Environment'}, uid: 'environment'},
					},
					series: {
						document: {data: {title: 'Berlin'}, uid: 'berlin'},
					},
				},
			},
		};

		const {container} = render(<Picture data={dataWithTags}/>);
		expect(container.textContent).toContain('Nature');
		expect(container.textContent).toContain('Urban');
		expect(container.textContent).toContain('Environment');
		expect(container.textContent).toContain('Berlin');
	});

	it('should render without title', () => {
		const dataWithoutTitle = {
			prismicPicture: {
				uid: 'test-picture',
				data: {
					datetime: '2024-01-15T10:30:00+0000',
					coordinates: {
						latitude: 52.473_092,
						longitude: 13.327_628,
					},
					image: {
						alt: 'Test image',
						thumbnails: {
							thumbnail: {
								gatsbyImageData: {
									images: {
										fallback: {
											src: 'https://example.com/thumb.jpg',
										},
									},
								},
							},
						},
					},
					tags: [],
				},
			},
		};

		const {container} = render(<Picture data={dataWithoutTitle}/>);
		expect(container.querySelector('main h1')).toBeFalsy();
	});
});
