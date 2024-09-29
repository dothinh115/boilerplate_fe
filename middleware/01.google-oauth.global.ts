import { useToast } from "vue-toastification";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $apiFetch } = useNuxtApp();
  const clientId = await useFingerSprint();
  const toast = useToast();
  if (to.query.tokenId) {
    try {
      const params = {
        tokenId: to.query.tokenId,
        clientId,
      };
      await $apiFetch("auth/token", {
        params,
      });

      const { tokenId, ...remainQuery } = to.query;
      toast.success("Đăng nhập thành công!");
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
});
