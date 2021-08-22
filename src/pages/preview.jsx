import * as React from 'react';
import {withPrismicPreviewResolver} from 'gatsby-plugin-prismic-previews';
import 'gatsby-plugin-prismic-previews/dist/styles.css';

import {linkResolver} from '../../link-resolver.js';

const PreviewPage = () => (
	<div>
		<h1>Loading preview…</h1>
	</div>
);

export default withPrismicPreviewResolver(PreviewPage, [
	{
		repositoryName: process.env.GATSBY_PRISMIC_REPO_NAME,
		linkResolver,
	},
]);
