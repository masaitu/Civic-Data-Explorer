const normalize = (value = '') => value.toString().trim().toLowerCase();

export const filterDatasets = (datasets = [], filters = {}) => {
  const search = normalize(filters.searchTerm);
  const category = filters.category ?? 'all';
  return datasets.filter((dataset) => {
    const matchesCategory = category === 'all' || dataset.category === category;
    if (!matchesCategory) return false;

    if (!search) return true;
    const haystack = [
      dataset.title,
      dataset.description,
      dataset.county,
      ...(dataset.tags ?? []),
    ]
      .map(normalize)
      .join(' ');
    return haystack.includes(search);
  });
};

export const summarizeByCategory = (datasets = []) => {
  return datasets.reduce(
    (acc, dataset) => {
      const key = dataset.category ?? 'uncategorized';
      acc.categories[key] = (acc.categories[key] ?? 0) + 1;
      acc.totalWards += dataset.wardsCovered ?? 0;
      if (typeof dataset.amountKES === 'number') {
        acc.totalBudget += dataset.amountKES;
      }
      return acc;
    },
    { categories: {}, totalWards: 0, totalBudget: 0 }
  );
};

export const formatCurrency = (value) => {
  if (!Number.isFinite(value)) return 'n/a';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (value) => {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value));
};

export const debounce = (fn, delay = 250) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const hydrateFilters = (raw) => {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return {
      searchTerm: parsed?.searchTerm ?? '',
      category: parsed?.category ?? 'all',
    };
  } catch (error) {
    console.warn('Unable to hydrate filters, falling back to defaults.', error);
    return { searchTerm: '', category: 'all' };
  }
};
