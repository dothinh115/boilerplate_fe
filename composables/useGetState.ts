export type TToastData = {
  message: string;
  type: "success" | "error" | "warning" | "info";
};

export default function useGetState() {
  const toastData = useState<TToastData[]>("toastData", () => []);
  const loading = useState("loading", () => false);
  const screenWidth = useState("screenWidth", () => screen.width);
  const hideSidebar = useState("hideSidebar", () => false);

  return { toastData, loading, screenWidth, hideSidebar };
}
