import { H3Event } from "h3";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "h3";
import {
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
  REFRESH_TOKEN,
} from "@/utils/constants";

export const isTokenValid = (expTime: string | null) => {
  if (!expTime) return false;
  const currentTime = Math.floor(Date.now() / 1000);
  if (Number(expTime) < currentTime) {
    return false;
  }
  return true;
};

export const refreshTokenFunc = async (event: H3Event) => {
  const { cookiePath } = useRuntimeConfig().public;
  const { apiUrl } = useRuntimeConfig().private;
  const refreshToken = getCookie(event, REFRESH_TOKEN);
  if (!refreshToken) {
    return false;
  }

  const body = {
    refreshToken,
  };

  try {
    const response: any = await $fetch("refresh-token", {
      baseURL: apiUrl,
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
        sameSite: "strict",
        expires: accessTokenExpires,
      });
      setCookie(event, TOKEN_EXPIRED_TIME, accessTokenDecoded.exp, {
        domain: cookiePath,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: accessTokenExpires,
      });
      return accessToken;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
