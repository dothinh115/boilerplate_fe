import { useToast } from "vue-toastification";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $apiFetch } = useNuxtApp();
  const { user, getUser } = useAuth();

  const toast = useToast();
  if (to.query.tokenId) {
    try {
      const params = {
        tokenId: to.query.tokenId,
      };
      await $apiFetch("auth/token", {
        params,
      });
      const { tokenId, ...remainQuery } = to.query;
      return navigateTo(
        {
          name: to.name,
          query: remainQuery,
        },
        { replace: true }
      );
    } catch (error) {
      toast.error("Đăng nhập không thành công!");
      const { tokenId, ...remainQuery } = to.query;
      return navigateTo(
        {
          name: "login",
          query: remainQuery,
        },
        { replace: true }
      );
    }
  }

  if (!user.value) {
    await getUser();
  }

  if (to.name === "login" && user.value) {
    return navigateTo("/", { replace: true });
  }

  if (to.name !== "login" && !user.value) {
    return navigateTo(`/login?next=${to.fullPath}`, { replace: true });
  }
});
