import type { FetchOptions } from "ofetch";
import { isTokenValid } from "~/utils/functions/common";

export default async function useApi(request: string, options?: FetchOptions) {
  const { $apiFetch } = useNuxtApp();
  const expTime = useCookie(TOKEN_EXPIRED_TIME);
  const { logout } = useAuth();

  const refreshToken = async () => {
    try {
      await $apiFetch("refresh-token");
      return true;
    } catch (error: any) {
      if (error.data.statusMessage !== "no-token") {
        await logout();
      }
    }
    return false;
  };

  const fetch = async () => {
    const isValid = isTokenValid(expTime.value ?? null);
    if (!isValid) {
      const isRefreshed = await refreshToken();
      if (!isRefreshed) return;
    }

    const result: any = await $apiFetch(request, {
      ...options,
    });
    return result.data ? result.data : result;
  };

  return await fetch();
}
