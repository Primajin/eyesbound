// eslint-disable-next-line unicorn/prefer-module
exports.linkResolver = doc => {
	switch (doc.type) {
		case 'category':
			return `/category/${doc.uid}`;
		case 'picture':
			return `/picture/${doc.uid}`;
		case 'series':
			return `/series/${doc.uid}`;
		case 'tags':
			return `/tag/${doc.uid}`;
		default:
			// Backup for all other types
			return '/';
	}
};
