export type TToastData = {
  message: string;
  type: "success" | "error" | "warning" | "info";
};

export type TRoute = {
  id: number;
  path: string;
  method: string;
  roles: number[];
  isProtected: boolean;
}[];

export default function useGetState() {
  const toastData = useState<TToastData[]>("toastData", () => []);
  const loading = useState("loading", () => false);
  const screenWidth = useState("screenWidth", () => screen.width);
  const hideSidebar = useState("hideSidebar", () => false);
  const routes = useState<TRoute>("route", () => []);
  const isFromInside = useState<boolean>("isFromInside", () => false);

  return {
    toastData,
    loading,
    screenWidth,
    hideSidebar,
    routes,
    isFromInside,
  };
}
