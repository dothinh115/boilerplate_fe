import type { TFile } from "~/components/File/Item.vue";

export type TRoute = {
  id: number;
  path: string;
  method: string;
  roles: number[];
  isProtected: boolean;
  isHidden: boolean;
}[];

export default function useGetState() {
  const screenWidth = useState<number>("screenWidth");
  const hideSidebar = useState("hideSidebar", () => false);
  const routes = useState<TRoute>("route", () => []);
  const isFromInside = useState<boolean>("isFromInside", () => false);
  const shouldRevalidate = useState<boolean>("shouldRevalidate", () => false);
  const dynamicListSelectList = useState<(string | number)[]>(
    "dynamicListSelectList",
    () => []
  );
  const fileListSelectList = useState<
    {
      file: TFile;
      type: "succeeded" | "failed" | "loading";
    }[]
  >("fileListSelectList", () => []);

  return {
    screenWidth,
    hideSidebar,
    routes,
    isFromInside,
    shouldRevalidate,
    dynamicListSelectList,
    fileListSelectList,
  };
}
