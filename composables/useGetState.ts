export type TToastData = {
  message: string;
  type: "success" | "error" | "warning" | "info";
};

type TRoute = {
  _id: string;
  path: string;
  method: string;
}[];

type TPermission = {
  _id: string;
  route: {
    _id: string;
    path: string;
    method: string;
  };
  roles: string[];
}[];

export default function useGetState() {
  const toastData = useState<TToastData[]>("toastData", () => []);
  const loading = useState("loading", () => false);
  const screenWidth = useState("screenWidth", () => screen.width);
  const hideSidebar = useState("hideSidebar", () => false);
  const routes = useState<TRoute>("route", () => []);
  const permissions = useState<TPermission>("permission", () => []);

  return { toastData, loading, screenWidth, hideSidebar, routes, permissions };
}
