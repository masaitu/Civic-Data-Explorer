import { DatasetStore } from './modules/datasetStore.js';
import { fetchDatasetBundle } from './modules/apiClient.js';
import { debounce, formatCurrency, formatDate } from './modules/filter-utils.js';

const store = new DatasetStore({ apiClient: fetchDatasetBundle });

const refs = {
  status: document.querySelector('[data-status]'),
  results: document.querySelector('[data-results]'),
  summary: document.querySelector('[data-summary]'),
  form: document.querySelector('[data-filter-form]'),
  search: document.querySelector('#search'),
  category: document.querySelector('#category'),
  refresh: document.querySelector('[data-refresh]'),
};

const renderStatus = ({ loading, error, filtered, metadata }) => {
  if (!refs.status) return;
  if (loading) {
    refs.status.textContent = 'Loading datasets…';
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
  return `
    <article class="dataset-card">
      <header>
        <p class="dataset-badge">${badge}</p>
        <h3>${dataset.title}</h3>
        <p>${dataset.description}</p>
      </header>
      <dl>
        <div>
          <dt>County</dt>
          <dd>${dataset.county}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>${formatDate(dataset.updated)}</dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>${dataset.format}</dd>
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
        <a href="${dataset.url}" target="_blank" rel="noreferrer">Open source ↗</a>
      </footer>
    </article>
  `;
};

const renderDatasets = (records) => {
  if (!refs.results) return;
  if (!records.length) {
    refs.results.innerHTML =
      '<p class="dataset-empty" role="note">No datasets match your filters yet. Try a broader term.</p>';
    return;
  }
  refs.results.innerHTML = records.map((record) => templateDataset(record)).join('');
};

const renderSummary = ({ summary }) => {
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

const wireEvents = () => {
  if (!refs.form) return;
  const debouncedSearch = debounce((value) => store.setSearchTerm(value), 250);
  refs.search?.addEventListener('input', (event) => debouncedSearch(event.target.value));
  refs.category?.addEventListener('change', (event) => store.setCategory(event.target.value));
  refs.refresh?.addEventListener('click', () => store.refresh());
};

store.subscribe((snapshot) => {
  renderStatus(snapshot);
  renderDatasets(snapshot.filtered);
  renderSummary(snapshot);
});

wireEvents();
store.init();
