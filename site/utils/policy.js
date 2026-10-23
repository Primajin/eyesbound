const headingOne = /<h1\b[^>]*>.*?<\/h1>\s*/sv;
const externalLink = /<a href="(?<url>https?:\/\/[^"]*)"/gv;
const lastParagraph = /<p>(?:(?!<p>).)*<\/p>\s*$/sv;

/**
 Adapts the rendered markdown of a generated privacy policy to the imprint page: drops its h1 (the page owns the heading), demotes h2 to h3 so no heading level is skipped, opens external links safely, and splits off the closing attribution paragraph so other content can sit between the last section and it.
 @param {string} html - Rendered markdown HTML.
 @returns {{body: string, closing: string}} The policy up to its last section, and the closing paragraph.
 */
export const preparePolicyHtml = html => {
	if (!headingOne.test(html)) {
		throw new Error('The privacy policy has no h1 to replace');
	}

	const adapted = html
		.replace(headingOne, '')
		.replaceAll(/<(?<closing>\/?)h2\b/gv, '<$<closing>h3')
		.replaceAll(externalLink, '<a href="$<url>" target="_blank" rel="noreferrer"');
	const closing = lastParagraph.exec(adapted)?.[0];
	if (closing === undefined) {
		throw new Error('The privacy policy has no closing paragraph');
	}

	return {body: adapted.slice(0, adapted.length - closing.length), closing};
};
