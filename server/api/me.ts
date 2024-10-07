import { joinURL } from "ufo";
import { H3Event } from "h3";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TOKEN_EXPIRED_TIME,
} from "@/utils/constants";
import { isTokenValid } from "~/utils/functions/common";

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().private;
  const replacedPath = event.path.replace(/^\/api\//, "");
  const target = joinURL(apiUrl, replacedPath);
  const accessToken = getCookie(event, ACCESS_TOKEN);
  const refreshToken = getCookie(event, REFRESH_TOKEN);
  const expTime = getCookie(event, TOKEN_EXPIRED_TIME);
  const isValid = isTokenValid(expTime ?? null);
  if (!accessToken || !refreshToken || !isValid) return;
  let headers: Record<string, string> = {};
  Object.entries(event.node.req.headers).forEach(([key, value]) => {
    if (
      ["host", "content-length", "connection", "accept-encoding"].includes(key)
    ) {
      return;
    }
    if (typeof value === "string") {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(",");
    }
  });
  return await proxyRequest(event, target, {
    headers,
  });
});
