import { DatasetStore } from './modules/datasetStore.js';
import { fetchDatasetBundle } from './modules/apiClient.js';
import { debounce, formatCurrency, formatDate } from './modules/filter-utils.js';
import { saveBookmark } from './modules/storage.js';
import { escapeHtml, cleanInput } from './modules/sanitize.js';

const store = new DatasetStore({ apiClient: fetchDatasetBundle });

const getRefs = (root = document) => ({
  status: root.querySelector('[data-status]'),
  results: root.querySelector('[data-results]'),
  summary: root.querySelector('[data-summary]'),
  form: root.querySelector('[data-filter-form]'),
  search: root.querySelector('#search'),
  category: root.querySelector('#category'),
  refresh: root.querySelector('[data-refresh]'),
  toast: root.querySelector('[data-toast]'),
});

const renderStatus = (refs, { loading, error, filtered, metadata }) => {
  if (!refs.status) return;
  if (loading) {
    refs.status.textContent = 'Loading datasets...';
    return;
  }
  if (error) {
    refs.status.textContent = `⚠️ ${error}`;
    return;
  }
  const count = filtered.length;
  const label = count === 1 ? 'dataset' : 'datasets';
  const offline = metadata?.offline ? ' (offline cache)' : '';
  refs.status.textContent = `${count} ${label} match your filters. Last sync: ${formatDate(
    metadata?.lastSynced
  )}${offline}`;
};

const templateDataset = (dataset) => {
  const badge = dataset.category.charAt(0).toUpperCase() + dataset.category.slice(1);
  const title = escapeHtml(dataset.title);
  const description = escapeHtml(dataset.description);
  const county = escapeHtml(dataset.county);
  const format = escapeHtml(dataset.format);
  const category = escapeHtml(dataset.category);
  const url = escapeHtml(dataset.url);
  return `
    <article class="dataset-card">
      <header>
        <p class="dataset-badge">${badge}</p>
        <h3>${title}</h3>
        <p>${description}</p>
      </header>
      <dl>
        <div>
          <dt>County</dt>
          <dd>${county}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>${formatDate(dataset.updated)}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>${format}</dd>
        </div>
        <div>
          <dt>Wards</dt>
          <dd>${dataset.wardsCovered ?? 'n/a'}</dd>
        </div>
        <div>
          <dt>Budget</dt>
          <dd>${formatCurrency(dataset.amountKES)}</dd>
        </div>
      </dl>
      <footer>
        <button type="button" class="bookmark-btn" data-bookmark="${dataset.id}">Save bookmark</button>
        <a href="${url}" target="_blank" rel="noreferrer">Open source ↗</a>
      </footer>
    </article>
  `;
};

const renderDatasets = (refs, records) => {
  if (!refs.results) return;
  if (!records.length) {
    refs.results.innerHTML =
      '<p class="dataset-empty" role="note">No datasets match your filters yet. Try a broader term.</p>';
    return;
  }
  refs.results.innerHTML = records.map((record) => templateDataset(record)).join('');
};

const renderSummary = (refs, { summary }) => {
  if (!refs.summary) return;
  const categories = Object.entries(summary.categories)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' · ');
  refs.summary.innerHTML = `
    <p><strong>Total wards represented:</strong> ${summary.totalWards}</p>
    <p><strong>Total budget captured:</strong> ${formatCurrency(summary.totalBudget)}</p>
    <p><strong>Category spread:</strong> ${categories || 'n/a'}</p>
  `;
};

const wireEvents = (refs) => {
  if (!refs.form) return;
  const debouncedSearch = debounce((value) => store.setSearchTerm(value), 250);
  refs.search?.addEventListener('input', (event) => {
    const value = cleanInput(event.target.value, { max: 80 });
    event.target.value = value;
    debouncedSearch(value);
  });
  refs.category?.addEventListener('change', (event) => store.setCategory(event.target.value));
  refs.refresh?.addEventListener('click', () => store.refresh());
};

const handleBookmarkClick = async (event, records, refs) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const id = target.dataset.bookmark;
  if (!id) return;
  const record = records.find((item) => item.id === id);
  if (!record) return;
  await saveBookmark({ id: record.id, title: record.title, category: record.category, url: record.url });
  if (refs.toast) {
    refs.toast.textContent = `Saved "${record.title}"`;
    refs.toast.hidden = false;
    setTimeout(() => {
      refs.toast.hidden = true;
    }, 2000);
  }
};

export const mountDataView = (root = document) => {
  const refs = getRefs(root);
  store.subscribe((snapshot) => {
    renderStatus(refs, snapshot);
    renderDatasets(refs, snapshot.filtered);
    renderSummary(refs, snapshot);
    refs.results?.querySelectorAll('.bookmark-btn').forEach((btn) =>
      btn.addEventListener('click', (event) => handleBookmarkClick(event, snapshot.filtered, refs))
    );
  });
  wireEvents(refs);
  store.init();
};

if (document.querySelector('[data-results]')) {
  mountDataView(document);
}
