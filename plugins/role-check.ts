export default defineNuxtPlugin(() => {
  return {
    provide: {
      roleCheck: (
        method: "POST" | "GET" | "PATCH" | "DELETE",
        route: string
      ) => {
        const { routes } = useGetState();
        const { user } = useAuth();
        const stateKey = `role:${method}:${route}`;
        const result = useState<boolean | undefined>(stateKey);
        const isRouteExist = routes.value.find(
          (x) => x.path.split("/").includes(route) && x.method === method
        );
        if (!isRouteExist) {
          return false;
        } else if (user.value.rootUser) {
          return true;
        } else if (result.value) {
          return result.value;
        } else {
          const isAccessible =
            routes.value.filter(
              (r) =>
                r.method === method &&
                r.path.includes(route) &&
                r.roles.includes(user.value.role)
            ).length > 0;
          result.value = isAccessible;
          return result.value;
        }
      },
    },
  };
});
