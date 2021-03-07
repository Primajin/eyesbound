/**
 * Does user prefer dark mode UI in Operation System settings?
 * @type {boolean}
 */
export const userPrefersDark = typeof window !== 'undefined' && window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const breakpoints = new Map([['sm', 576], ['md', 768], ['lg', 992], ['xl', 1200]]);
/**
 * Gets media query for given breakpoint
 * @param {('sm'|'md'|'lg'|'xl')} breakpoint The name of the breakpoint
 * @returns {('576px'|'768px'|'992px'|'1200px')} The media query with min-width going UP
 */
export const up = breakpoint => `@media (min-width: ${breakpoints.get(breakpoint)}px)`;
