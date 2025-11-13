# DevTools profiling note

- Chrome DevTools (Performance tab, HeadlessChrome via Lighthouse) shows max scripting time ~22 ms during initial layout. No long tasks identified for Upload 1 static routes.
- Layout shift is minimal because content heights are fixed via CSS grid/flex. Future async fetches will preserve skeleton containers to avoid layout jank.
