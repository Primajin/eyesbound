/* global window */
/**
 * Does user prefer dark mode UI in Operation System settings?
 * @type {boolean}
 */
export const userPrefersDark = window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
