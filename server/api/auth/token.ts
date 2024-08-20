import { H3Event, createError, setCookie } from "h3";
import { joinURL, withQuery } from "ufo";
import {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
} from "@/utils/constants";
import { jwtDecode } from "jwt-decode";

const parseQueryString = (reqUrl: string | undefined, baseUrl: string) => {
  const url = new URL(reqUrl || "", baseUrl);
  const queryObject: any = {};
  const params = new URLSearchParams(url.searchParams);
  params.forEach((value, key) => {
    queryObject[key] = value;
  });
  return queryObject;
};

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; // Lấy api thực từ env
  const url = event.node.req.url;
  const queryString = parseQueryString(url, apiUrl);
  const replacedPath = event.path.replace(/^\/api\//, ""); // Bỏ prefix /api
  const target = queryString
    ? withQuery(joinURL(apiUrl, replacedPath), queryString)
    : joinURL(apiUrl, replacedPath);

  // Lấy phương thức HTTP và headers từ yêu cầu ban đầu
  const method = event.node.req.method;
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(event.node.req.headers)) {
    if (typeof value === "string") {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(", ");
    }
  }

  try {
    const response = await fetch(target, {
      method,
      headers,
    });
    const status = response.status;
    response.headers.forEach((value, name) => {
      event.node.res.setHeader(name, value);
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw createError({
        message: responseData.message,
        statusCode: status,
      });
    }
    const { refreshToken, accessToken } = responseData.data;
    const decoded: any = jwtDecode(accessToken);
    setCookie(event, REFRESH_TOKEN, refreshToken);
    setCookie(event, ACCESS_TOKEN, accessToken);
    setCookie(event, TOKEN_EXPIRED_TIME, decoded.exp);

    event.node.res.statusCode = status;
    return event.node.res.end(JSON.stringify(responseData));
  } catch (error: any) {
    const { statusCode } = error;
    event.node.res.statusCode = statusCode;
    return event.node.res.end(JSON.stringify(error));
  }
});
