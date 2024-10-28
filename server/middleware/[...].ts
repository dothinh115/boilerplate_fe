import { getCookie } from "h3";
import { ACCESS_TOKEN, TOKEN_EXPIRED_TIME } from "@/utils/constants";
import { isTokenValid, refreshTokenFunc } from "~/utils/functions/common";

const excludedPath = ["login", "register", "auth"];

export default defineEventHandler(async (event) => {
  const { url } = event.node.req;
  const realPath = event.node.req.url?.replace(/^\/api\//, "");

  if (excludedPath.some((path) => realPath?.startsWith(path))) return;
  let accessToken = getCookie(event, ACCESS_TOKEN);
  if (url?.startsWith("/api/")) {
    const expTime = getCookie(event, TOKEN_EXPIRED_TIME);
    const isValid = isTokenValid(expTime ?? null);

    if (!isValid || !accessToken) {
      accessToken = await refreshTokenFunc(event);
    }
  }
  event.node.req.headers.authorization = accessToken
    ? "Bearer " + accessToken
    : undefined;
});
