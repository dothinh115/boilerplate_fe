import settings from "../configs/settings.json";
import { jwtDecode } from "jwt-decode";
import type { TToastData } from "./useGetState";

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
  const refresh_token = useCookie(REFRESH_TOKEN);
  const { loading, toastData } = useGetState();
  const { logout } = useAuth();
  options = {
    ...options,
    baseURL: settings.apiUrl,
  };

  const isTokenValid = () => {
    const access_token = sessionStorage.getItem(ACCESS_TOKEN);
    if (!access_token) return false;
    try {
      const decoded: any = jwtDecode(access_token);
      if (!decoded || !decoded.exp) return false;
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) return false;
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetch = async () => {
    const isValid = isTokenValid();
    if (!isValid && refresh_token.value) {
      await refreshToken();
    }
    const access_token = sessionStorage.getItem(ACCESS_TOKEN);
    try {
      const result: any = await $fetch(request, {
        ...options,
        ...(access_token && {
          headers: {
            authorization: "Bearer " + access_token,
          },
        }),
      });
      return result.data;
    } catch (error: any) {
      if (loading.value) loading.value = false;
      const router = useRouter();
      const route = useRoute();
      if (error.data?.statusCode === 401) {
        await logout();
      } else if (error.data?.statusCode === 403) {
        const newToast: TToastData = {
          message: "Bạn không có quyền này!",
          type: "error",
        };
        toastData.value.push(newToast);
        router.push({ path: "/", replace: true });
      } else if (error.data?.statusCode === 404) {
        throw showError({
          statusCode: error.data?.statusCode,
        });
      } else if (error.data?.statusCode === 400) {
        const newToast: TToastData = {
          message: error.data.message,
          type: "error",
        };
        toastData.value.push(newToast);
        if (route.query.sort)
          router.push({ query: { sort: undefined }, replace: true });
      } else {
        const newToast: TToastData = {
          message: error.data?.message,
          type: "error",
        };
        toastData.value.push(newToast);
        clearError();
      }
      clearError();
    }
  };

  const refreshToken = async () => {
    const body = {
      refreshToken: refresh_token.value,
      clientId: await useFingerSprint(),
    };
    try {
      const refreshTokenResponse: any = await $fetch("/refreshtoken", {
        baseURL: settings.apiUrl,
        method: "POST",
        body,
      });
      refresh_token.value = refreshTokenResponse.data.refreshToken;
      //lưu accessToken vào session
      sessionStorage.setItem(
        ACCESS_TOKEN,
        refreshTokenResponse.data.accessToken
      );
    } catch (error) {
      await logout();
    }
  };

  return await fetch();
}
