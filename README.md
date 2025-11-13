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
