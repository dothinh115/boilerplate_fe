export const useGoBack = (args: {
  navigate: { name?: string; params?: object; query?: object };
  options?: { replace: boolean };
}) => {
  const router = useRouter();
  const { isFromInside } = useGetState();
  const { navigate, options } = args;
  if (isFromInside.value) {
    router.back();
  } else {
    return navigateTo(navigate as any, options);
  }
};
