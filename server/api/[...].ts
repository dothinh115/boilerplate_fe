import { joinURL } from "ufo";
import { H3Event } from "h3";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { isTokenValid, refreshTokenFunc } from "~/utils/functions/common";

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public;
  const replacedPath = event.path.replace(/^\/api\//, "");
  const target = joinURL(apiUrl, replacedPath);
  let accessToken = getCookie(event, ACCESS_TOKEN);
  const refreshToken = getCookie(event, REFRESH_TOKEN);

  const tokenValid = isTokenValid(event);
  //refresh token nếu cần
  if (refreshToken && !tokenValid) {
    const newAccessToken = await refreshTokenFunc(event, apiUrl);
    if (!newAccessToken) {
      throw createError({
        statusCode: 400,
        message: "Refresh token thất bại!",
      });
    }
    accessToken = newAccessToken;
  }
  return await proxyRequest(event, target, {
    ...(accessToken && {
      headers: {
        authorization: "Bearer " + accessToken,
      },
    }),
  });
});
