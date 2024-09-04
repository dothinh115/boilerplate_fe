export default defineNuxtRouteMiddleware((to) => {
  if (to.name === "login") return;
  let nextUrl: string | null = null;
  if (to.query.next) {
    try {
      const url = new URL(to.query.next as string);
      nextUrl = url.href;
    } catch (error) {}
  }
  if (nextUrl) {
    return navigateTo(nextUrl, { external: true });
  }
});
