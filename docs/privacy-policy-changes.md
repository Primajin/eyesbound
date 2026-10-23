# Privacy policy: changes to the generated text

Files: `site/content/privacy/privacy.en.md` and `privacy.de.md`. The original generated files from WBS are in the zips on the owner's Desktop; diff against them to review. This list covers every change and was made on the owner's instruction. It is not legal advice, and the legal wording was not rewritten. All removals are identical in EN and DE, and both files still have the same numbered sections (14 after the second pass).

## Controller email

| Section | Change |
| --- | --- |
| 2 (Controller), EN and DE | `privacy@eyesbound.com` is now `admin@eyesbound.com`, the same as the imprint. The rendered `mailto:` link matches. Name and website lines are kept. No street address or phone number appears anywhere. |

## Removals and edits (EN / DE)

Section numbers in this first table are those of the generated original, except where "new" is given. The second pass is listed below with the numbers valid after the first pass.

| Section | Removed or edited (start of the text) | Reason |
| --- | --- | --- |
| Intro, paragraph 1 | " (e.g., via a cookie banner)" / " (z.B. über einem Cookie-Banner)" | The site sets no cookies and has no banner. |
| Intro, paragraph 3 | ", for example by telephone," / ", zum Beispiel telefonisch," | No phone contact is offered. |
| 3 | "and the advertising for them" / "sowie die Werbung für diese" | No advertising. |
| 4 | "and possibly a telephone number" / "und ggf. eine Telefonnummer" | No phone number. |
| 4 | "via a contact form, via an input form" / "über ein Kontaktformular, über ein Eingabeformular" | The site has no contact or input form. The sentence now reads "by email or in any other way". |
| 6 g) | "If we process Personal Data for direct marketing purposes ..." / "Verarbeiten wir personenbezogene Daten, um Direktwerbung zu betreiben ..." (whole paragraph) | No direct marketing. |
| 7 | "The categories of Personal Data that we process are customer data, prospective customer data, employee data (including applicant data) and supplier data." / "Die Kategorien personenbezogener Daten ... Kundendaten, Interessentendaten, Beschäftigtendaten (inkl. Bewerberdaten) und Lieferantendaten." (first sentence only; the recipients sentence stays) | The site has no customers, employees or applicants. |
| 8 | "If the Processing of Personal Data is necessary for the performance of a contract ... pre-contractual measures ... inquiries about our products or services." / "Ist die Verarbeitung personenbezogener Daten zur Erfüllung eines Vertrags ... Anfragen zu unseren Produkten oder Leistungen." (the Art. 6(1)(b) sentences) | The site has no shop and no contracts. The Art. 6(1)(c) sentence stays. |
| 9, heading | " and direct marketing" / " und Direktwerbung" | The marketing text was removed. |
| 9 | "We may send you direct advertising ..." / "Wir können Ihnen Direktwerbung ..." (paragraph) | No direct marketing. |
| 9 | "Our messages and newsletters may also constitute ..." / "Bei unseren Nachrichten und Newslettern ..." (paragraph) | No newsletter and no user accounts. |
| 11 (whole section) | "Legal or contractual provisions for the provision of Personal Data; necessity for the conclusion of the contract ..." / "Gesetzliche oder vertragliche Vorschriften zur Bereitstellung ..." | It concerns contracts only. Former sections 12 to 16 are now 11 to 15 in both languages. The text has no cross references to section numbers. |

## Second pass (owner-approved, conservative)

Section numbers are those after the first pass. Only text about things this site does not do was removed. Retained text was not reworded; where a deletion left a sentence unsupported, the whole sentence went.

| Section | Removed (start of the text) | Reason |
| --- | --- | --- |
| Intro, paragraph 1 | ", applications and social media pages" became " and applications" / ", Applikationen und Social Media Seiten von uns eingeschlossen" became " und Applikationen von uns eingeschlossen" | The site has no social media pages. |
| 7 | ", customers, interested parties, business partners or other contractual or pre-contractual relationships between the aforementioned groups (in the broadest sense)" / ", Kunden, Interessenten, Geschäftspartner oder sonstige vertragliche oder vorvertragliche Beziehungen ... (im weitesten Sinne)" | No customers, prospects or partners. The sentence now reads "relating to the Controller or legal obligations of the Controller". |
| 8 | "This would be the case, for example, if a visitor were injured in our organisation ..." / "Dies wäre beispielsweise der Fall, wenn ein Besucher in unserem Betrieb verletzt ..." | No premises or visitors. The Art. 6(1)(d) statement stays. |
| 8 | "We are permitted to carry out such Processing operations in particular because ..." and "In this respect, it took the view that a legitimate interest could be assumed, for example, if the Data Subject is a customer ... (Recital 47 Sentence 2 GDPR)." / "Solche Verarbeitungsvorgänge sind uns insbesondere deshalb gestattet ..." and "Er vertrat insoweit ... (Erwägungsgrund 47 Satz 2 DS-GVO)." | The customer example. The first sentence only justified that example, so it was removed too. The Art. 6(1)(f) definition stays. |
| 9 (whole section, "Legitimate interests in Processing ...") | "If the Processing of Personal Data is based on Art. 6 (1) (f) GDPR and no more specific legitimate interests are stated, our legitimate interest is ... our staff and our shareholders." / "Basiert die Verarbeitung ... Wohlergehens unseres Personals und unserer Anteilseigner." | The site has no staff or shareholders. The section is empty without it. Section 3 and the Cloudflare and Google Maps sections state their own legitimate interest. Former sections 10 to 15 are now 9 to 14 in both languages. There are no cross references to section numbers (checked with grep). |
| 10 (now 9) | "contractual or " in "the criterion is the contractual or internal retention period" / "vertragliche oder " | No contracts. The statutory and internal criteria stay. |
| 10 (now 9) | " if it is no longer required to fulfill or initiate a contract" / ", sofern sie nicht mehr zur Vertragserfüllung oder Vertragsanbahnung erforderlich sind" | Purely about contract performance. The deletion duty and its timing stay. |
| 6 f) | " or on a contract pursuant to Art. 6 (1) (b) GDPR" / " oder auf einem Vertrag gemäß Art. 6 (1) (b) DS-GVO" | No contracts. The consent basis and the rest of the right stay. |

Heading numbers are now: 1 Definitions, 2 Controller, 3 General data, 4 Contact, 5 Deletion, 6 Rights, 7 Purpose, 8 Legal basis, 9 Duration, 10 Automated decisions, 11 Third-country recipients, 12 Complaint, 13 Cloudflare, 14 Google Maps.

## Our own subsection "Settings stored in your browser"

New, in `site/pages/imprint.astro` with the keys `privacy.settings.heading` and `privacy.settings.text` (EN and DE), right before "Google Maps: consent and withdrawal" and after the generated sections. It is one sentence: the site stores the chosen colour theme, the chosen language and, if given, the choice for loading the map in the browser's local storage, only to remember the settings on the visitor's device; nothing is sent to us, no cookies are set, and the entries can be deleted in the browser settings. Verified in the code:

- Theme: `site/scripts/theme.js` and `site/public/theme-init.js`, key `userPrefersDark`, written only when the visitor toggles the theme.
- Language: `site/i18n/switcher.js` and `site/public/lang-init.js`, key `userLanguage`, written only when the visitor switches the language.
- Map: `site/scripts/map-consent.js`, key `eyesbound.mapConsent`, written only after "Load map".
- No other `setItem`, `sessionStorage` or `document.cookie` use exists in `site/`. The entries are only read in the browser and never sent anywhere.
- The service worker (`site/public/sw.js`) caches only fonts, global CSS and icons (static assets, no personal data or settings), so the sentence does not mention it.

## Our own subsection "Google Maps: consent and withdrawal"

`privacy.maps.basis` (EN and DE) was removed with its rendering in `site/pages/imprint.astro`. That text stated Art. 6(1)(a) consent as the legal basis, which contradicted the generated Google Maps section. The factual parts and the withdraw button are kept.

## Links

All hrefs were checked on 2026-10-23 with `curl -sIL -m 15`.

| URL | Where | Change | Status |
| --- | --- | --- | --- |
| https://www.dataprivacyframework.gov/list | Cloudflare and Google Maps sections, EN and DE (4 places) | The trailing period was inside the target and the text. It is now outside the link. | 200 |
| https://www.cloudflare.com | Cloudflare section, EN | Same fix. DE was already clean. | 200 |
| https://policies.google.com/privacy | Google Maps section, EN | Same fix. DE was already clean. | 200 |
| https://www.linkedin.com/in/heikomaniero/ | Intro | None | HEAD 405, GET 999. LinkedIn blocks automated requests, so this was not verified. |
| https://www.wbs.legal/ | Closing paragraph | None | 200 |
| https://dg-datenschutz.de/ | Closing paragraph | None | 200 |
| https://cert-authority.com/ | Closing paragraph | None | Not reachable over HTTPS: the TLS certificate has expired (curl error 60, status 000). Plain HTTP answers 301. **Dead or unsafe, not replaced.** |
| https://www.julia-hell.com | Imprint page | None | 200 (redirects to https://julia-hell.com/) |
| https://competition.adesignaward.com/design.php?ID=45698 | Imprint page | None | 200 |
| https://creativecommons.org/licenses/by-nc-sa/4.0/ | Imprint page | None | 200 |

## Kept, to be confirmed

The following were kept because they belong to the legal core, or because it was unclear whether they apply:

- Intro paragraph 2: "name, address, email or telephone number" as examples.
- Section 3: the statistical evaluation of log files.
- Section 4: the consent paragraph (Art. 6(1)(a), Art. 49(1)(1)(a) GDPR) and its bold text, which refers to "entering and transmitting" data.
- Section 7: the general-purpose sentence (now without the customer wording) and the recipient categories (intragroup processing).
- Section 6 h) and section 10 (automated decisions): the contract wording sits inside the Art. 22 (1) and (2) conditions in the same sentences as consent and law. Removing it would need renumbering the options, which is rewording, so it was kept.
- Sections 13 and 14 (Cloudflare, Google Maps): the "contractual relationship" retention criterion and the "not required by law or contract" text. They describe the real relationship with the provider.
- Section 9 was removed as a whole and the first-pass removal of the former section 11 stands. The statement whether providing data is obligatory still appears in the Cloudflare and Google Maps sections.
- Removing the "We are permitted ... because mentioned by the European legislator" sentence in section 8 is a judgment call: it only supported the recital 47 customer example.
- Generated inconsistency, not changed: the closing paragraph says "ISO 27001" in EN and "ISO 37001" in DE.
- Our Maps subsection still uses the word "consent" in its heading and in the storage and withdraw texts (and in the button label). It states no legal basis.
