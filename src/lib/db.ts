// src/lib/db.ts
// A lightweight wrapper for IndexedDB to handle offline-first data management.

const DB_NAME = 'RepLogDB';
const DB_VERSION = 1;

export const STORES = {
  EXERCISES: 'exercises',
  SESSIONS: 'sessions',
  STATS: 'stats',
  SYNC_QUEUE: 'sync_queue',
};

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORES.EXERCISES)) {
        db.createObjectStore(STORES.EXERCISES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
        db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.STATS)) {
        db.createObjectStore(STORES.STATS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putData(storeName: string, data: any) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getData(storeName: string, key: string) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllData(storeName: string) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteData(storeName: string, key: string) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName: string) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
