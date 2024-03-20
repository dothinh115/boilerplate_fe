export default defineNuxtRouteMiddleware(async (to, from) => {
  const access_token = useCookie("access_token");
  const { user, getUser, logout } = useAuth();
  if (access_token && !user.value) {
    await getUser();
  }

  if (to.name === "login" && user.value) {
    return navigateTo("/", { replace: true });
  }

  if (to.name === "index" && !user.value)
    return navigateTo("/login", { replace: true });
});
