import { joinURL } from "ufo";
import { H3Event } from "h3";
import {
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
  REFRESH_TOKEN,
  CLIENT_ID,
} from "@/utils/constants";
import { jwtDecode } from "jwt-decode";

//hàm check token valid
const isTokenValid = (event: H3Event) => {
  const accessToken = getCookie(event, ACCESS_TOKEN); //lấy accessToken từ cookie
  if (!accessToken) return false;

  //lấy exp time từ cookie
  let expiredTime: string | number | undefined = getCookie(
    event,
    TOKEN_EXPIRED_TIME
  );

  try {
    //nếu ko có exp time thì decode token lấy và set luôn vào cookie
    if (!expiredTime) {
      const decoded = jwtDecode(accessToken);
      if (!decoded.exp) return false;
      expiredTime = decoded.exp;
      const accessTokenExpires = new Date(+expiredTime * 1000);
      setCookie(event, TOKEN_EXPIRED_TIME, expiredTime.toString(), {
        secure: true,
        sameSite: "lax",
        expires: accessTokenExpires,
      });
    }
    //so sánh thời gian hiện tại và exp time, nếu đã hết hạn thì return false

    const currentTime = Math.floor(Date.now() / 1000) + 1;
    if (Number(expiredTime) < currentTime) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
};

//logic refresh token
const refreshTokenFunc = async (event: H3Event, apiUrl: string) => {
  const target = joinURL(apiUrl, "refreshToken"); //ghép api refreshToken hoàn chỉnh
  const refreshToken = getCookie(event, REFRESH_TOKEN); //lấy refreshToken từ cookie
  const clientId = getCookie(event, CLIENT_ID); //lấy clientId từ cookie
  const body = {
    refreshToken,
    clientId,
  };
  //nếu ko có token hoặc clientId thì trả lỗi
  if (!refreshToken || !clientId) {
    throw createError({
      statusCode: 400,
      message: "Token không hợp lệ!",
    });
  }

  try {
    //khi có cả 2 rồi thì tiến hành post api để renew access token
    const response: any = await $fetch(target, {
      method: "POST",
      body,
    });

    const accessToken = response.data.accessToken;

    if (accessToken) {
      const accessTokenDecoded: any = jwtDecode(accessToken);
      const accessTokenExpires = new Date(accessTokenDecoded.exp * 1000);
      //lần lượt set cookie cho access token và exp time
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
      return accessToken; //trả ra accessToken mới để gắn vào headers vì token cũ đã hết hạn
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

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; //lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); //ghép thành api hoàn chỉnh
  let accessToken = getCookie(event, ACCESS_TOKEN); //lấy access token từ cookie
  const refreshToken = getCookie(event, REFRESH_TOKEN);

  const tokenValid = isTokenValid(event);
  //refresh token nếu cần
  if (refreshToken && !tokenValid) {
    const newAccessToken = await refreshTokenFunc(event, apiUrl);
    if (!newAccessToken) {
      throw createError({
        statusCode: 400,
        message: "Refresh token thất bại!",
      });
    }
    //nếu token cũ hết hạn thì phải set lại token mới vào biến
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
