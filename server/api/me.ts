import { joinURL } from "ufo";
import { ACCESS_TOKEN } from "@/utils/constants";
export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig().public; //lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); //ghép thành api hoàn chỉnh
  let accessToken = getCookie(event, ACCESS_TOKEN); //lấy access token từ cookie
  if (!accessToken) {
    return;
  }
  return await proxyRequest(event, target, {
    ...(accessToken && {
      headers: {
        authorization: "Bearer " + accessToken,
      },
    }),
  });
});
