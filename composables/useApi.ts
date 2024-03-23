import settings from "../configs/settings.json";
import { jwtDecode } from "jwt-decode";

export default async function useApi(request: string, options?: any) {
  const access_token = useCookie("access_token");
  const refresh_token = useCookie("refresh_token");
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
    if (!isValid) {
      await refreshToken();
    }

    return await $fetch(request, {
      ...options,
      ...(access_token.value && {
        headers: {
          authorization: "Bearer " + access_token.value,
        },
      }),
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
      if (
        refreshTokenResponse.accessToken &&
        refreshTokenResponse.refreshToken
      ) {
        access_token.value = refreshTokenResponse.accessToken;
        refresh_token.value = refreshTokenResponse.refreshToken;
      } else await logout();
    } catch (error) {
      await logout();
    }
  };

  return await fetch();
}
