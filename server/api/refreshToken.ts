import { H3Event, setCookie } from "h3";
import { joinURL } from "ufo";
import { ACCESS_TOKEN, TOKEN_EXPIRED_TIME } from "@/utils/constants";
import { jwtDecode } from "jwt-decode";

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; // Lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); // Bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); // Ghép thành api hoàn chỉnh

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
        const { accessToken } = responseData.data;
        const accessTokenDecoded: any = jwtDecode(accessToken);
        const accessTokenExpires = new Date(accessTokenDecoded.exp * 1000);

        setCookie(event, ACCESS_TOKEN, accessToken, {
          secure: true,
          sameSite: "lax",
          expires: accessTokenExpires,
        });
        setCookie(event, TOKEN_EXPIRED_TIME, accessTokenDecoded.exp, {
          secure: true,
          sameSite: "lax",
          expires: accessTokenExpires,
        });
        const status = response.status;
        event.node.res.end(
          JSON.stringify({
            statusCode: status,
            message: "Refresh token thành công!",
          })
        );
      }
    },
  });
});
