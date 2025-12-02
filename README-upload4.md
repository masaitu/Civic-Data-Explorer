# Upload 4 – Security, Performance & CI (Simple Overview)

## What changed
- **Safer input handling:** Search and form inputs are cleaned and validated before use; form shows friendly errors and saves a local draft when valid.
- **XSS hardening:** User-facing strings are escaped before rendering; we stick to `textContent` style updates and avoid injecting raw HTML.
- **Persistence:** Bookmarks stay in IndexedDB (with localStorage backup); feedback drafts save locally on submit.
- **Performance:** The dataset view is now lazy-loaded (code-split) when you visit `#/datasets`, keeping the initial load lighter. Toasts and status updates avoid layout jank.
- **CI:** Existing GitHub Actions workflow runs `npm test` (lint + Jest) on push/PR.

## Key files
- Input/safety: `public/js/modules/sanitize.js`, `public/js/form-page.js`, updated `public/js/data-page.js` and `public/fragments/form.html`.
- Escape/UX: `public/js/data-page.js` now escapes dataset text and keeps debounced search.
- Persistence: `public/js/modules/storage.js` (IndexedDB + localStorage fallback).
- Performance: Lazy import in `public/js/app.js` for the dataset and form views; styles for toast/form feedback in `public/css/base.css`.
- Evidence placeholders: `evidence/network-panel.png`, `evidence/failure-demo.png`, `evidence/indexeddb-view.png` (network, failure, storage); add DevTools performance trace JSON and a CI run screenshot here if required.

## How to run
- `npm install`
- `npm run dev` ? `http://localhost:4173/#/home` (go to `#/datasets` to load the split bundle)
- `npm test` ? lint + Jest
- Optional: `npm run audit:a11y`

## What to show as evidence
- Network panel with success and blocked time-API to illustrate retry/offline fallback.
- Failure state UI screenshot (status/notice text).
- IndexedDB viewer showing `cde-cache` ? `bookmarks` after saving a bookmark.
- (If required) DevTools Performance trace export and CI run screenshot.

## Reviewer checklist
- Form rejects bad input with clear messages; valid input shows a success note and saves a local draft.
- Search input is cleaned; dataset text renders escaped.
- Visiting `#/datasets` triggers lazy load (smaller initial payload); no console errors.
- `npm test` passes in CI and locally.
