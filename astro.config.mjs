import sitemap from '@astrojs/sitemap';
import {defineConfig, envField} from 'astro/config';
import dotenv from 'dotenv';

const defaultSiteUrl = 'https://eyesbound.com';
dotenv.config({path: ['.env.local', '.env'], quiet: true});

// Absent or blank SITE_URL falls back to the production origin (documented in .env.example).
const siteUrl = process.env.SITE_URL?.trim() || defaultSiteUrl;

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
	integrations: [sitemap()],
	env: {
		schema: {
			SITE_NAME: envField.string({context: 'server', access: 'public', default: 'EYESBOUND'}),
			PRISMIC_REPO_NAME: envField.string({context: 'server', access: 'public', default: 'eyesbound'}),
			MAPS_API_KEY: envField.string({context: 'client', access: 'public', optional: true}),
			PRISMIC_ACCESS_TOKEN: envField.string({context: 'server', access: 'secret', optional: true}),
		},
	},
	vite: {
		build: {
			assetsInlineLimit: 0,
		},
	},
});
