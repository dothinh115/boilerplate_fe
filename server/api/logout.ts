import {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  TOKEN_EXPIRED_TIME,
  CLIENT_ID,
} from "@/utils/constants";

export default defineEventHandler(async (event) => {
  const { cookiePath } = useRuntimeConfig().public;

  deleteCookie(event, REFRESH_TOKEN, {
    domain: cookiePath,
    path: "/",
    secure: true,
  });
  deleteCookie(event, ACCESS_TOKEN, {
    domain: cookiePath,
    path: "/",
    secure: true,
  });
  deleteCookie(event, TOKEN_EXPIRED_TIME, {
    domain: cookiePath,
    path: "/",
    secure: true,
  });
  deleteCookie(event, CLIENT_ID, {
    domain: cookiePath,
    path: "/",
    secure: true,
  });
});
