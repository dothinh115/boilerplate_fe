export default defineNuxtRouteMiddleware(async () => {
  const clientIdCookie = useCookie(CLIENT_ID);
  if (!clientIdCookie.value) {
    const clientId = await useFingerSprint();
    await useApi("set-client-id", {
      method: "POST",
      body: {
        clientId,
      },
    });
  }
});
