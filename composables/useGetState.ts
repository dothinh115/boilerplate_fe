export type TToastData = {
  message: string;
  type: "success" | "error" | "warning" | "info";
};

type TRoute = {
  id: string;
  path: string;
  method: string;
  roles: number[];
}[];

export default function useGetState() {
  const toastData = useState<TToastData[]>("toastData", () => []);
  const loading = useState("loading", () => false);
  const screenWidth = useState("screenWidth", () => screen.width);
  const hideSidebar = useState("hideSidebar", () => false);
  const routes = useState<TRoute>("route", () => []);

  return { toastData, loading, screenWidth, hideSidebar, routes };
}
