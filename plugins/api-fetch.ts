import { useToast } from "vue-toastification";

export default defineNuxtPlugin((nuxtApp) => {
  const toast = useToast();
  const { logout } = useAuth();
  const { loading } = useGetState();

  const apiFetch = $fetch.create({
    baseURL: "/api",
    onResponse(res) {
      const d = res.response._data;
      if (d.data) {
        return d.data;
      } else {
        return d;
      }
    },
    async onResponseError(error) {
      const { status, _data } = error.response;
      loading.value = false;
      if (status === 401) {
        await logout();
      } else if (status === 403) {
        throw showError({
          statusCode: status,
          statusMessage: "Bạn không có quyền này!",
        });
      } else {
        toast.error(_data.message);
      }
    },
  });
  nuxtApp.provide("apiFetch", apiFetch);
});
