export default defineNuxtPlugin((nuxtApp) => {
  const { logout } = useAuth();
  const { loading } = useLoading();

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
      const { status } = error.response;
      loading.value = false;

      if (status === 401) {
        await logout();
      } else if (status === 403) {
        throw showError({
          statusCode: status,
          message: "Bạn không có quyền này!",
        });
      }
    },
  });
  nuxtApp.provide("apiFetch", apiFetch);
});
