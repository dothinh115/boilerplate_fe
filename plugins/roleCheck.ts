export default defineNuxtPlugin(() => {
  return {
    provide: {
      roleCheck: (method: string, route: string) => {
        const { permissions, routes } = useGetState();
        const { user } = useAuth();
        const isRouteExist = routes.value.find(
          (x) => x.path.split("/").includes(route) && x.method === method
        );
        if (user.value.rootUser && isRouteExist) return true;
        const result =
          permissions.value.filter(
            (x) => x.route.method === method && x.route.path.includes(route)
          ).length > 0;
        return result && isRouteExist;
      },
    },
  };
});
