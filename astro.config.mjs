import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import {defineConfig, envField} from 'astro/config';
import dotenv from 'dotenv';

const defaultSiteUrl = 'https://eyesbound.com';
dotenv.config({path: ['.env.local', '.env'], quiet: true});

const siteUrl = process.env.GATSBY_SERVER_URL ?? defaultSiteUrl;

export default defineConfig({
	site: siteUrl,
	srcDir: './site',
	publicDir: './site/public',
	outDir: './dist',
	trailingSlash: 'always',
	build: {
		format: 'directory',
		inlineStylesheets: 'never',
	},
	image: {
		domains: ['images.prismic.io'],
	},
	integrations: [react(), sitemap()],
	env: {
		schema: {
			GATSBY_SITE_NAME: envField.string({context: 'server', access: 'public', default: 'EYESBOUND'}),
			PRISMIC_REPO_NAME: envField.string({context: 'server', access: 'public', default: 'eyesbound'}),
			GATSBY_G_MAPS: envField.string({context: 'client', access: 'public', optional: true}),
			PRISMIC_ACCESS_TOKEN: envField.string({context: 'server', access: 'secret', optional: true}),
		},
	},
	vite: {
		build: {
			assetsInlineLimit: 0,
		},
	},
});
