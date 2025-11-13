const DATA_ENDPOINT = '/data/datasets.json';
const TIME_ENDPOINT = 'https://worldtimeapi.org/api/timezone/Africa/Nairobi';

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export const fetchDatasetBundle = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const [datasets, clock] = await Promise.all([
      fetchJson(DATA_ENDPOINT, { signal: controller.signal }),
      fetchJson(TIME_ENDPOINT, { signal: controller.signal }),
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
    const datasets = await fetchJson(DATA_ENDPOINT);
    return {
      datasets,
      metadata: {
        lastSynced: new Date().toISOString(),
        timezone: 'Africa/Nairobi',
        offline: true,
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
};
