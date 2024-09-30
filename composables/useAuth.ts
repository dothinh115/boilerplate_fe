import type { TLogin } from "~/utils/models/login.model";
import { useToast } from "vue-toastification";

export type TUser = {
  id: string;
  email: string;
  rootUser: boolean;
  role: number;
  username: string;
  isEditedUsername: boolean;
};
export default function useAuth() {
  const toast = useToast();
  const user = useState<TUser>("user");
  const getUser = async () => {
    const response: any = await useApi("/me");
    if (response?.data) user.value = response.data;
    return user.value;
  };

  const login = async (data: TLogin) => {
    const route = useRoute();

    try {
      data = {
        ...data,
      };
      await useApi("login", {
        method: "POST",
        body: data,
      });
      if (route.query.next) {
        window.location.href = route.query.next as string;
      } else window.location.reload();
    } catch (error: any) {
      toast.error(error?.data.message);
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
