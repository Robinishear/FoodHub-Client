/** Base URL for API calls (includes `/api` path prefix). Matches `src/lib/axios.ts`. */
export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://foodhub-backend-api.vercel.app/api";
  return raw.replace(/\/$/, "");
}

export function getGoogleAuthUrl(search?: Record<string, string>): string {
  const url = new URL(`${getApiBaseUrl()}/auth/google`);
  if (search) {
    for (const [k, v] of Object.entries(search)) {
      url.searchParams.set(k, v);
    }
  }
  return url.toString();
}
