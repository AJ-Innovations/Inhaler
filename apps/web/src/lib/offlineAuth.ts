/**
 * Offline Premium Verification Engine
 *
 * Implements the algorithm from offline_auth_algorithm.md:
 * 1. Check if offline token exists
 * 2. Verify RSA signature on the token
 * 3. Check monotonic time (anti-time-travel)
 * 4. Check subscription expiry date
 * 5. Update last_verified_time
 *
 * Uses the native Web Crypto API for RSA-PSS signature verification.
 */

import { SecureStorage } from "./secureStorage";

// Storage keys for encrypted offline auth data
const OFFLINE_TOKEN_KEY = "spirox_offline_token";
const LAST_VERIFIED_TIME_KEY = "spirox_last_verified_time";

/**
 * The RSA Public Key (SPKI format, base64-encoded) used to verify
 * offline tokens signed by the backend server.
 *
 * In production, the corresponding Private Key lives ONLY on the
 * backend server (Supabase Edge Function). The frontend can verify
 * signatures but NEVER create them.
 *
 * NOTE: Replace this with your actual production public key when
 * Supabase Edge Functions are deployed.
 */
const RSA_PUBLIC_KEY_B64 =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Z3VS5JJcds3xfn/ygWe" +
  "HKtMzHMPxEONenGLWBZLy0zGMU9vLf6AKVg9GJ8QzBT0yNflKFyR6v7GnDYNoVoE" +
  "qR3TVPzjzKKSJ3IU9irOxo/oY5Lbux0OQTNSM3q1PsGJ+B8ZKOzGkBcGKdLdArEE" +
  "kcSN4VpZFQ45Y6M3haOQhB3P0+igkw7O3AZ2d8C3xF6v5qO/QFqfM/qXTY2yLhsF" +
  "VkiB5mO7KJb/FJdKoGf97VQo6FQhbVYrHoYL/NZwH3B3PWB6LclK3fB2oA0PkAHEY" +
  "MJb+mJbxHkGdzIxfGIc/xBftg7CNbWMPi/BEwLJQ+sXqSrgIMjhEoU6dBOZ3dwIDA" +
  "QAB";

/** Structure of the offline token payload */
export interface OfflineTokenPayload {
  userId: string;
  expiryDate: string; // ISO 8601 date string (e.g., "2025-12-01T00:00:00Z")
  issuedAt: string; // ISO 8601 date string
  plan: "pro" | "premium";
}

/** Structure of a signed offline token */
export interface SignedOfflineToken {
  payload: string; // JSON-encoded OfflineTokenPayload
  signature: string; // Base64-encoded RSA-PSS signature
}

export type PremiumStatus = "free" | "pro" | "premium";

/**
 * Imports the RSA public key for signature verification.
 */
async function importPublicKey(): Promise<CryptoKey> {
  const binaryKey = Uint8Array.from(atob(RSA_PUBLIC_KEY_B64), (c) =>
    c.charCodeAt(0),
  );

  return crypto.subtle.importKey(
    "spki",
    binaryKey.buffer,
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    false,
    ["verify"],
  );
}

/**
 * Verifies the RSA-PSS signature on an offline token.
 * Returns true if the signature is valid (token hasn't been tampered with).
 */
async function verifySignature(token: SignedOfflineToken): Promise<boolean> {
  try {
    const publicKey = await importPublicKey();
    const encoder = new TextEncoder();

    const signatureBytes = Uint8Array.from(atob(token.signature), (c) =>
      c.charCodeAt(0),
    );

    return crypto.subtle.verify(
      { name: "RSA-PSS", saltLength: 32 },
      publicKey,
      signatureBytes,
      encoder.encode(token.payload),
    );
  } catch {
    return false;
  }
}

/**
 * Main offline premium verification function.
 * Implements the full flowchart from offline_auth_algorithm.md.
 *
 * Returns "free", "pro", or "premium" based on the verification result.
 */
export async function verifyOfflinePremium(): Promise<PremiumStatus> {
  try {
    // Step 1: Check if offline token exists
    const tokenRaw = await SecureStorage.getItem(OFFLINE_TOKEN_KEY);
    if (!tokenRaw) {
      return "free";
    }

    let token: SignedOfflineToken;
    try {
      token = JSON.parse(tokenRaw);
    } catch {
      // Corrupted token data
      await SecureStorage.setItem(OFFLINE_TOKEN_KEY, "");
      SecureStorage.removeItem(OFFLINE_TOKEN_KEY);
      return "free";
    }

    // Step 2: Verify RSA signature
    const isSignatureValid = await verifySignature(token);
    if (!isSignatureValid) {
      return "free";
    }

    // Parse the verified payload
    let payload: OfflineTokenPayload;
    try {
      payload = JSON.parse(token.payload);
    } catch {
      return "free";
    }

    // Step 3: Monotonic time check (anti-time-travel)
    const now = Date.now();
    const lastVerifiedRaw = await SecureStorage.getItem(LAST_VERIFIED_TIME_KEY);
    const lastVerified = lastVerifiedRaw ? parseInt(lastVerifiedRaw, 10) : 0;

    if (now < lastVerified) {
      // Time has gone backwards! Clock tampering detected.
      console.warn(
        "[OfflineAuth] Time tampering detected! Device clock went backwards.",
      );
      return "free";
    }

    // Step 4: Check if subscription has expired
    const expiryTimestamp = new Date(payload.expiryDate).getTime();
    if (now >= expiryTimestamp) {
      // Subscription expired
      return "free";
    }

    // Step 5: All checks passed — update last_verified_time and grant premium
    await SecureStorage.setItem(LAST_VERIFIED_TIME_KEY, now.toString());

    return payload.plan;
  } catch (err) {
    console.error("[OfflineAuth] Verification error:", err);
    return "free";
  }
}

/**
 * Stores a server-signed offline token into encrypted storage.
 * Called when the user is online and we receive a fresh token
 * from the backend.
 */
export async function storeOfflineToken(
  signedToken: SignedOfflineToken,
): Promise<void> {
  await SecureStorage.setItem(OFFLINE_TOKEN_KEY, JSON.stringify(signedToken));
  // Record the current time as the baseline for monotonic checks
  await SecureStorage.setItem(LAST_VERIFIED_TIME_KEY, Date.now().toString());
}

/**
 * Clears the offline token and time tracker.
 * Called on logout or account deletion.
 */
export function clearOfflineToken(): void {
  SecureStorage.removeItem(OFFLINE_TOKEN_KEY);
  SecureStorage.removeItem(LAST_VERIFIED_TIME_KEY);
}

/**
 * Creates a simulated offline token for development/testing.
 * In production, this would be replaced by a call to the backend
 * Supabase Edge Function that signs the token with the real private key.
 *
 * NOTE: This function is ONLY for development. Tokens created here
 * will NOT pass RSA signature verification (since we don't have the
 * private key on the frontend). The app will correctly fall back to
 * "free" status, which is the expected secure behavior.
 */
export function createDevOfflineToken(
  userId: string,
  plan: "pro" | "premium",
  expiryDays: number = 30,
): SignedOfflineToken {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  const payload: OfflineTokenPayload = {
    userId,
    expiryDate: expiryDate.toISOString(),
    issuedAt: new Date().toISOString(),
    plan,
  };

  return {
    payload: JSON.stringify(payload),
    // Fake signature — will NOT pass verification (this is intentional)
    signature: btoa("dev-unsigned-token"),
  };
}
