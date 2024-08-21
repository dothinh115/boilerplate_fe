import type { TLogin } from "~/utils/models/login.model";
export type TUser = {
  id: string;
  email: string;
  rootUser: boolean;
  role: number;
  username: string;
  isEditedUsername: string;
};
export default function useAuth() {
  const accessTokenCookie = useCookie(ACCESS_TOKEN);
  const user = useState<TUser>("user");

  const getUser = async () => {
    try {
      const response: any = await useApi("/me");
      if (response.data) user.value = response.data;
      return user.value;
    } catch (error) {
      await logout();
    }
  };

  const login = async (data: TLogin) => {
    try {
      data = {
        ...data,
        clientId: await useFingerSprint(),
      };
      await useApi("/login", {
        method: "POST",
        body: data,
      });
      window.location.reload();
    } catch (error) {
      clearError();
    }
  };

  const logout = async () => {
    const refreshTokenCookie = useCookie(REFRESH_TOKEN);
    const accessTokenExpiredTime = useCookie(TOKEN_EXPIRED_TIME);
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

    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;
    accessTokenExpiredTime.value = null;
    window.location.reload();
  };

  return { login, getUser, logout, user };
}
