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
  const user = useState<TUser>("user");
  const { $apiFetch } = useNuxtApp();
  const getUser = async () => {
    try {
      const response: any = await useApi("/me");
      if (response.data) user.value = response.data;
      return user.value;
    } catch (error) {
      // await logout();
    }
  };

  const login = async (data: TLogin) => {
    const route = useRoute();

    try {
      data = {
        ...data,
        clientId: await useFingerSprint(),
      };
      await $apiFetch("login", {
        method: "POST",
        body: data,
      });
      if (route.query.next) {
        window.location.href = route.query.next as string;
      } else window.location.reload();
    } catch (error) {
      clearError();
    }
  };

  const logout = async () => {
    try {
      await useApi("logout");
    } catch (error) {
    } finally {
      window.location.reload();
    }
  };

  return { login, getUser, logout, user };
}
