// LocalStorage may be used only after it has been checked against being undefined

/**
 Returns the current value associated with the given key, or null if the given key does not exist.
 @param {string} _key - The storage key to look up.
 @returns {string | null} The value for the key, or null if not found.
 */
const getItem = _key => null;

/**
 Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
 Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
 Dispatches a storage event on Window objects holding an equivalent Storage object.
 @param {string} _key - The storage key to set.
 @param {string} _value - The value to store.
 @returns {void}
 */
const setItem = (_key, _value) => {
	// Do nothing, this is a mock
};

/**
 Getter and setter for local storage
 @type {{getItem: (function(string): string | null), setItem: setItem}|Storage} fromLocalStorage
 */
export const fromLocalStorage = typeof localStorage === 'undefined' ? {getItem, setItem} : localStorage;
