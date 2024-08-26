import { joinURL } from "ufo";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
import { isTokenValid, refreshTokenFunc } from "~/utils/functions/common";
export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig().public; //lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); //ghép thành api hoàn chỉnh
  let accessToken = getCookie(event, ACCESS_TOKEN); //lấy access token từ cookie
  const tokenValid = isTokenValid(event);
  const refreshToken = getCookie(event, REFRESH_TOKEN);

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
