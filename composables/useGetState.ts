export type TRoute = {
  id: number;
  path: string;
  method: string;
  roles: number[];
  isProtected: boolean;
  isHidden: boolean;
}[];

export default function useGetState() {
  const loading = useState("loading", () => false);
  const screenWidth = useState("screenWidth", () => screen.width);
  const hideSidebar = useState("hideSidebar", () => false);
  const routes = useState<TRoute>("route", () => []);
  const isFromInside = useState<boolean>("isFromInside", () => false);
  const shouldRevalidate = useState<boolean>("shouldRevalidate", () => false);

  return {
    loading,
    screenWidth,
    hideSidebar,
    routes,
    isFromInside,
    shouldRevalidate,
  };
}
