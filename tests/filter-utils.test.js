import {
  filterDatasets,
  summarizeByCategory,
  formatCurrency,
  hydrateFilters,
} from '../public/js/modules/filter-utils.js';

const fixtures = [
  { title: 'Health', description: 'Clinics', county: 'Nairobi', category: 'health', wardsCovered: 5 },
  { title: 'Budget', description: 'roads', county: 'Mombasa', category: 'budget', wardsCovered: 10 },
];

describe('filterDatasets', () => {
  it('filters by category', () => {
    const results = filterDatasets(fixtures, { category: 'health', searchTerm: '' });
    expect(results).toHaveLength(1);
    expect(results[0].category).toBe('health');
  });

  it('searches across multiple fields', () => {
    const results = filterDatasets(fixtures, { category: 'all', searchTerm: 'mombasa' });
    expect(results).toHaveLength(1);
    expect(results[0].county).toBe('Mombasa');
  });
});

describe('summaries', () => {
  it('aggregates ward coverage and categories', () => {
    const summary = summarizeByCategory(fixtures);
    expect(summary.categories.health).toBe(1);
    expect(summary.totalWards).toBe(15);
  });
});

describe('formatters', () => {
  it('formats Kenyan currency', () => {
    expect(formatCurrency(1000)).toMatch(/Ksh|KES/);
  });

  it('hydrates filters safely', () => {
    const filters = hydrateFilters('{ "searchTerm": "roads" }');
    expect(filters.searchTerm).toBe('roads');
    expect(filters.category).toBe('all');
  });
});
