import { H3Event, setCookie } from "h3";
import { joinURL } from "ufo";
import {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
} from "@/utils/constants";
import { jwtDecode } from "jwt-decode";

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl, cookiePath } = useRuntimeConfig().public; // Lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); // Bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath);

  return await proxyRequest(event, target, {
    async onResponse(event, response) {
      const responseBodyStream = response.body;
      if (responseBodyStream instanceof ReadableStream && response.ok) {
        const reader = responseBodyStream.getReader();
        let result = "";
        let done, value;
        while (!done) {
          ({ done, value } = await reader.read());
          if (value) {
            result += new TextDecoder().decode(value);
          }
        }
        const responseData = JSON.parse(result);
        const { refreshToken, accessToken } = responseData.data;
        const accessTokenDecoded: any = jwtDecode(accessToken);
        const accessTokenExpires = new Date(accessTokenDecoded.exp * 1000);
        const refreshTokenDecoded: any = jwtDecode(refreshToken);
        const refreshTokenExpires = new Date(refreshTokenDecoded.exp * 1000);

        setCookie(event, REFRESH_TOKEN, refreshToken, {
          domain: cookiePath,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          expires: refreshTokenExpires,
        });
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
        event.node.res.end(
          JSON.stringify({
            statusCode: 201,
            message: "Login thành công!",
          })
        );
      }
    },
  });
});
