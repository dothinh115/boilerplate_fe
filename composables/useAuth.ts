import type { TLogin } from "~/utils/models/login.model";

export default function useAuth() {
  const accessTokenCookie = useCookie("access_token");
  const refreshTokenCookie = useCookie("refresh_token");

  const user = useState<any>("user");

  const getUser = async () => {
    if (!accessTokenCookie.value) return undefined;
    try {
      const fetchUserResult: any = await useApi("/me", {
        headers: {
          authorization: "Bearer " + accessTokenCookie.value,
        },
      });
      if (fetchUserResult) user.value = fetchUserResult.data;
      return user.value;
    } catch (error) {}
  };

  const login = async (data: TLogin) => {
    const result: any = await useApi("/login", {
      method: "POST",
      body: data,
    });
    accessTokenCookie.value = result?.accessToken;
    refreshTokenCookie.value = result?.refreshToken;
    const fetchUser = await getUser();
    if (fetchUser) navigateTo("/");
    return result;
  };

  const logout = async () => {
    await useApi("/logout", {
      method: "POST",
    });
    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;
    window.location.reload();
  };

  return { login, getUser, logout, user };
}
