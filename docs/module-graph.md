# Module graph (Upload 2)

- `public/js/app.js` → orchestrates the hash router, fetches fragments, toggles nav aria-current, calls `mountDataView`, and observes notice state from `AppStore`.
- `public/js/modules/router.js` → `HashRouter` class watching `hashchange` and dispatching routes to `onNavigate`.
- `public/js/modules/viewLoader.js` → fetches HTML fragments and swaps `<main>` + `<aside>` content.
- `public/js/modules/appStore.js` → minimal pub/sub store for route + notice state.
- `public/js/data-page.js` → mounts dataset UI: wires filters to `DatasetStore`, renders cards/status/summary.
- `public/js/modules/datasetStore.js` → stateful store managing dataset payloads, filters, persistence.
- `public/js/modules/apiClient.js` → fetches local JSON and external Nairobi time in parallel with fallback.
- `public/js/modules/filter-utils.js` → pure helpers for filtering, summary, formatting, debounce, and hydration.
