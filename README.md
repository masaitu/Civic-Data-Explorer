# Civic Data Explorer – Upload 1-3

Civic Data Explorer is a browser-based learning project that demonstrates government data exploration patterns while prioritizing accessibility, responsive layouts, and evidence gathering.

## Quickstart
- `npm install`
- `npm run dev` ? http://localhost:4173/#/home
- `npm test` ? lint + Jest
- `npm run audit:a11y` ? Lighthouse accessibility (local server)

## Upload 3 highlights (Async, Storage & UX)
- Hash SPA shell with fragments swapped dynamically; routes `#/home`, `#/datasets`, `#/feedback`.
- Retryable fetches with offline fallback; status messaging for errors.
- Debounced search + category filtering retained; refresh button forces sync.
- Bookmarks persisted in IndexedDB (localStorage fallback) via “Save bookmark” buttons on dataset cards.
- Toast/notice UI communicates saves/errors without disrupting focus.

## Structure
- `public/index.html` shell; fragments in `public/fragments/`.
- Modules in `public/js/modules/` (router, view loader, stores, retry, storage, API, helpers).
- Dataset UI in `public/js/data-page.js`; styles in `public/css/`.
- Evidence/docs: `evidence/` (Lighthouse, contrast, screenshots), `docs/module-graph.md`, `docs/upload-1-logbook.pdf`.
- Addenda: `README-upload2.md`, `README-upload3.md`.

## Testing & CI
- `npm test` runs HTMLHint, Stylelint, and Jest (pure/state logic).
- GitHub Actions: lint/test; Pages deploy workflow publishes `public/`.

## Deployment
- Static build served from `public/`; GitHub Pages workflow (`.github/workflows/pages.yml`) publishes on push to `main`.

## Ethics & accessibility
- Accessible navigation: skip link, focus-visible, single `<h1>` per view, ARIA only where needed.
- Color tokens validated for contrast; async operations provide status text and fallbacks to avoid silent failure.
