import { filterDatasets, summarizeByCategory, hydrateFilters } from './filter-utils.js';

const STORAGE_KEY = 'cde-dataset-filters';

const getStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (error) {
    console.warn('Secure context prevents localStorage usage.', error);
  }
  const fallback = new Map();
  return {
    getItem: (key) => fallback.get(key) ?? null,
    setItem: (key, value) => fallback.set(key, value),
  };
};

export class DatasetStore {
  constructor({ apiClient, storage = getStorage() } = {}) {
    this.apiClient = apiClient;
    this.storage = storage;
    this.listeners = new Set();
    this.state = {
      datasets: [],
      metadata: { lastSynced: null, timezone: 'Africa/Nairobi' },
      filters: hydrateFilters(this.storage.getItem(STORAGE_KEY)),
      loading: false,
      error: null,
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  snapshot() {
    const filtered = filterDatasets(this.state.datasets, this.state.filters);
    const summary = summarizeByCategory(filtered);
    return {
      ...this.state,
      filtered,
      summary,
    };
  }

  notify() {
    const snap = this.snapshot();
    this.listeners.forEach((listener) => listener(snap));
  }

  persistFilters() {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.state.filters));
    } catch (error) {
      console.warn('Unable to persist filters.', error);
    }
  }

  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.notify();
  }

  setSearchTerm(value) {
    this.state.filters = { ...this.state.filters, searchTerm: value };
    this.persistFilters();
    this.notify();
  }

  setCategory(value) {
    this.state.filters = { ...this.state.filters, category: value };
    this.persistFilters();
    this.notify();
  }

  async refresh() {
    return this.init({ force: true });
  }

  async init({ force = false } = {}) {
    if (!this.apiClient) {
      throw new Error('DatasetStore requires an apiClient.');
    }

    if (this.state.datasets.length && !force) {
      this.notify();
      return;
    }

    this.setState({ loading: true, error: null });
    try {
      const payload = await this.apiClient();
      this.setState({
        datasets: payload.datasets,
        metadata: payload.metadata ?? this.state.metadata,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('DatasetStore init failed', error);
      this.setState({ loading: false, error: error.message ?? 'Unable to load datasets.' });
    }
  }
}
