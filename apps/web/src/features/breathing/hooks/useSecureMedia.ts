import {
  downloadAndCacheMedia,
  getDecryptedBlobUrl,
  MediaType,
} from "@libs/secureMediaCache";
import { useEffect, useState } from "react";

/**
 * React hook to easily fetch and play secure, encrypted offline media.
 *
 * If the media is not in the cache, it will automatically download, encrypt, and cache it,
 * then decrypt and serve it.
 *
 * Automatically handles memory cleanup (URL.revokeObjectURL) when the component unmounts.
 */
export function useSecureMedia(url: string | null, type: MediaType = "audio") {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isActive = true;
    let currentBlobUrl: string | null = null;

    async function loadMedia() {
      if (!url) {
        setBlobUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // 1. Try to get it from the cache
        currentBlobUrl = await getDecryptedBlobUrl(url);

        if (!currentBlobUrl) {
          // 2. If not in cache, download and cache it securely
          // In a real app, you might want to show a download progress bar here if files are large
          await downloadAndCacheMedia(url, type);

          // 3. Retrieve the newly cached and decrypted blob
          currentBlobUrl = await getDecryptedBlobUrl(url, type);
        }

        if (isActive && currentBlobUrl) {
          setBlobUrl(currentBlobUrl);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load secure media"),
          );
          console.error("Error in useSecureMedia:", err);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadMedia();

    // Cleanup function: Revoke the ObjectURL to prevent memory leaks when the component unmounts
    // or when the URL changes.
    return () => {
      isActive = false;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [url]);

  return { blobUrl, isLoading, error };
}
