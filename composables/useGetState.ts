export type TRoute = {
  id: number;
  path: string;
  method: string;
  roles: number[];
  isProtected: boolean;
}[];

export default function useGetState() {
  const loading = useState("loading", () => false);
  const screenWidth = useState("screenWidth", () => screen.width);
  const hideSidebar = useState("hideSidebar", () => false);
  const routes = useState<TRoute>("route", () => []);
  const isFromInside = useState<boolean>("isFromInside", () => false);

  return {
    loading,
    screenWidth,
    hideSidebar,
    routes,
    isFromInside,
  };
}
