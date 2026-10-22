/**
Builds the document title, appending the site name when a page title exists.
 @param {string} [title] Optional page title
 @param {string} siteName Name appended to the title
 @returns {string} Full title.
 */
export const buildTitle = (title, siteName) => title ? `${title} | ${siteName}` : siteName;

/**
Builds the canonical URL (always with trailing slash) for a pathname.
 @param {string} pathname Request pathname.
 @param {string|URL} site Site origin.
 @returns {string} Absolute canonical URL.
 */
export const buildCanonicalUrl = (pathname, site) => {
	const slashed = pathname.endsWith('/') ? pathname : `${pathname}/`;
	return new URL(slashed, site).href;
};
