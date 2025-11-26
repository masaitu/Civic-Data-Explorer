# Upload 3 - Async, Storage & UX

This addendum highlights Upload 3 deliverables.

## What changed for Upload 3
- Added retrying fetches and clearer error/offline states in the dataset view.
- Bookmarking with persistence: dataset cards now include a “Save bookmark” button stored in IndexedDB (with localStorage fallback).
- Debounced search retained; refresh button forces a new fetch with graceful fallback when the external API fails.
- Toast/notice UI communicates optimistic saves and API errors without losing focus.

## Key modules (new/updated)
- `public/js/modules/retry.js` – retry helper with simple backoff.
- `public/js/modules/storage.js` – bookmark persistence via IndexedDB + localStorage fallback.
- `public/js/modules/apiClient.js` – now uses retry and tighter error messages for offline fallback.
- `public/js/data-page.js` – wires bookmarks, toast messaging, and error status rendering.
- `public/fragments/data.html` – includes toast area and updated dynamic sections.

## Evidence to capture
- Network panel screenshot showing successful fetch + retry/offline indicator.
- Failure mode demo screenshot (status message/notice when fetch is forced to fail).
- IndexedDB viewer screenshot showing `cde-cache` / `bookmarks` contents.

## How to run for review
- `npm install`
- `npm run dev` ? `http://localhost:4173/#/datasets` to exercise fetch/refresh/bookmarks.
- `npm test` ? lint + Jest (pure/state tests).

## What to look for
- Pressing Refresh shows status updates; if the time API fails, the app falls back to local data and notes offline mode.
- Clicking “Save bookmark” shows a toast and persists the selection (check IndexedDB viewer in DevTools Application tab).
- Keyboard and focus behavior remain consistent with Upload 1/2 (skip link, focus-visible).
