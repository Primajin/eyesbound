/* global localStorage */
// localStorage may be used only after it has been checked against being undefined

const getItem = () => null;
const setItem = () => undefined;

/**
 * Does user prefer dark mode UI in Local Storage settings?
 * @type {object}
 */
export const fromLocalStorage = typeof localStorage === 'undefined' ? {getItem, setItem} : localStorage;
