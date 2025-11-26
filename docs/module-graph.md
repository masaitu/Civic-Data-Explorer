# Module graph (Upload 3)

- `public/js/app.js` ? orchestrates hash router, fragment loader, notice updates, mounts dataset view.
- `public/js/modules/router.js` ? HashRouter class for hashchange.
- `public/js/modules/viewLoader.js` ? fetches/swaps main + aside fragments.
- `public/js/modules/appStore.js` ? route/notice pub-sub.
- `public/js/modules/datasetStore.js` ? dataset/filter state, persistence, summaries.
- `public/js/modules/apiClient.js` ? fetches mock data + Nairobi time with retry; offline fallback.
- `public/js/modules/retry.js` ? retry helper with backoff.
- `public/js/modules/storage.js` ? bookmarks persistence via IndexedDB with localStorage fallback.
- `public/js/data-page.js` ? dataset UI (debounced search, category filter, refresh, bookmarks, status/summary renders).
- `public/js/modules/filter-utils.js` ? pure helpers (filter, summarize, format, debounce, hydrate).
