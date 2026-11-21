# UCXO localization — local review build

Status: implemented for local review; **not approved for publication**. No remote push or deployment was performed. English remains the source. All 33 other catalogues are translation drafts. Automated text checks are not a guarantee of correct meaning or complete raster-artwork coverage.

## Preview and reproduction

Local production preview: http://127.0.0.1:3004/ . Examples: /fr/ and /ar/how-it-works/ . A remembered language redirects unprefixed pages; use /en/ to explicitly restore English.

Run from `C:\Users\HP\Desktop\Chief Engine Website\chief-engine` with Node 22.18+ (the maintenance tests use Node's TypeScript stripping) and npm:

```powershell
npm.cmd ci
npm.cmd run check:i18n
node scripts/inventory-localization.cjs --check
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd start -- --hostname 127.0.0.1 --port 3004
```

The former Python/static-export preview is unsuitable for localized server routes. The application now needs Next.js server rendering and Proxy; English route shapes and trailing slashes remain unchanged. `next.config.ts` includes the stored catalogues in the server function file trace for a future Vercel deployment. Production Vercel routing is **not remotely verified** because deployment was not authorized by this request.

The installed Next.js 16.4.3 build emits a known security vulnerability warning and initially exits after compiling; a subsequent identical build completed with that warning. No framework upgrade was made as part of localization. Resolve the security warning before a production release.

## Integration

- `i18n/locales.json` is the runtime registry of the exact 34 codes, native names and directions. Arabic, Persian and Hebrew are RTL. No browser-language or geography detection.
- English URLs stay unprefixed; translated routes use a supported prefix. The explicit URL wins over the saved language, including `/en/`. The selector preserves query/hash and saves unfinished demo form fields before navigating. Choice persists in a functional cookie and local storage.
- The server emits the active catalogue with correct initial `lang`/`dir`. Catalogue files are cached on the server by file version; other translation catalogues are not bundled into initial client data. Language switching requests one complete server-rendered target document, preventing partial-language updates. No runtime translation service is called.
- Initial localized metadata includes canonical, 35 hreflang alternatives (34 locales plus x-default) and translated social copy. The sitemap lists 102 primary route URLs. The separate carousel review route is localized and noindex.
- Unknown paths are rewritten to an escaped localized HTML response with actual HTTP 404 and correct initial language/direction, including without JavaScript.
- HTML, SVG, accessible labels, native form validity messages, generated email subject/body, captions, and collapsed transcripts use stored messages. Email user values, `info@ubossai.com`, external sign-in, brands, partner marks and identifiers remain unchanged. No email was sent during testing.
- The homepage uses WebP software captures plus HTML panels and animated cursor/highlights. Recognized raster text is covered by opaque, translated overlay boxes; original English assets remain untouched and return in English. The explainer uses rendered SVG workflow UI and one original English WAV clock; its localized captions follow the existing cue-to-audio timing map. Both players visibly identify the audio as English in the selected language. Switching language leaves sound muted.
- English source keys are stable hashes with source snapshots in translated entries. Strict translated rendering rejects unknown owned English messages instead of silently falling back. Build-time validation checks missing, stale, empty, extra, malformed and placeholder-mismatched entries. Complete sentences with visual line breaks are translated as a whole before wrapping.

## Verification and reproduction

Install a Chromium browser if Chrome is absent (`npx playwright install chromium`); scripts use system Chrome on Windows, or set `CHROME_EXECUTABLE` to the Chromium executable. Keep the production preview running in a separate terminal.

```powershell
npm.cmd run audit:i18n
node scripts/audit-responsive-localization.browser.cjs
node scripts/audit-language-switch.browser.cjs
node scripts/audit-media-routing.browser.cjs
```

Evidence is checked into `i18n/`:

- `validation-report.json`: 34 locales, 1,165 messages each, zero structural defects; 33 locales still require fluent review. Identical translated values are listed for explicit review rather than automatically approved.
- `source-inventory.json`: source references and screenshot-box locations; zero new unregistered text candidates. This is an inventory, not a semantic proof.
- `browser-audit.json`: all 34 locales across the three primary routes; 17 homepage steps, four explainer chapters, five journey steps, FAQ answers, transcripts, focus/expanded preview, form validation, caption/control text and accessibility attributes. Checks known source-English leaks and runtime errors. It also checks actual 404 responses and initial HTML language/direction. Earlier Korean/Indonesian navigation timeouts passed independently (`browser-audit-retry.json`); the final full run uses a 30-second timeout.
- `responsive-audit.json`: all 34 locales on the three routes at 390px; additional homepage widths 320, 700, 701 and 1024 for English, German, Norwegian, French, Arabic and Amharic; language-menu bounds. This checks page overflow, not visual perfection of every label.
- `media-routing-audit.json`: actual mobile Chrome audio startup, pause, four chapter seeks/replays and matching translated captions in French and Arabic; translated homepage introduction; JS-disabled saved-language/explicit-English behavior; canonical/hreflang/sitemap; 32 inactive-catalogue text probes absent from the initial French HTML; no runtime translation requests; both WAV files support byte Range 206. Also records a read-only public-site baseline.
- `audit-language-switch.browser.cjs`: one browser session switches English → Arabic → English with form drafts/query/hash preserved; English → French → English restores original artwork and stays muted; explicit French URL beats a saved Arabic choice. JavaScript-disabled translated 404s are checked in French, Arabic, Persian, Hebrew and Traditional Chinese, with all 34 raw HTTP responses checked by the larger audit.
- `npm.cmd test`: 11 regression checks, including existing audio-content/continuous-clock tests, locale registry/URL rules, interpolation reordering, strict missing-message detection and the local email payload.

Final visual samples were examined for French desktop and Arabic mobile (home/explainer), plus Japanese desktop. Capture files are in the sibling `how-it-works-review/localization/` directory and are not required to run the app. Automated Chrome emulation does not replace Safari/iOS or Android device testing. Interactions are sampled at recorded steps; no claim is made of reviewing every animation frame or every possible combination of states.

## Explicit review gaps before release

`i18n/review-manifest.json` enumerates **every affected locale, route, raster asset/scene, guided-tour step and explainer chapter**, including OCR low-confidence text and active/inactive homepage assets.

1. **Fluent review: all 33 non-English locales on all four supported page types.** Machine/AI drafts need terminology, grammatical, semantic and tone review, including legitimate identical translations and email templates. Drafts must not be presented as professionally certified translations.
2. **Raster coverage: all 23 scenes listed in the manifest × all 33 non-English locales**, on `/` and `/carousel-preview/` where used. OCR-derived boxes can miss text or misread words, and tiny translated copy can be too small. Opaque masks replace recognized English; complete every-pixel masking, correct translation of mis-OCR text and font fit in focused/fullscreen/mobile states remain unverified. This is the principal incomplete part of the every-word acceptance criterion. Do a scene-by-scene human comparison and repair boxes/source text or provide approved localized exports before release. English source art is unchanged.
3. **Rendered workflow native typography/meaning: all four `/how-it-works/` chapters × all 33 non-English locales.** Programmatic caption/canvas checks and French/Arabic timing tests passed, but native-script layout/readability and semantic accuracy still need reviewers. Selected screenshots cannot certify all locales or every frame.
4. **Dubs:** no approved translated tracks were supplied. Both original English tracks remain explicitly labeled; localized synchronized captions/transcripts are available. This follows the allowed original-audio policy.
5. **Platform validation:** no Vercel deployment, protection/domain/edge-cache test or physical-device Safari/Android test was performed. Validate the same routes, server headers, 404 status and catalogue tracing on a future authorized deployment.
6. **Security:** resolve the existing Next.js vulnerability warning before production release.

## Translation maintenance and approval

Edit each catalogue entry's `text`, keep its `source` snapshot synchronized with the English source, and mark reviewed entries with `reviewed: true`. The draft tooling preserves reviewed entries. For a legitimately identical non-brand translation, supply a specific `identicalApproved` reason on that locale entry; do not add ordinary words to the global brand glossary. Change an entire catalogue's `status` to `reviewed` only after its full fluent review is complete.

`node scripts/validate-localization.cjs --release` intentionally fails while draft/unapproved-identical review remains. Structural `check:i18n` runs automatically before builds. Development-only draft tools contact an external translation service when explicitly run; they are never called by the website. OCR extraction tools need Pillow, NumPy and rapidocr-onnxruntime installed locally, and generated boxes require visual correction. Do not commit `.localization-tools/` or credentials.
