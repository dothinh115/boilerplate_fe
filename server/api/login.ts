import { H3Event } from "h3";
import { joinURL } from "ufo";
import {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
} from "@/utils/constants";
import { jwtDecode } from "jwt-decode";

export default defineEventHandler(async (event: H3Event) => {
  const { cookiePath } = useRuntimeConfig().public; // Lấy api thực từ env
  const { apiUrl } = useRuntimeConfig().private;
  const replacedPath = event.path.replace(/^\/api\//, ""); // Bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); // Ghép thành api hoàn chỉnh
  const body = await readBody(event);
  const isRemember = body.remember;

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
        const refreshTokenDecoded: any = jwtDecode(refreshToken);
        const accessTokenExpires = new Date(accessTokenDecoded.exp * 1000);
        const refreshTokenExpires = new Date(refreshTokenDecoded.exp * 1000);
        setCookie(event, REFRESH_TOKEN, refreshToken, {
          domain: cookiePath,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          ...(isRemember
            ? {
                expires: refreshTokenExpires,
              }
            : {
                maxAge: 60 * 60 * 24, //1 ngày
              }),
        });
        setCookie(event, ACCESS_TOKEN, accessToken, {
          domain: cookiePath,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          expires: accessTokenExpires,
        });
        setCookie(event, TOKEN_EXPIRED_TIME, accessTokenDecoded.exp, {
          domain: cookiePath,
          secure: true,
          sameSite: "strict",
          expires: accessTokenExpires,
        });
        const status = response.status;
        event.node.res.setHeader(
          "Content-Type",
          "application/json; charset=utf-8"
        );

        event.node.res.end(
          JSON.stringify({ statusCode: status, message: "Login thành công!" })
        );
      }
    },
  });
});
