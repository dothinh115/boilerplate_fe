import { H3Event } from "h3";
import { joinURL } from "ufo";
import { REFRESH_TOKEN } from "@/utils/constants";

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; // Lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); // Bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); // Ghép thành api hoàn chỉnh

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

  const body = await readBody(event);
  const response = await fetch(target, {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  const status = response.status;
  response.headers.forEach((value, name) => {
    event.node.res.setHeader(name, value);
  });
  const responseData = await response.json();
  const { refreshToken, accessToken } = responseData.data;
  setCookie(event, REFRESH_TOKEN, refreshToken);
  event.node.res.statusCode = status;
  event.node.res.setHeader("Content-Type", "application/json");
  event.node.res.end(
    JSON.stringify({ ...responseData, data: { accessToken } })
  );
});
