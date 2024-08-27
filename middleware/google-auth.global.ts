import { useToast } from "vue-toastification";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $apiFetch } = useNuxtApp();
  const toast = useToast();
  if (to.query.tokenId) {
    try {
      const params = {
        tokenId: to.query.tokenId,
      };
      await $apiFetch("auth/token", {
        params,
      });
      if (to.query.next) {
        window.location.href = to.query.next as string;
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error("Đăng nhập không thành công!");
      const { tokenId, ...remainQuery } = to.query;
      return navigateTo(
        {
          name: to.name,
          query: remainQuery,
        },
        { replace: true }
      );
    }
  }
});
