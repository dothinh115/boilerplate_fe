export default defineNuxtRouteMiddleware(async (to, from) => {
  const refreshToken = useCookie(REFRESH_TOKEN);
  const { user, getUser } = useAuth();

  if (refreshToken.value && !user.value) {
    await getUser();
  }

  if (to.name === "login" && user.value) {
    return navigateTo("/", { replace: true });
  }

  if (to.name !== "login" && !user.value)
    return navigateTo("/login", { replace: true });
});
