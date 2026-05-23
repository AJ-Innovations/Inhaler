import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    "Supabase URL or Anon Key is missing from your environment variables (.env.local). Using fallback values for build evaluation.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: "supabase.auth.token",
    storage: {
      getItem: (key: string) => {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(
          new RegExp("(^| )" + key + "=([^;]+)"),
        );
        return match ? decodeURIComponent(match[2]) : null;
      },
      setItem: (key: string, value: string) => {
        if (typeof document === "undefined") return;
        // Secure flag enforces HTTPS only
        document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; Secure; SameSite=Lax`;
      },
      removeItem: (key: string) => {
        if (typeof document === "undefined") return;
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax`;
      },
    },
  },
});
