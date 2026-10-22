import {defineConfig, devices} from '@playwright/test';

const port = 4322;

export default defineConfig({
	testDir: './e2e',
	testMatch: '**/*.spec.js',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${port}`,
		trace: 'retain-on-failure',
	},
	projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
	webServer: {
		command: `npx astro preview --port ${port} --ignore-lock`,
		url: `http://localhost:${port}/`,
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
});
