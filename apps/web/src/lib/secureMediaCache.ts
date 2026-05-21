/**
 * Secure Media Cache — IndexedDB wrapper for AES-256-GCM encrypted media
 *
 * This module stores binary media (audio/images) securely offline.
 * Data is fetched, encrypted instantly, and saved as ArrayBuffers in IndexedDB.
 */

import { encryptBuffer, decryptBuffer } from "./crypto";

const DB_NAME = "SpiroxMediaDB";
const STORE_NAME = "secure_media";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initialize IndexedDB
 */
function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create an object store with 'url' as the key
        db.createObjectStore(STORE_NAME, { keyPath: "url" });
      }
    };
  });

  return dbPromise;
}

/**
 * Downloads a media file, encrypts it, and caches it in IndexedDB
 */
export async function downloadAndCacheMedia(url: string): Promise<void> {
  try {
    // 1. Fetch the binary data
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch media: ${response.status}`);

    // We need the raw ArrayBuffer, and also the MIME type so we know how to recreate the Blob later
    const buffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // 2. Encrypt the binary data
    const encryptedBuffer = await encryptBuffer(buffer);

    // 3. Store in IndexedDB
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const request = store.put({
        url,
        data: encryptedBuffer,
        contentType,
        timestamp: Date.now(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new Error("Failed to store encrypted media"));
    });
  } catch (error) {
    console.error(`Error caching media from ${url}:`, error);
    throw error;
  }
}

/**
 * Retrieves a media file from the cache, decrypts it, and returns a temporary blob:// URL.
 * You MUST call URL.revokeObjectURL() on the returned URL when you are done with it to prevent memory leaks.
 * Returns null if the file is not in the cache or decryption fails.
 */
export async function getDecryptedBlobUrl(url: string): Promise<string | null> {
  try {
    const db = await getDB();

    // 1. Retrieve the encrypted object from IndexedDB
    const record = await new Promise<any>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("Failed to retrieve media"));
    });

    if (!record) return null; // Not in cache

    // 2. Decrypt the binary data
    const decryptedBuffer = await decryptBuffer(record.data);
    if (!decryptedBuffer) {
      console.warn(
        `Decryption failed for cached media: ${url}. Removing from cache.`,
      );
      // If decryption fails (tampered or key changed), remove it from cache
      await clearMediaFromCache(url);
      return null;
    }

    // 3. Create a Blob and Object URL
    const blob = new Blob([decryptedBuffer], { type: record.contentType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(`Error retrieving cached media for ${url}:`, error);
    return null;
  }
}

/**
 * Removes a specific media file from the cache
 */
export async function clearMediaFromCache(url: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(url);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to delete media"));
    });
  } catch (error) {
    console.error(`Error clearing media cache for ${url}:`, error);
  }
}

/**
 * Clears the entire secure media cache
 */
export async function clearAllMediaCache(): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to clear all media"));
    });
  } catch (error) {
    console.error("Error clearing all media cache:", error);
  }
}
