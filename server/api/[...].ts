import { joinURL } from "ufo";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().private;
  const replacedPath = event.path.replace(/^\/api\//, "");
  const target = joinURL(apiUrl, replacedPath);

  return await proxyRequest(event, target);
});
