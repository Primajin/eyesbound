import {array, arrayOf, bool, exact, node, number, object, oneOfType, string} from 'prop-types';

const genericResponse = {
	edges: arrayOf(object),
	field: string,
	fieldValue: string,
	nodes: arrayOf(object),
	pageInfo: object,
	totalCount: number
};

const customResponse = {
	_previewable: string,
	alternate_languages: array,
	children: array,
	data: object,
	dataRaw: object,
	dataString: string,
	first_publication_date: exact({
		difference: string,
		formatString: string,
		fromNow: bool,
		locale: string
	}),
	href: string,
	id: string,
	internal: object,
	lang: string,
	last_publication_date: exact({
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

const Image = {
	alt: string,
	copyright: string,
	dimensions: exact({
		width: number,
		height: number
	}),
	fixed: exact({
		src: string,
		srcSet: string,
		srcSetWebp: string
	}),
	fluid: object,
	localFile: object,
	url: string
};

export const Picture = {
	category: object,
	coordinates: exact({
		latitude: number,
		longitude: number
	}),
	datetime: string,
	homepage: bool,
	image: exact({
		...Image,
		thumbnails: exact({
			thumbnail: exact(Image)
		})
	}),
	series: object,
	tags: arrayOf(object),
	title: string
};

// Category / Tag / Series
const ListData = {
	data: exact({title: string}),
	uid: string
};

export const ListDataNode = {
	node: exact(ListData)
};

// Pictures
const ThumbnailData = {
	data: exact(Picture),
	id: string,
	uid: string
};

export const ThumbnailDataNode = {
	node: exact(ThumbnailData)
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
const prismicPicture = {...customResponse, data: exact(Picture)};
export const prismicPictureNode = {node: exact(prismicPicture)};
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
	allDirectory: exact(allDirectory),
	allFile: exact(allFile),
	allPrismicCategory: exact(allPrismicCategory),
	allPrismicPicture: exact(allPrismicPicture),
	allPrismicSeries: exact(allPrismicSeries),
	allPrismicTags: exact(allPrismicTags),
	allSite: exact(allSite),
	allSiteBuildMetadata: exact(allSiteBuildMetadata),
	allSitePage: exact(allSitePage),
	allSitePlugin: exact(allSitePlugin),
	directory: exact(directory),
	file: exact(file),
	prismicCategory: exact(prismicCategory),
	prismicPicture: exact(prismicPicture),
	prismicSeries: exact(prismicSeries),
	prismicTags: exact(prismicTags)
	// site,
	// siteBuildMetadata,
	// sitePage,
	// sitePlugin
};

export default Query;

export const children = oneOfType([arrayOf(node), node]);
export const childrenRequired = oneOfType([arrayOf(node), node]).isRequired;
