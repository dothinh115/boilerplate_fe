export default defineNuxtPlugin(() => {
  return {
    provide: {
      roleCheck: (method: string, route: string) => {
        const { permission } = useGetState();
        const { user } = useAuth();
        return (
          permission.value.filter((x) => {
            if (x.path.includes(route) && x.method === method) {
              if (user.value.rootUser) return true;
              if (x.roles.includes(user.value.role)) return true;
            }
          }).length > 0
        );
      },
    },
  };
});
