import {bool, object, arrayOf, string, array, shape, number} from 'prop-types';

/* eslint-disable camelcase,capitalized-comments */

const genericResponse = {edges: arrayOf(object), field: string, fieldValue: string, nodes: arrayOf(object), pageInfo: object, totalCount: number};
const customResponse = {
	_previewable: string,
	alternate_languages: array,
	children: array,
	data: object,
	dataRaw: object,
	dataString: string,
	first_publication_date: shape({
		difference: string,
		formatString: string,
		fromNow: bool,
		locale: string
	}),
	href: string,
	id: string,
	internal: object,
	lang: string,
	last_publication_date: shape({
		difference: string,
		formatString: string,
		fromNow: bool,
		locale: string
	}),
	parent: object,
	prismicId: string,
	tags: arrayOf(string),
	type: string,
	uid: string,
	url: string
};

const Picture = {
	category: object,
	coordinates: shape({
		latitude: number,
		longitude: number
	}),
	datetime: string,
	homepage: bool,
	image: shape({
		alt: string,
		copyright: string,
		dimensions: shape({
			width: number,
			height: number
		}),
		fixed: object,
		fluid: object,
		localFile: object,
		thumbnails: object,
		url: string
	}),
	series: object,
	tags: arrayOf(object),
	title: string
};

const allDirectory = {...genericResponse};
const allFile = {...genericResponse};
const allPrismicCategory = {...genericResponse};
const allPrismicPicture = {...genericResponse};
const allPrismicSeries = {...genericResponse};
const allPrismicTags = {...genericResponse};
const allSite = {...genericResponse};
const allSiteBuildMetadata = {...genericResponse};
const allSitePage = {...genericResponse};
const allSitePlugin = {...genericResponse};
const directory = object;
const file = object;
const prismicCategory = {...customResponse};
export const prismicPicture = {...customResponse, data: shape(Picture)};
const prismicSeries = {...customResponse};
const prismicTags = {...customResponse};
/* Not needed for now
const site = {
	buildTime: PropTypes.object,
	children: PropTypes.object,
	host: PropTypes.object,
	id: PropTypes.object,
	internal: PropTypes.object,
	parent: PropTypes.object,
	pathPrefix: PropTypes.object,
	polyfill: PropTypes.object,
	port: PropTypes.object,
	siteMetadata: PropTypes.object
};
const siteBuildMetadata = {
	buildTime: PropTypes.object,
	children: PropTypes.object,
	id: PropTypes.object,
	internal: PropTypes.object,
	parent: PropTypes.object
};
const sitePage = {
	children: PropTypes.object,
	component: PropTypes.object,
	componentChunkName: PropTypes.object,
	componentPath: PropTypes.object,
	context: PropTypes.object,
	id: PropTypes.object,
	internal: PropTypes.object,
	internalComponentName: PropTypes.object,
	isCreatedByStatefulCreatePages: PropTypes.object,
	matchPath: PropTypes.object,
	parent: PropTypes.object,
	path: PropTypes.object,
	pluginCreator: PropTypes.object,
	pluginCreatorId: PropTypes.object
};
const sitePlugin = {
	children: PropTypes.object,
	id: PropTypes.object,
	internal: PropTypes.object,
	name: PropTypes.object,
	nodeAPIs: PropTypes.object,
	packageJson: PropTypes.object,
	parent: PropTypes.object,
	pluginFilepath: PropTypes.object,
	pluginOptions: PropTypes.object,
	resolve: PropTypes.object,
	ssrAPIs: PropTypes.object,
	version: PropTypes.object
};
*/

const Query = {
	allDirectory,
	allFile,
	allPrismicCategory,
	allPrismicPicture,
	allPrismicSeries,
	allPrismicTags,
	allSite,
	allSiteBuildMetadata,
	allSitePage,
	allSitePlugin,
	directory,
	file,
	prismicCategory,
	prismicPicture,
	prismicSeries,
	prismicTags
	// site,
	// siteBuildMetadata,
	// sitePage,
	// sitePlugin
};
/* eslint-enable */

export default Query;
