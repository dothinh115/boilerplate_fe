export type TToastData = {
  message: string;
  type: "success" | "error" | "warning" | "info";
};

type TPermission = {
  _id: string;
  path: string;
  roles: string[];
  method: string;
}[];

export default function useGetState() {
  const toastData = useState<TToastData[]>("toastData", () => []);
  const loading = useState("loading", () => false);
  const screenWidth = useState("screenWidth", () => screen.width);
  const hideSidebar = useState("hideSidebar", () => false);
  const permission = useState<TPermission>("permission", () => []);

  return { toastData, loading, screenWidth, hideSidebar, permission };
}
