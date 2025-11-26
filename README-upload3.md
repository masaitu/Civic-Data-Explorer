# Upload 3 – Async, Storage & UX (Simple Overview)

This is the Upload 3 hand-in, written plainly for quick review.

## What changed
- **Smarter loading:** When we fetch data, we try again once if it fails. If the external time check is down, we fall back to the local dataset and tell the user we are offline.
- **Clear messages:** The status line and small toast popups explain what is happening (loading, offline, saved bookmark) without stealing focus.
- **Bookmarks saved:** Each dataset card has “Save bookmark.” Bookmarks are stored in the browser (IndexedDB) with a backup to localStorage if needed.
- **Still smooth:** Search is debounced (waits briefly while you type), and the refresh button re-runs the fetch with the same safeguards.

## Key files
- `public/js/modules/retry.js` — retry helper for fetch.
- `public/js/modules/storage.js` — bookmark saving (IndexedDB + localStorage backup).
- `public/js/modules/apiClient.js` — data fetch with retry and offline fallback.
- `public/js/data-page.js` — hooks up bookmarks, toasts, and status messages.
- `public/fragments/data.html` — adds the toast area and dataset sections.
- `public/css/base.css` — styles for the toast and bookmark button.
- Evidence images: `evidence/network-panel.png`, `evidence/failure-demo.png`, `evidence/indexeddb-view.png`.
- Tests: `tests/retry.test.js` (plus existing helper/store tests).
- Module list: `docs/module-graph.md`.

## How to run
- `npm install`
- `npm run dev` ? open `http://localhost:4173/#/datasets`
- `npm test` ? runs lint + Jest
- (Optional) `npm run audit:a11y` for Lighthouse

## What to show as evidence
- Network panel screenshot (`evidence/network-panel.png`).
- Failure mode screenshot (`evidence/failure-demo.png`).
- IndexedDB viewer screenshot (`evidence/indexeddb-view.png`).
- Module write-up (`docs/module-graph.md`).
- Passing test output (`npm test`).

## Reviewer checklist
- Refresh shows loading; if the time API fails, you still see data with an “offline” note.
- “Save bookmark” shows a quick toast and the entry appears in IndexedDB (`cde-cache` ? `bookmarks`).
- Navigation and focus stay accessible (skip link, focus-visible) as in earlier uploads.
- No console errors; tests pass.
