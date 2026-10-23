import {expect, test} from '@playwright/test';

const englishSentences = [
	'We are pleased that you are interested in our organization.',
	'Personal Data means any information relating to an identified or identifiable natural person.',
	'Each Data Subject has the right to obtain from the Controller confirmation',
	'As a responsible company, we do not normally use automated decision-making or Profiling.',
	'This privacy policy was created using a generator developed with the support of',
	'Maps are not loaded automatically.',
	'Phone.:',
];

const germanSentences = [
	'Es freut uns sehr, dass Sie sich für unsere Organisation interessieren.',
	'Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person',
	'Jede betroffene Person hat das Recht, von dem Verantwortlichen eine Bestätigung',
	'Als verantwortungsbewusstes Unternehmen verzichten wir normalerweise auf eine automatische Entscheidungsfindung',
	'Die oben stehende Datenschutzerklärung wurde mit Unterstützung eines Generators erstellt',
	'Karten werden nicht automatisch geladen.',
	'Tel.:',
];

const expectVisible = (page, sentences) => Promise.all(sentences.map(sentence => expect(page.locator('main').getByText(sentence).and(page.locator(':visible')).first()).toBeVisible()));
const expectAbsent = (page, sentences) => Promise.all(sentences.map(sentence => expect(page.locator('main')).not.toContainText(sentence, {useInnerText: true})));

test.describe('imprint in German', () => {
	test('switching the language shows exactly one policy language at a time', async ({page}) => {
		await page.goto('/imprint/');
		await expect(page.locator('main h1')).toHaveText(/^contact & imprint$/iv, {useInnerText: true});
		await expectVisible(page, englishSentences.slice(0, -1));
		await expectAbsent(page, germanSentences);
		await expect(page.locator('main h3:visible').first()).toHaveText('1. Definitions', {useInnerText: true});

		await page.locator('[data-language-switcher]').click();
		await expect(page.locator('html')).toHaveAttribute('lang', 'de');

		await expect(page.locator('main h1')).toHaveText(/^kontakt & impressum$/iv, {useInnerText: true});
		await expect(page.locator('#privacy-policy')).toHaveText('Datenschutzerklärung', {useInnerText: true});
		await expect(page.locator('main h3:visible').first()).toHaveText('1. Definitionen', {useInnerText: true});
		await expectVisible(page, germanSentences.slice(0, -1));
		await expect(page.locator('address')).toContainText('E-Mail: admin@eyesbound.com');
		await expect(page.locator('address')).toContainText('Deutschland');
		await expect(page.locator('i.icon-cc-nc-eu')).toHaveAttribute('title', /^Nicht kommerziell/v);

		await expectAbsent(page, englishSentences);

		await page.locator('[data-language-switcher]').click();
		await expect(page.locator('i.icon-cc-nc-eu')).toHaveAttribute('title', /^NonCommercial/v);
		await expectVisible(page, englishSentences.slice(0, -1));
		await expectAbsent(page, germanSentences);
	});

	test('a stored German choice is applied on load without English policy text', async ({page}) => {
		await page.addInitScript(() => {
			localStorage.setItem('userLanguage', 'de');
		});
		await page.goto('/imprint/');
		await expect(page.locator('html')).toHaveAttribute('lang', 'de');
		await expectAbsent(page, englishSentences);

		await expect(page.locator('main h1')).toHaveText(/^kontakt & impressum$/iv, {useInnerText: true});
	});

	test('the withdraw control confirms in the visible language', async ({page}) => {
		await page.goto('/imprint/');
		await page.getByRole('button', {name: 'Forget map consent'}).click();
		await expect(page.getByRole('status').and(page.locator(':visible'))).toContainText('Map consent withdrawn.');
	});

	test('the policy anchor from the map consent panel scrolls to the policy heading', async ({page}) => {
		await page.goto('/imprint/#privacy-policy');
		await expect(page.locator('#privacy-policy')).toBeInViewport();
	});
});
