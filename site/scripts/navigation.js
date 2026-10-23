/**
 Toggles the menu with its button and closes it on a click elsewhere or Escape.
 Opening by keyboard focus is handled in CSS (:focus-within), so this only covers pointers that do not focus buttons (Safari).
 @param {Document} root Document containing the navigation(s).
 */
export const initNavigation = root => {
	for (const nav of root.querySelectorAll('[data-navigation]')) {
		const button = nav.querySelector('button');
		const setOpen = open => {
			nav.classList.toggle('open', open);
			button.setAttribute('aria-expanded', String(open));
			if (!open && nav.contains(root.activeElement)) {
				root.activeElement.blur();
			}
		};

		button.addEventListener('click', () => {
			setOpen(!nav.classList.contains('open'));
		});
		root.addEventListener('click', ({target}) => {
			if (!nav.contains(target)) {
				setOpen(false);
			}
		});
		root.addEventListener('keydown', ({key}) => {
			if (key === 'Escape') {
				setOpen(false);
			}
		});
	}
};
