import { H3Event } from "h3";
import { jwtDecode } from "jwt-decode";
import { joinURL } from "ufo";
import {
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
  REFRESH_TOKEN,
  CLIENT_ID,
} from "@/utils/constants";

// export const isTokenValid = (event: H3Event) => {
//   const accessToken = getCookie(event, ACCESS_TOKEN);
//   if (!accessToken) return false;

//   let expiredTime: string | number | undefined = getCookie(
//     event,
//     TOKEN_EXPIRED_TIME
//   );

//   try {
//     if (!expiredTime) {
//       const decoded = jwtDecode(accessToken);
//       if (!decoded.exp) return false;
//       expiredTime = decoded.exp;
//       const accessTokenExpires = new Date(+expiredTime * 1000);
//       setCookie(event, TOKEN_EXPIRED_TIME, expiredTime.toString(), {
//         secure: true,
//         sameSite: "lax",
//         expires: accessTokenExpires,
//       });
//     }

//     const currentTime = Math.floor(Date.now() / 1000) + 1;
//     if (Number(expiredTime) < currentTime) {
//       return false;
//     }
//   } catch (error) {
//     return false;
//   }
//   return true;
// };

export const isTokenValid = (expTime: string | null) => {
  if (!expTime) return false;
  console.log(expTime);
  const currentTime = Math.floor(Date.now() / 1000);
  if (Number(expTime) < currentTime) {
    return false;
  }
  return true;
};

export const refreshTokenFunc = async (event: H3Event, apiUrl: string) => {
  const target = joinURL(apiUrl, "refreshToken");
  const { cookiePath } = useRuntimeConfig().public;
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
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: accessTokenExpires,
      });
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
};
