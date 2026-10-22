const coordinatesOf = coordinates => {
	const {latitude, longitude} = coordinates ?? {};
	return Number.isFinite(latitude) && Number.isFinite(longitude) ? {latitude, longitude} : null;
};

const imageOf = image => {
	if (!image?.url) {
		return null;
	}

	return {
		url: image.url,
		alt: image.alt ?? '',
		width: image.dimensions?.width ?? null,
		height: image.dimensions?.height ?? null,
	};
};

const linkOf = link => link?.uid && !link.isBroken ? {uid: link.uid, title: link.data?.title ?? null} : null;

/**
Normalises a raw Prismic picture document. Absent fields become explicit null values.
 @param {object} document Raw document with resolved fetchLinks.
 @returns {object} Plain picture object.
 @throws {Error} When the document has no uid.
 */
export const normalizePicture = document => {
	if (!document?.uid) {
		throw new Error(`Prismic picture document ${document?.id ?? '(unknown id)'} has no uid.`);
	}

	const {data = {}} = document;
	return {
		uid: document.uid,
		title: data.title ?? null,
		homepage: data.homepage === true,
		datetime: data.datetime ?? null,
		coordinates: coordinatesOf(data.coordinates),
		image: imageOf(data.image),
		thumbnail: imageOf(data.image?.thumbnail),
		category: linkOf(data.category),
		series: linkOf(data.series),
		tags: (data.tags ?? []).map(({tag}) => linkOf(tag)).filter(Boolean),
	};
};

/**
Normalises a raw category, series or tags document.
 @param {object} document Raw document.
 @returns {{uid: string, title: string|null}} Plain object.
 @throws {Error} When the document has no uid.
 */
export const normalizeTitled = document => {
	if (!document?.uid) {
		throw new Error(`Prismic ${document?.type ?? ''} document ${document?.id ?? '(unknown id)'} has no uid.`);
	}

	return {uid: document.uid, title: document.data?.title ?? null};
};

const time = datetime => datetime ? Date.parse(datetime) : -Infinity;

/**
Sorts pictures by datetime descending; pictures without a date come last, ties by uid.
 @param {object[]} pictures Normalised pictures in any order.
 @returns {object[]} Copy of the list, newest first.
 */
export const sortPictures = pictures => pictures.toSorted((a, b) => {
	const difference = time(b.datetime) - time(a.datetime);
	return difference === 0 || Number.isNaN(difference) ? a.uid.localeCompare(b.uid) : difference;
});

/**
Sorts titled documents by title ascending in code point order (what Gatsby's GraphQL sort did, so "Dänemark" follows "Dresden" and "digital" follows "Zons"); untitled ones come last, ties by uid.
 @param {object[]} items Normalised documents in any order.
 @returns {object[]} Copy of the list, A to Z.
 */
export const sortByTitle = items => items.toSorted((a, b) => {
	if (a.title === b.title) {
		return a.uid.localeCompare(b.uid);
	}

	if (a.title === null || b.title === null) {
		return a.title === null ? 1 : -1;
	}

	return a.title < b.title ? -1 : 1;
});

/**
Latest pictures promoted to the homepage.
 @param {object[]} pictures Pictures sorted newest first.
 @param {number} [limit] Maximum number of pictures to return.
 @returns {object[]} Promoted pictures, newest first.
 */
export const homepagePictures = (pictures, limit = 5) => pictures.filter(picture => picture.homepage).slice(0, limit);

/**
Tells whether coordinates are usable: known and not the 0/0 that Prismic stores for "unset".
 @param {{latitude: number, longitude: number}|null} coordinates Normalised coordinates.
 @returns {boolean} True when the position can be shown.
 */
export const hasLocation = coordinates => Boolean(coordinates) && !(coordinates.latitude === 0 && coordinates.longitude === 0);

/**
Pictures with usable coordinates (known and not 0/0).
 @param {object[]} pictures Normalised pictures.
 @returns {object[]} Pictures that can be placed on the map.
 */
export const mapPictures = pictures => pictures.filter(({coordinates}) => hasLocation(coordinates));

/**
Pictures in a category.
 @param {object[]} pictures Normalised pictures, keeps their order.
 @param {string} uid Prismic uid of the category to match.
 @returns {object[]} Matching pictures.
 */
export const picturesByCategory = (pictures, uid) => pictures.filter(({category}) => category?.uid === uid);

/**
Pictures in a series.
 @param {object[]} pictures Normalised pictures, keeps their order.
 @param {string} uid Prismic uid of the series to match.
 @returns {object[]} Matching pictures.
 */
export const picturesBySeries = (pictures, uid) => pictures.filter(({series}) => series?.uid === uid);

/**
Pictures carrying a tag.
 @param {object[]} pictures Normalised pictures, keeps their order.
 @param {string} uid Prismic uid of the tag to match.
 @returns {object[]} Matching pictures.
 */
export const picturesByTag = (pictures, uid) => pictures.filter(({tags}) => tags.some(tag => tag.uid === uid));
