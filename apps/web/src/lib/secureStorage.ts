/**
 * SecureStorage — Encrypted localStorage Wrapper
 *
 * Drop-in replacement for localStorage.getItem/setItem that
 * transparently encrypts all values with AES-256-GCM before
 * writing to disk, and decrypts on read.
 *
 * If decryption fails (tampered data), the key is removed and
 * null is returned, triggering a graceful fallback in the app.
 */

import { decrypt, encrypt } from "./crypto";

const ENCRYPTED_PREFIX = "enc::";

/**
 * Check if we are in a browser environment with crypto support.
 */
function isCryptoAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof crypto !== "undefined" &&
    typeof crypto.subtle !== "undefined"
  );
}

export const SecureStorage = {
  /**
   * Encrypts and stores a value in localStorage.
   * Falls back to plain storage if Web Crypto is unavailable (SSR).
   */
  async setItem(key: string, value: string): Promise<void> {
    if (!isCryptoAvailable()) {
      localStorage.setItem(key, value);
      return;
    }

    try {
      const encrypted = await encrypt(value);
      localStorage.setItem(key, ENCRYPTED_PREFIX + encrypted);
    } catch (err) {
      console.warn(`[SecureStorage] Encryption failed for key "${key}":`, err);
      // Fallback to plain storage to avoid data loss
      localStorage.setItem(key, value);
    }
  },

  /**
   * Reads and decrypts a value from localStorage.
   * Returns null if:
   * - The key doesn't exist
   * - The data has been tampered with (decryption fails)
   * - The data is corrupted
   */
  async getItem(key: string): Promise<string | null> {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;

    // If the value isn't encrypted (legacy/migration), return as-is
    if (!raw.startsWith(ENCRYPTED_PREFIX)) {
      return raw;
    }

    if (!isCryptoAvailable()) {
      // Can't decrypt in SSR; return null to be safe
      return null;
    }

    try {
      const ciphertext = raw.slice(ENCRYPTED_PREFIX.length);
      const decrypted = await decrypt(ciphertext);

      if (decrypted === null) {
        // Tampered data detected — remove the corrupted entry
        console.warn(
          `[SecureStorage] Tampered data detected for key "${key}". Removing.`,
        );
        localStorage.removeItem(key);
        return null;
      }

      return decrypted;
    } catch (err) {
      console.warn(`[SecureStorage] Decryption failed for key "${key}":`, err);
      localStorage.removeItem(key);
      return null;
    }
  },

  /**
   * Removes a key from localStorage.
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Clears all localStorage entries.
   */
  clear(): void {
    localStorage.clear();
  },

  /**
   * Migrates an existing plain-text localStorage value to encrypted storage.
   * Reads the current value, re-encrypts it, and writes it back.
   * No-op if the value is already encrypted or doesn't exist.
   */
  async migrateKey(key: string): Promise<void> {
    const raw = localStorage.getItem(key);
    if (raw === null || raw.startsWith(ENCRYPTED_PREFIX)) return;

    // The value is in plain text — encrypt it
    await this.setItem(key, raw);
  },

  /**
   * Migrates multiple keys from plain-text to encrypted storage.
   * Safe to call multiple times (idempotent).
   */
  async migrateAll(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.migrateKey(key)));
  },
};
