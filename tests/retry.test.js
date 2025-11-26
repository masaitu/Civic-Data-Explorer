import { fetchWithRetry } from '../public/js/modules/retry.js';

describe('fetchWithRetry', () => {
  afterEach(() => {
    global.fetch = undefined;
  });

  it('retries once and succeeds', async () => {
    const responses = [
      Promise.reject(new Error('fail')),
      Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) }),
    ];
    global.fetch = jest.fn(() => responses.shift());

    const res = await fetchWithRetry('http://example.com', { attempts: 2 });
    expect(res.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting attempts', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('nope')));
    await expect(fetchWithRetry('http://example.com', { attempts: 2 })).rejects.toThrow('nope');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
