import { jwtDecode } from "jwt-decode";
import {
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
  REFRESH_TOKEN,
  CLIENT_ID,
} from "@/utils/constants";
import { joinURL } from "ufo";
export default defineEventHandler(async (event) => {
  const { cookiePath, apiUrl } = useRuntimeConfig().public;
  const target = joinURL(apiUrl, "refreshToken");
  const refreshToken = getCookie(event, REFRESH_TOKEN);
  const clientId = getCookie(event, CLIENT_ID);
  const body = {
    refreshToken,
    clientId,
  };
  if (!refreshToken || !clientId) {
    throw createError({
      statusCode: 400,
      message: "Token không hợp lệ!",
      statusMessage: "no-token",
    });
  }

  try {
    const response: any = await $fetch(target, {
      method: "POST",
      body,
    });

    const accessToken = response.data.accessToken;

    if (accessToken) {
      const accessTokenDecoded: any = jwtDecode(accessToken);
      const accessTokenExpires = new Date(accessTokenDecoded.exp * 1000);
      setCookie(event, ACCESS_TOKEN, accessToken, {
        domain: cookiePath,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: accessTokenExpires,
      });
      setCookie(event, TOKEN_EXPIRED_TIME, accessTokenDecoded.exp, {
        domain: cookiePath,
        secure: true,
        sameSite: "lax",
        expires: accessTokenExpires,
      });
      event.node.res.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
      );
      return event.node.res.end(
        JSON.stringify({
          statusCode: 201,
          message: "Refresh token thành công!",
        })
      );
    } else {
      throw createError({
        statusCode: 400,
        message: "Có lỗi xảy ra khi refresh token",
      });
    }
  } catch (error) {
    console.log(error);
    return false;
  }
});
