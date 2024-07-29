export const useCustomCookie = (name: string, options: any = {}) => {
  const { domain } = useRuntimeConfig().public;
  const defaultOptions = {
    domain: `.${domain}`,
    path: "/",
    secure: true,
    httpOnly: true,
    ...options,
  };
  return useCookie(name, defaultOptions);
};
