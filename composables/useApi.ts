import { useToast } from "vue-toastification";

export default async function useApi(
  request: string,
  options?: {
    body?: any;
    method?: "POST" | "PATCH" | "GET" | "DELETE";
    baseURL?: string;
    params?: any;
    headers?: {
      authorization: string;
    };
  }
) {
  const { loading } = useGetState();
  const toast = useToast();
  const { logout } = useAuth();
  options = {
    ...options,
    baseURL: "/api",
  };

  const fetch = async () => {
    try {
      const result: any = await $fetch(request, {
        ...options,
      });
      return result.data ? result.data : result;
    } catch (error: any) {
      if (loading.value) loading.value = false;
      const router = useRouter();
      const route = useRoute();
      if (error.data?.statusCode === 401) {
        await logout();
      } else if (error.data?.statusCode === 403) {
        throw showError({
          statusCode: error.data?.statusCode,
          statusMessage: "Bạn không có quyền này!",
        });
      } else if (error.data?.statusCode === 400) {
        toast.error(error.data.message);
        if (route.query.sort)
          router.push({ query: { sort: undefined }, replace: true });
      } else {
        toast.error(error.data.message);
      }
      clearError();
      throw error;
    }
  };

  return await fetch();
}
