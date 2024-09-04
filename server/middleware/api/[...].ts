import { getCookie, setCookie } from "h3";
import { jwtDecode } from "jwt-decode";
import {
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
  REFRESH_TOKEN,
  CLIENT_ID,
} from "@/utils/constants";
import { joinURL } from "ufo";
import { isTokenValid } from "~/utils/functions/common";

const excludedPath = ["login", "register", "auth"];

export default defineEventHandler(async (event) => {
  if (!/^\/api/.test(event.node.req.url as string)) {
    return;
  }
  const expTime = getCookie(event, TOKEN_EXPIRED_TIME);
  const isValid = isTokenValid(expTime ?? null);
  const realPath = event.node.req.url?.replace(/^\/api\//, "");
  if (isValid || excludedPath.some((path) => realPath?.startsWith(path))) {
    return;
  }
  const refreshToken = getCookie(event, REFRESH_TOKEN);
  const clientId = getCookie(event, CLIENT_ID);
  const { cookiePath, apiUrl } = useRuntimeConfig().public;
  const target = joinURL(apiUrl, "refresh-token");

  const body = {
    refreshToken,
    clientId,
  };
  if (!refreshToken || !clientId) {
    console.log("Không đủ thông tin!");
    return;
  }
  try {
    const response: any = await $fetch(target, {
      method: "POST",
      body,
    });

    const accessToken = response.data.accessToken;

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
    event.node.req.headers["new-token"] = accessToken;
  } catch (error) {
    console.log(error);
  }
});
