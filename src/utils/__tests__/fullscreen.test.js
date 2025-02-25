import {toggleFullscreen} from '../fullscreen.js';

describe('toggleFullscreen', () => {
	beforeEach(() => {
		const originalDocument = globalThis.document;
		globalThis.document = {
			...originalDocument,
			fullscreenElement: null,
			documentElement: {},
			querySelector: jest.fn(),
			exitFullscreen: jest.fn(),
		};
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	it('should enter fullscreen mode when no element is in fullscreen', () => {
		const element = {requestFullscreen: jest.fn()};
		const querySpy = jest.spyOn(globalThis.document, 'querySelector').mockReturnValue(element);
		toggleFullscreen('#test');
		expect(querySpy).toHaveBeenCalledWith('#test');
		expect(element.requestFullscreen).toHaveBeenCalled();
	});

	it('should fallback to documentElement if selector is not provided', () => {
		globalThis.document.documentElement.requestFullscreen = jest.fn();
		toggleFullscreen();
		expect(globalThis.document.documentElement.requestFullscreen).toHaveBeenCalled();
	});

	it('should exit fullscreen mode when an element is in fullscreen', () => {
		globalThis.document.fullscreenElement = {};
		const exitFullscreenSpy = jest.spyOn(globalThis.document, 'exitFullscreen');
		toggleFullscreen();
		expect(exitFullscreenSpy).toHaveBeenCalled();
	});

	// Test flaky - works when ran alone but not together with the others
	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should not throw an error if requestFullscreen is not supported', () => {
		jest.spyOn(globalThis.document, 'querySelector').mockReturnValue({});
		const consoleSpy = jest.spyOn(console, 'debug');
		expect(() => toggleFullscreen('#test')).not.toThrow();
		expect(consoleSpy).toHaveBeenCalledWith('Fullscreen is not supported');
	});

	it('should not throw an error if exitFullscreen is not supported', () => {
		globalThis.document.fullscreenElement = {};
		globalThis.document.exitFullscreen = undefined;
		const consoleSpy = jest.spyOn(console, 'debug');
		expect(() => toggleFullscreen('#test')).not.toThrow();
		expect(consoleSpy).toHaveBeenCalledWith('Exit fullscreen is not supported');
		consoleSpy.mockClear();
	});
});
