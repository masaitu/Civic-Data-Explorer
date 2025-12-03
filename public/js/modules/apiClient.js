import { fetchWithRetry } from './retry.js';

// Use relative path so it works on GitHub Pages (no leading slash).
const DATA_ENDPOINT = 'data/datasets.json';
const TIME_ENDPOINT = 'https://worldtimeapi.org/api/timezone/Africa/Nairobi';

export const fetchJson = async (url, options = {}) => {
  const response = await fetchWithRetry(url, {
    headers: { Accept: 'application/json' },
    ...options,
  });
  return response.json();
};

export const fetchDatasetBundle = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const [datasets, clock] = await Promise.all([
      fetchJson(DATA_ENDPOINT, { signal: controller.signal, attempts: 2 }),
      fetchJson(TIME_ENDPOINT, { signal: controller.signal, attempts: 2 }),
    ]);

    return {
      datasets,
      metadata: {
        lastSynced: clock.datetime,
        timezone: clock.timezone,
        offline: false,
      },
    };
  } catch (error) {
    console.warn('Primary fetch failed, falling back to cached-only data.', error);
    try {
      const datasets = await fetchJson(DATA_ENDPOINT, { attempts: 2 });
      return {
        datasets,
        metadata: {
          lastSynced: new Date().toISOString(),
          timezone: 'Africa/Nairobi',
          offline: true,
        },
      };
    } catch (fallbackError) {
      throw new Error(`Unable to load data: ${fallbackError.message}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
};
