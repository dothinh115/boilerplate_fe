export default defineNuxtPlugin(() => {
  return {
    provide: {
      roleCheck: (method: string, route: string) => {
        const { permissions } = useGetState();
        const { user } = useAuth();
        if (user.value.rootUser) return true;
        const result =
          permissions.value.filter(
            (x) => x.route.method === method && x.route.path.includes(route)
          ).length > 0;
        return result;
      },
    },
  };
});
