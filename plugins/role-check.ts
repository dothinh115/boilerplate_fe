export default defineNuxtPlugin(() => {
  return {
    provide: {
      roleCheck: (
        method: "POST" | "GET" | "PATCH" | "DELETE",
        route: string
      ) => {
        const { routes } = useGetState();
        const { user } = useAuth();
        const isRouteExist = routes.value.find(
          (x) => x.path.split("/").includes(route) && x.method === method
        );

        if (user.value.rootUser && isRouteExist) {
          return true;
        }

        const result =
          routes.value.filter(
            (r) =>
              r.method === method &&
              r.path.includes(route) &&
              r.roles.includes(user.value.role)
          ).length > 0;
        return result && isRouteExist;
      },
    },
  };
});
