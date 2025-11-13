import { DatasetStore } from '../public/js/modules/datasetStore.js';

const sampleDatasets = [
  { title: 'Item A', description: 'Alpha', county: 'Nairobi', category: 'budget', wardsCovered: 2 },
  { title: 'Item B', description: 'Beta', county: 'Kisumu', category: 'health', wardsCovered: 4 },
];

const createApiClient = () => jest.fn().mockResolvedValue({
  datasets: sampleDatasets,
  metadata: { lastSynced: '2024-01-01T00:00:00Z', timezone: 'UTC' },
});

const createStorage = () => {
  const state = new Map();
  return {
    getItem: (key) => state.get(key) ?? null,
    setItem: (key, value) => state.set(key, value),
  };
};

describe('DatasetStore', () => {
  it('initializes with API data', async () => {
    const apiClient = createApiClient();
    const store = new DatasetStore({ apiClient, storage: createStorage() });
    await store.init();
    const snapshot = store.snapshot();
    expect(snapshot.datasets).toHaveLength(2);
    expect(snapshot.metadata.timezone).toBe('UTC');
  });

  it('applies filters and persists to storage', async () => {
    const storage = createStorage();
    const store = new DatasetStore({ apiClient: createApiClient(), storage });
    await store.init();
    store.setCategory('health');
    const snapshot = store.snapshot();
    expect(snapshot.filtered).toHaveLength(1);
    expect(storage.getItem('cde-dataset-filters')).toContain('health');
  });

  it('handles API errors gracefully', async () => {
    const apiClient = jest.fn().mockRejectedValue(new Error('network down'));
    const store = new DatasetStore({ apiClient, storage: createStorage() });
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await store.init().catch(() => {});
    expect(store.snapshot().error).toBe('network down');
    spy.mockRestore();
  });
});
