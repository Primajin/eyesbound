export const consentKey = 'eyesbound.mapConsent';

const granted = 'granted';
const sessionGrants = new WeakSet();

const useStorage = (win, action) => {
	try {
		return action(win.localStorage);
	} catch {
		return null;
	}
};

/**
 Tells whether the visitor agreed to load Google Maps. Without usable storage only a grant given in this page view counts.
 @param {Window} win Window to read from.
 @returns {boolean} True when consent was given and not withdrawn.
 */
export const hasConsent = win => sessionGrants.has(win) || useStorage(win, storage => storage.getItem(consentKey)) === granted;

/**
 Remembers the visitor's consent in localStorage, and for this page view even when storage is unavailable.
 @param {Window} win Window to write to.
 */
export const grantConsent = win => {
	sessionGrants.add(win);
	useStorage(win, storage => storage.setItem(consentKey, granted));
};

/**
 Withdraws the consent from localStorage and from this page view.
 @param {Window} win Window to write to.
 */
export const revokeConsent = win => {
	sessionGrants.delete(win);
	useStorage(win, storage => storage.removeItem(consentKey));
};

/**
 Wires the withdraw buttons (`[data-map-consent-revoke]`) and reveals the `[data-map-consent-done]` messages (one per language) once consent is withdrawn.
 @param {Document} root Document to act on.
 */
export const initConsentRevoke = root => {
	const messages = root.querySelectorAll('[data-map-consent-done]');
	for (const button of root.querySelectorAll('[data-map-consent-revoke]')) {
		button.addEventListener('click', () => {
			revokeConsent(root.defaultView);
			for (const message of messages) {
				message.hidden = false;
			}
		});
	}
};
