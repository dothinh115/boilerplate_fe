import { H3Event, setCookie } from "h3";
import { joinURL, withQuery } from "ufo";
import type { QueryObject } from "ufo";
import {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
} from "@/utils/constants";
import { jwtDecode } from "jwt-decode";

const parseQueryString = (
  reqUrl: string | undefined,
  baseUrl: string
): QueryObject => {
  const url = new URL(reqUrl || "", baseUrl);
  const queryObject: QueryObject = {};
  const params = new URLSearchParams(url.searchParams);
  params.forEach((value, key) => {
    queryObject[key] = value;
  });
  return queryObject;
};

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; // Lấy api thực từ env
  const url = event.node.req.url;
  const queryObject = parseQueryString(url, apiUrl); //phân tích lấy query string từ url
  const replacedPath = event.path.replace(/^\/api\//, ""); // Bỏ prefix /api
  const target = queryObject
    ? withQuery(joinURL(apiUrl, replacedPath), queryObject)
    : joinURL(apiUrl, replacedPath);

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
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          expires: refreshTokenExpires,
        });
        setCookie(event, ACCESS_TOKEN, accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          expires: accessTokenExpires,
        });
        setCookie(event, TOKEN_EXPIRED_TIME, accessTokenDecoded.exp, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          expires: accessTokenExpires,
        });
        const status = response.status;
        event.node.res.end(
          JSON.stringify({ statusCode: status, message: "Login thành công!" })
        );
      }
    },
  });
});
