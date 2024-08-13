import { jwtDecode } from "jwt-decode";
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
  const refresh_token = useCookie(REFRESH_TOKEN);
  const { loading } = useGetState();
  const toast = useToast();
  const { logout } = useAuth();
  options = {
    ...options,
    baseURL: "/api",
  };

  const isTokenValid = () => {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) return false;
    let expiredTime = sessionStorage.getItem(TOKEN_EXPIRED_TIME);
    try {
      if (!expiredTime) {
        const decoded: any = jwtDecode(accessToken);
        expiredTime = decoded.exp;
        sessionStorage.setItem(TOKEN_EXPIRED_TIME, decoded.exp);
      }
      if (!expiredTime) return false;
      const currentTime = Math.floor(Date.now() / 1000);
      if (Number(expiredTime) < currentTime) return false;
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetch = async () => {
    const isValid = isTokenValid();
    if (
      !isValid &&
      refresh_token.value &&
      request !== "refreshToken" &&
      request !== "logout"
    ) {
      //lúc này nếu token đã invalid thì xoá token đi luôn
      sessionStorage.removeItem(ACCESS_TOKEN);
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
      }
      toast.error("Lỗi không xác định!");
      clearError();
      throw error;
    }
  };

  const refreshToken = async () => {
    const body = {
      refreshToken: refresh_token.value,
      clientId: await useFingerSprint(),
    };
    try {
      const refreshTokenResponse: any = await useApi("refreshToken", {
        method: "POST",
        body,
      });
      refresh_token.value = refreshTokenResponse.refreshToken;
      //lưu accessToken vào session
      sessionStorage.setItem(ACCESS_TOKEN, refreshTokenResponse.accessToken);
      const decoded: any = jwtDecode(refreshTokenResponse.accessToken);
      sessionStorage.setItem(TOKEN_EXPIRED_TIME, decoded.exp);
    } catch (error) {
      await logout();
    }
  };

  return await fetch();
}
