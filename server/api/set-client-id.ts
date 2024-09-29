import { CLIENT_ID } from "@/utils/constants";

export default defineEventHandler(async (event) => {
  const { cookiePath } = useRuntimeConfig().public;

  const { clientId } = await readBody(event);
  setCookie(event, CLIENT_ID, clientId, {
    domain: cookiePath,
    secure: true,
    sameSite: "lax",
  });
  event.node.res.setHeader("Content-Type", "application/json; charset=utf-8");

  event.node.res.end(
    JSON.stringify({ statusCode: 200, message: "Set clientId thành công!" })
  );
});
