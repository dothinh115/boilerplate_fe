import { joinURL } from "ufo";
import { H3Event } from "h3";
import { ACCESS_TOKEN } from "@/utils/constants";
export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; //lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); //ghép thành api hoàn chỉnh
  const accessToken = getCookie(event, ACCESS_TOKEN); //lấy access token từ cookie

  return await proxyRequest(event, target, {
    ...(accessToken && {
      headers: {
        authorization: "Bearer " + accessToken,
      },
    }),
  });
});
