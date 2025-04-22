import { jwtDecode } from "jwt-decode";
import {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
} from "@/utils/constants";

export default defineEventHandler(async (event) => {
  const { state, code } = getQuery(event);
  const { cookiePath } = useRuntimeConfig().public; // Lấy api thực từ env
  const client_id = useRuntimeConfig().public.google_client_id;
  const client_secret = useRuntimeConfig().private.google_oauth_secret;
  const callback_uri = useRuntimeConfig().private.google_callback_uri;
  const apiUrl = useRuntimeConfig().private.apiUrl;
  const { redirectTo } = JSON.parse(state as string);
  try {
    const tokenData: any = await $fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: {
        client_id,
        client_secret,
        code,
        grant_type: "authorization_code",
        redirect_uri: callback_uri,
      },
    });

    const { access_token } = tokenData;
    const loginData: any = await $fetch(`${apiUrl}/auth/google`, {
      query: {
        access_token,
      },
    });
    const { refreshToken, accessToken } = loginData.data;
    const accessTokenDecoded: any = jwtDecode(accessToken);
    const refreshTokenDecoded: any = jwtDecode(refreshToken);
    const accessTokenExpires = new Date(accessTokenDecoded.exp * 1000);
    const refreshTokenExpires = new Date(refreshTokenDecoded.exp * 1000);
    setCookie(event, REFRESH_TOKEN, refreshToken, {
      domain: cookiePath,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: refreshTokenExpires,
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
    return await sendRedirect(event, redirectTo);
  } catch (error) {
    console.log(error);
  }
});
