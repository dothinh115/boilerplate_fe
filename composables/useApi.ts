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
  const refreshTokenCookie = useCookie(REFRESH_TOKEN);
  const accessTokenCookie = useCookie(ACCESS_TOKEN);
  const accessTokenExpiredTime = useCookie(TOKEN_EXPIRED_TIME);
  const { loading } = useGetState();
  const toast = useToast();
  const { logout } = useAuth();
  options = {
    ...options,
    baseURL: "/api",
  };

  const isTokenValid = () => {
    const accessToken = accessTokenCookie.value;
    if (!accessToken) return false;
    let expiredTime = accessTokenExpiredTime.value;
    try {
      if (!expiredTime) {
        const decoded: any = jwtDecode(accessToken);
        expiredTime = decoded.exp;
        accessTokenExpiredTime.value = expiredTime;
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
      refreshTokenCookie.value &&
      request !== "refreshToken" &&
      request !== "logout"
    ) {
      //lúc này nếu token đã invalid thì xoá token đi luôn
      accessTokenCookie.value = null;
      accessTokenExpiredTime.value = null;
      await refreshToken();
    }
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
        toast.error(error.data ? error.data.message : "Lỗi không xác định!");
      }
      clearError();
      throw error;
    }
  };

  const refreshToken = async () => {
    const body = {
      refreshToken: refreshTokenCookie.value,
      clientId: await useFingerSprint(),
    };
    try {
      await useApi("refreshToken", {
        method: "POST",
        body,
      });
    } catch (error) {
      await logout();
    }
  };

  return await fetch();
}
