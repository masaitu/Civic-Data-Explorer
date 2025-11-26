# Upload 2 – Modules & State


## What changed for Upload 2
- Hash-based routing shell in `public/index.html` with swapped fragments (`public/fragments/home.html`, `data.html`, `form.html`).
- Navigation links use hashes (`#/home`, `#/datasets`, `#/feedback`) and set `aria-current` dynamically.
- Global app state via `AppStore` (route + notice), and a router-driven fragment loader.
- Dataset view mounts through the router but keeps debounce filters, category select, refresh, and live summaries.

## Key modules
- `public/js/modules/router.js` – HashRouter watches URL changes and triggers view loads.
- `public/js/modules/viewLoader.js` – Fetches HTML snippets and swaps main/aside content, then lets each view run its setup.
- `public/js/modules/appStore.js` – Lightweight pub/sub for current route and notice text.
- `public/js/modules/datasetStore.js` – Manages datasets, filters, storage, and summaries.
- `public/js/modules/apiClient.js` – Loads mock data plus Nairobi time with fallback.
- `public/js/modules/filter-utils.js` – Pure helpers: filter, summarize, format, debounce, hydrate.
- `public/js/app.js` – Wires router, fragments, notice updates, and mounts the dataset view when needed.

## Evidence
- Module import write-up: `docs/module-graph.md`.
- Tests for pure/state logic: `tests/filter-utils.test.js`, `tests/datasetStore.test.js`; run `npm test` (includes lint).
- Source tree shows modular layout: routes in `public/fragments/`, modules in `public/js/modules/`.

## How to run for review
- `npm install`
- `npm run dev` ? open `http://localhost:4173/#/home` (hash routes enabled)
- `npm test` ? lint + Jest (pure/state tests)

## What to look for
- Keyboard and focus behavior unchanged from Upload 1 (skip link, main focus).
- Hash navigation updates content without full page reloads.
- Dataset view still reachable via hash route and reacts to filters/refresh.
