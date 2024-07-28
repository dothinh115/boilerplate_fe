import type { TLogin } from "~/utils/models/login.model";
export type TUser = {
  id: string;
  email: string;
  rootUser: boolean;
  role: number;
};
export default function useAuth() {
  //refreshToken lưu ở cookie, access lưu ở session
  const { public: runtimeConfigPublic } = useRuntimeConfig();
  const apiUrl = runtimeConfigPublic.apiUrl;
  const refreshTokenCookie = useCookie(REFRESH_TOKEN);
  const user = useState<TUser>("user");

  const getUser = async () => {
    try {
      const fetchUserResult: any = await useApi("/me");
      if (fetchUserResult.data) user.value = fetchUserResult.data;
      return user.value;
    } catch (error) {
      await logout();
    }
  };

  const login = async (data: TLogin) => {
    data = {
      ...data,
      clientId: await useFingerSprint(),
    };
    const result: any = await useApi("/login", {
      method: "POST",
      body: data,
    });
    if (result) {
      refreshTokenCookie.value = result?.refreshToken;
      //lưu accessToken vào session
      sessionStorage.setItem(ACCESS_TOKEN, result?.accessToken);

      const fetchUser = await getUser();
      if (fetchUser) window.location.reload();
    }

    return result;
  };

  const logout = async () => {
    if (refreshTokenCookie.value) {
      try {
        await $fetch("/logout", {
          method: "POST",
          baseURL: apiUrl,
          body: {
            refreshToken: refreshTokenCookie.value,
          },
        });
      } catch (error) {}
    }
    removeToken();
    window.location.reload();
  };

  const removeToken = () => {
    sessionStorage.removeItem(ACCESS_TOKEN);
    refreshTokenCookie.value = null;
  };

  return { login, getUser, logout, user };
}
