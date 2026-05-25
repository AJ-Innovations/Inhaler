/**
 * Secure Media Cache — IndexedDB wrapper for AES-256-GCM encrypted media
 *
 * This module stores binary media securely offline, separated by file type.
 * Data is fetched, encrypted instantly, and saved as ArrayBuffers in IndexedDB.
 */

import { decryptBuffer, encryptBuffer } from "./crypto";

const DB_NAME = "SpiroxMediaDB";
const DB_VERSION = 2; // Incremented for schema split

export type MediaType = "audio" | "image" | "video";

function getStoreName(type: MediaType): string {
  return `secure_${type}`;
}

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

      // Cleanup legacy v1 store if it exists
      if (db.objectStoreNames.contains("secure_media")) {
        db.deleteObjectStore("secure_media");
      }

      // Create distinct object stores per media type
      const stores: MediaType[] = ["audio", "image", "video"];
      stores.forEach((type) => {
        const storeName = getStoreName(type);
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "url" });
        }
      });
    };
  });

  return dbPromise;
}

/**
 * Downloads a media file, encrypts it, and caches it in the designated IndexedDB store
 */
export async function downloadAndCacheMedia(
  url: string,
  type: MediaType = "audio",
): Promise<void> {
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
    const storeName = getStoreName(type);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.put({
        url,
        data: encryptedBuffer,
        contentType,
        timestamp: Date.now(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new Error(`Failed to store encrypted ${type}`));
    });
  } catch (error) {
    console.error(`Error caching ${type} from ${url}:`, error);
    throw error;
  }
}

/**
 * Retrieves a media file from the cache, decrypts it, and returns a temporary blob:// URL.
 * You MUST call URL.revokeObjectURL() on the returned URL when you are done with it.
 */
export async function getDecryptedBlobUrl(
  url: string,
  type: MediaType = "audio",
): Promise<string | null> {
  try {
    const db = await getDB();
    const storeName = getStoreName(type);

    // 1. Retrieve the encrypted object from IndexedDB
    const record = await new Promise<any>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(url);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to retrieve ${type}`));
    });

    if (!record) return null; // Not in cache

    // 2. Decrypt the binary data
    const decryptedBuffer = await decryptBuffer(record.data);
    if (!decryptedBuffer) {
      console.warn(
        `Decryption failed for cached ${type}: ${url}. Removing from cache.`,
      );
      await clearMediaFromCache(url, type);
      return null;
    }

    // 3. Create a Blob and Object URL
    const blob = new Blob([decryptedBuffer], { type: record.contentType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(`Error retrieving cached ${type} for ${url}:`, error);
    return null;
  }
}

/**
 * Removes a specific media file from its designated cache store
 */
export async function clearMediaFromCache(
  url: string,
  type: MediaType = "audio",
): Promise<void> {
  try {
    const db = await getDB();
    const storeName = getStoreName(type);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(url);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete ${type}`));
    });
  } catch (error) {
    console.error(`Error clearing ${type} cache for ${url}:`, error);
  }
}

/**
 * Clears the entire secure media cache across all file types
 */
export async function clearAllMediaCache(): Promise<void> {
  try {
    const db = await getDB();
    const stores: MediaType[] = ["audio", "image", "video"];

    const clearPromises = stores.map((type) => {
      const storeName = getStoreName(type);
      return new Promise<void>((resolve, reject) => {
        // Check if store exists in case of partial initialization
        if (!db.objectStoreNames.contains(storeName)) {
          resolve();
          return;
        }

        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(new Error(`Failed to clear ${storeName}`));
      });
    });

    await Promise.all(clearPromises);
  } catch (error) {
    console.error("Error clearing all media cache:", error);
  }
}
