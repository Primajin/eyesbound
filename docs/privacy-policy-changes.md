# Privacy policy: changes to the generated text

Files: `site/content/privacy/privacy.en.md` and `privacy.de.md`. The original generated files from WBS are in the zips on the owner's Desktop; diff against them to review. This list covers every change and was made on the owner's instruction. It is not legal advice, and the legal wording was not rewritten. All removals are identical in EN and DE, and both files still have the same 15 numbered sections.

## Controller email

| Section | Change |
| --- | --- |
| 2 (Controller), EN and DE | `privacy@eyesbound.com` is now `admin@eyesbound.com`, the same as the imprint. The rendered `mailto:` link matches. Name and website lines are kept. No street address or phone number appears anywhere. |

## Removals and edits (EN / DE)

Section numbers are those of the generated original, except where "new" is given.

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

Heading numbers are now: 1 Definitions, 2 Controller, 3 General data, 4 Contact, 5 Deletion, 6 Rights, 7 Purpose, 8 Legal basis, 9 Legitimate interests, 10 Duration, 11 Automated decisions, 12 Third-country recipients, 13 Complaint, 14 Cloudflare, 15 Google Maps.

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

- Intro paragraphs 1 and 2: "social media pages", "name, address, email or telephone number" as examples.
- Section 3: the statistical evaluation of log files.
- Section 4: the consent paragraph (Art. 6(1)(a), Art. 49(1)(1)(a) GDPR) and its bold text, which refers to "entering and transmitting" data.
- Section 7: the general-purpose paragraph (customers, interested parties, business partners) and the recipient categories (intragroup processing).
- Section 8: the vital-interests example (an injured visitor "in our organisation") and the customer example in recital 47.
- Section 9: the default legitimate interest ("well-being of our staff and our shareholders").
- Section 10: "contractual or internal retention period".
- Sections 6 f) and 6 h): contract wording in the rights texts.
- Sections 11 and 14 (formerly 12 and 15): their conditional contract text.
- Sections 14 and 15: the "contractual relationship" retention criterion.
- Section 11 was removed as a whole. The statement whether providing data is obligatory still appears in the Cloudflare and Google Maps sections.
- Generated inconsistency, not changed: the closing paragraph says "ISO 27001" in EN and "ISO 37001" in DE.
- Our Maps subsection still uses the word "consent" in its heading and in the storage and withdraw texts (and in the button label). It states no legal basis.
