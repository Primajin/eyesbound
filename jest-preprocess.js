const babelOptions = {
	presets: [
		'babel-preset-gatsby',
		[
			'@emotion/babel-preset-css-prop',
			{
				sourceMap: false,
				autoLabel: 'dev-only',
				labelFormat: '[local]',
				cssPropOptimization: false,
			},
		],
	],
};

module.exports = require('babel-jest').default.createTransformer(babelOptions);
