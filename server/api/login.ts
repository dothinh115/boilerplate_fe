import { H3Event } from "h3";
import { joinURL } from "ufo";
import { REFRESH_TOKEN } from "@/utils/constants";

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
        const { refreshToken } = responseData.data;
        setCookie(event, REFRESH_TOKEN, refreshToken);
        event.node.res.end(JSON.stringify(responseData));
      }
    },
  });
});
