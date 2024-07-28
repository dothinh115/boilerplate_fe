import * as path from "path";
import { H3Event } from "h3";
export default defineEventHandler((event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public;
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = path.join(apiUrl, replacedPath);
  return proxyRequest(event, target);
});
