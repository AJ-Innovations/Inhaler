/**
 * AES-256-GCM Encryption/Decryption Utility
 *
 * Uses the native Web Crypto API for hardware-accelerated,
 * FIPS-compliant encryption. Zero external dependencies.
 *
 * The encryption key is derived via PBKDF2 from a device-bound
 * passphrase (Supabase project URL + app salt), making it unique
 * per deployment but consistent across page reloads.
 */

const APP_SALT = "spirox-secure-storage-v1";
const PBKDF2_ITERATIONS = 100_000;

/**
 * Generates a consistent passphrase from environment constants.
 * This ensures the same key is derived on every page load for the
 * same deployment, but different across Supabase projects.
 */
function getPassphrase(): string {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "spirox-default-deployment";
  return `${APP_SALT}::${supabaseUrl}`;
}

/**
 * Derives a 256-bit AES-GCM key from a passphrase using PBKDF2.
 * The salt is deterministic (derived from the passphrase itself)
 * so the same key is produced on every call.
 */
async function deriveKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphrase = getPassphrase();

  // Import the passphrase as raw key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  // Derive a deterministic salt from the passphrase
  const saltData = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(passphrase + "::salt"),
  );

  // Derive the actual AES-256-GCM key
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(saltData),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// Cache the derived key in memory to avoid re-deriving on every call
let cachedKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = await deriveKey();
  }
  return cachedKey;
}

/**
 * Encrypts a plaintext string with AES-256-GCM.
 * Returns a base64-encoded string containing the IV + ciphertext.
 *
 * Format: base64(12-byte IV || ciphertext || 16-byte auth tag)
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getKey();
  const encoder = new TextEncoder();

  // Generate a random 12-byte IV for each encryption
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext),
  );

  // Concatenate IV + ciphertext into a single buffer
  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.length);

  // Encode as base64 for safe localStorage storage
  return btoa(
    Array.from(combined, (byte) => String.fromCharCode(byte)).join(""),
  );
}

/**
 * Decrypts an AES-256-GCM ciphertext (base64-encoded IV + ciphertext).
 * Returns the original plaintext string, or null if decryption fails
 * (tampered data, wrong key, corrupted).
 */
export async function decrypt(ciphertext: string): Promise<string | null> {
  try {
    const key = await getKey();

    // Decode base64 back to bytes
    const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

    // Extract IV (first 12 bytes) and encrypted data (rest)
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch {
    // Decryption failed: tampered data, wrong key, or corrupted
    return null;
  }
}

/**
 * Encrypts an ArrayBuffer with AES-256-GCM.
 * Used for encrypting binary media (audio/images).
 * Returns an ArrayBuffer containing (12-byte IV + ciphertext + 16-byte tag).
 */
export async function encryptBuffer(data: ArrayBuffer): Promise<ArrayBuffer> {
  const key = await getKey();

  // Generate a random 12-byte IV for each encryption
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  );

  // Concatenate IV + ciphertext into a single buffer
  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.length);

  return combined.buffer;
}

/**
 * Decrypts an AES-256-GCM encrypted ArrayBuffer.
 * Returns the original ArrayBuffer, or null if decryption fails.
 */
export async function decryptBuffer(
  encryptedData: ArrayBuffer,
): Promise<ArrayBuffer | null> {
  try {
    const key = await getKey();

    const combined = new Uint8Array(encryptedData);

    // Extract IV (first 12 bytes) and encrypted data (rest)
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );

    return decryptedBuffer;
  } catch {
    // Decryption failed: tampered data, wrong key, or corrupted
    return null;
  }
}
