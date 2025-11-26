const DB_NAME = 'cde-cache';
const DB_VERSION = 1;
const STORE_NAME = 'bookmarks';

const isIndexedDBAvailable = () => {
  try {
    return typeof indexedDB !== 'undefined';
  } catch (error) {
    console.warn('indexedDB unavailable', error);
    return false;
  }
};

const openDatabase = () =>
  new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withStore = async (mode, operation) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = operation(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const fallbackLocal = {
  getAll: () => {
    try {
      const raw = localStorage.getItem(STORE_NAME);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn('Local fallback read failed', error);
      return [];
    }
  },
  setAll: (items) => {
    try {
      localStorage.setItem(STORE_NAME, JSON.stringify(items));
    } catch (error) {
      console.warn('Local fallback write failed', error);
    }
  },
};

export const listBookmarks = async () => {
  try {
    const results = await withStore('readonly', (store) => store.getAll());
    return results || [];
  } catch (error) {
    return fallbackLocal.getAll();
  }
};

export const saveBookmark = async (item) => {
  try {
    await withStore('readwrite', (store) => store.put(item));
  } catch (error) {
    const all = fallbackLocal.getAll();
    const next = all.filter((entry) => entry.id !== item.id).concat(item);
    fallbackLocal.setAll(next);
  }
};

export const removeBookmark = async (id) => {
  try {
    await withStore('readwrite', (store) => store.delete(id));
  } catch (error) {
    const all = fallbackLocal.getAll().filter((entry) => entry.id !== id);
    fallbackLocal.setAll(all);
  }
};
