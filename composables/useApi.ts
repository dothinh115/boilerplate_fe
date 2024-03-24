import settings from "../configs/settings.json";
import { jwtDecode } from "jwt-decode";
import type { TToastData } from "./useGetState";

export default async function useApi(request: string, options?: any) {
  const access_token = useCookie("access_token");
  const refresh_token = useCookie("refresh_token");
  const { loading, toastData } = useGetState();
  const { logout } = useAuth();
  options = {
    ...options,
    baseURL: settings.apiUrl,
  };

  const isTokenValid = () => {
    if (!access_token.value) return true;
    try {
      const decoded: any = jwtDecode(access_token.value);
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
    if (!isValid) await refreshToken();

    return await $fetch(request, {
      ...options,
      ...(access_token.value && {
        headers: {
          authorization: "Bearer " + access_token.value,
        },
      }),
    }).catch((error: any) => {
      if (loading.value) loading.value = false;
      if (error.data?.statusCode === 403) {
        const newToast: TToastData = {
          message: "Bạn không có quyền này!",
          type: "error",
        };
        toastData.value.push(newToast);
      } else {
        const newToast: TToastData = {
          message: error.data.message,
          type: "error",
        };
        toastData.value.push(newToast);
      }
    });
  };

  const refreshToken = async () => {
    try {
      const refreshTokenResponse: any = await $fetch("/refreshtoken", {
        baseURL: settings.apiUrl,
        method: "POST",
        body: {
          refreshToken: refresh_token.value,
        },
      });
      access_token.value = refreshTokenResponse.accessToken;
      refresh_token.value = refreshTokenResponse.refreshToken;
    } catch (error) {
      await logout();
    }
  };

  return await fetch();
}
