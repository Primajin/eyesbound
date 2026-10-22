const fullscreenAttribute = 'data-fullscreen';

/**
 Toggles fullscreen for the first element matching `selector`, falling back to the whole document.
 @param {Document} root Document to act on.
 @param {string} selector CSS selector of the element to show fullscreen.
 @returns {Promise<void>} Resolves when the browser has switched (or refused, which is ignored: the toggle stays inert).
 */
export const toggleFullscreen = async (root, selector) => {
	try {
		await (root.fullscreenElement ? root.exitFullscreen() : (root.querySelector(selector) ?? root.documentElement).requestFullscreen());
	} catch {
		// Fullscreen refused or unsupported (for example iPhone Safari): nothing to toggle
	}
};

/**
 Wires every fullscreen button and mirrors the state as `data-fullscreen` on `<html>` so CSS can dim the controls.
 @param {Document} root Document containing the buttons.
 */
export const initFullscreen = root => {
	const html = root.documentElement;
	const buttons = [...root.querySelectorAll('[data-fullscreen-toggle]')];

	root.addEventListener('fullscreenchange', () => {
		const isActive = Boolean(root.fullscreenElement);
		html.toggleAttribute(fullscreenAttribute, isActive);
		for (const button of buttons) {
			button.setAttribute('aria-pressed', String(isActive));
		}
	});

	for (const button of buttons) {
		button.addEventListener('click', () => toggleFullscreen(root, button.dataset.fullscreenToggle));
	}
};
