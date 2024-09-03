export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, getUser } = useAuth();

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
