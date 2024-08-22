import { H3Event, setCookie } from "h3";
import { joinURL } from "ufo";

import {
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
  REFRESH_TOKEN,
} from "@/utils/constants";
import { jwtDecode } from "jwt-decode";

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; // Lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); // Bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); // Ghép thành api hoàn chỉnh
  const method: any = event.node.req.method;
  const body = await readBody(event);
  const refreshToken = getCookie(event, REFRESH_TOKEN);
  const modifiedBody = {
    ...body,
    refreshToken,
  };

  const response: any = await $fetch(target, {
    method,
    body: modifiedBody,
  });
  event.node.res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (response.error) {
    event.node.res.statusCode = response.statusCode;
    return event.node.res.end(JSON.stringify(response));
  }
  const accessToken = response.data.accessToken;
  const accessTokenDecoded: any = jwtDecode(accessToken);
  const accessTokenExpires = new Date(accessTokenDecoded.exp * 1000);
  setCookie(event, ACCESS_TOKEN, accessToken, {
    secure: true,
    sameSite: "lax",
    expires: accessTokenExpires,
  });
  setCookie(event, TOKEN_EXPIRED_TIME, accessTokenDecoded.exp, {
    secure: true,
    sameSite: "lax",
    expires: accessTokenExpires,
  });
  const status = response.status;

  return event.node.res.end(
    JSON.stringify({
      statusCode: status,
      message: "Refresh token thành công!",
    })
  );
});
