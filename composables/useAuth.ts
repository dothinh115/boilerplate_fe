import type { TLogin } from "~/utils/models/login.model";
export type TUser = {
  id: string;
  email: string;
  rootUser: boolean;
  role: number;
};
export default function useAuth() {
  //refreshToken lưu ở cookie, access lưu ở session
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
    const refreshTokenCookie = useCookie(REFRESH_TOKEN);
    if (refreshTokenCookie.value) {
      try {
        await useApi("logout", {
          method: "POST",
          body: {
            refreshToken: refreshTokenCookie.value,
          },
        });
      } catch (error) {}
    }

    sessionStorage.removeItem(ACCESS_TOKEN);
    refreshTokenCookie.value = null;
    window.location.reload();
  };

  return { login, getUser, logout, user };
}
