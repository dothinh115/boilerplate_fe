import { joinURL } from "ufo";
import { H3Event } from "h3";
export default defineEventHandler((event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; //lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); //ghép thành api hoàn chỉnh
  return proxyRequest(event, target); //proxy đi
});
