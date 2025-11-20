# Civic Data Explorer - Upload 1

search, filter, and visualize Kenya public datasets (budget lines, wards, health facilities) through an accessibility-first prototype.

Civic Data Explorer is a browser-based learning project that demonstrates government data exploration patterns while prioritizing accessibility, responsive layouts, and evidence gathering. Upload 1 focuses on semantic scaffolding, baseline tooling, and the documentation artifacts requested for Week 9.



## Accessibility checklist (Upload 1)

- Semantic landmarks on `index.html`, `views/data.html`, and `views/form.html` with single `<h1>` per page.
- Skip link reveals on focus and moves keyboard focus to `<main>` (tabindex = -1).
- Keyboard reachability through nav, form controls, disclosure-style menu, and buttons.
- Visible focus states with >= 3:1 contrast (see `evidence/contrast-tokens.png` and `evidence/contrast-notes.md`).
- Color tokens validated at WCAG AA or better and documented in the evidence pack.
- Lighthouse Accessibility score: **100** (report + score screenshot located in `evidence/` along with not-applicable notes).
- No redundant ARIA; only `aria-current` is used for navigation context.
- Responsive grid/flex layout adapts at ~480 px / 768 px / 1024 px without horizontal scroll.
- No color-only indicators; text labels accompany states and controls.


## Wireframes (`/wireframes`)

- `home.png` - landing layout with labeled landmarks and tab order.
- `data.png` - dataset browser view showing filters, cards, and aside tips.
- `form.png` - form-first route with helper text and focus order callouts.



## Next steps toward Upload 2

1. Wire async fetch modules to authenticated Kenya Open Data endpoints with resilient retry/debounce flows.
2. Expand client-side store (classes/modules) to manage filters, bookmarks, and cached API payloads (Web Storage hydration).
3. Extend Jest coverage for parsing, sanitization, and future IndexedDB adapters while capturing DevTools performance traces.
4. Add performance budgets (code splitting via dynamic imports) and document DevTools profiling snapshots.



# Upload 2 � Modules & State



## What changed for Upload 2
- Hash-based routing shell in `public/index.html` with swapped fragments (`public/fragments/home.html`, `data.html`, `form.html`).
- Navigation links use hashes (`#/home`, `#/datasets`, `#/feedback`) and set `aria-current` dynamically.
- Global app state via `AppStore` (route + notice), and a router-driven fragment loader.
- Dataset view mounts through the router but keeps debounce filters, category select, refresh, and live summaries.

## Key modules
- `public/js/modules/router.js` � HashRouter watches URL changes and triggers view loads.
- `public/js/modules/viewLoader.js` � Fetches HTML snippets and swaps main/aside content, then lets each view run its setup.
- `public/js/modules/appStore.js` � Lightweight pub/sub for current route and notice text.
- `public/js/modules/datasetStore.js` � Manages datasets, filters, storage, and summaries.
- `public/js/modules/apiClient.js` � Loads mock data plus Nairobi time with fallback.
- `public/js/modules/filter-utils.js` � Pure helpers: filter, summarize, format, debounce, hydrate.
- `public/js/app.js` � Wires router, fragments, notice updates, and mounts the dataset view when needed.

## Evidence
- Module import write-up: `docs/module-graph.md`.
- Tests for pure/state logic: `tests/filter-utils.test.js`, `tests/datasetStore.test.js`; run `npm test` (includes lint).
- Source tree shows modular layout: routes in `public/fragments/`, modules in `public/js/modules/`.



## What to look for
- Keyboard and focus behavior unchanged from Upload 1 (skip link, main focus).
- Hash navigation updates content without full page reloads.
- Dataset view still reachable via hash route and reacts to filters/refresh.
