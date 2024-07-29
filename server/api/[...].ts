import * as path from "path";
import { H3Event } from "h3";
export default defineEventHandler((event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; //lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = path.join(apiUrl, replacedPath); //ghép thành api hoàn chỉnh
  return proxyRequest(event, target); //proxy đi
});
