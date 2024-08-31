import type { FetchOptions } from "ofetch";

export default async function useApi(request: string, options?: FetchOptions) {
  const { $apiFetch } = useNuxtApp();

  const fetch = async () => {
    const result: any = await $apiFetch(request, {
      ...options,
    });
    return result.data ? result.data : result;
  };

  return await fetch();
}
