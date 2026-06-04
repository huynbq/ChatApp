export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as
  | string
  | undefined;

export const SUPABASE_PUBLISHABLE_KEY = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required",
  );
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is required");
}

export const API_BASE_URL = apiBaseUrl;
