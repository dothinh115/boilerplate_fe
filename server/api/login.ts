import { H3Event, createError } from "h3";
import { joinURL } from "ufo";
import { REFRESH_TOKEN } from "@/utils/constants";

export default defineEventHandler(async (event: H3Event) => {
  const { apiUrl } = useRuntimeConfig().public; // Lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); // Bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); // Ghép thành api hoàn chỉnh

  // Lấy phương thức HTTP và headers từ yêu cầu ban đầu
  const method = event.node.req.method;
  const headers: Record<string, string> = {};
  //bên trong headers có 1 vài giá trị là string nên ko thể đưa vào request dc mà phải chuyển nó về thành chuỗi
  for (const [key, value] of Object.entries(event.node.req.headers)) {
    if (typeof value === "string" && key.toLowerCase() !== "connection") {
      headers[key] = value;
    } else if (Array.isArray(value) && key.toLowerCase() !== "connection") {
      headers[key] = value.join(", ");
    }
  }

  const body = await readBody(event);

  try {
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
    if (!response.ok) {
      throw createError({
        message: responseData.message,
        statusCode: status,
      });
    }
    const { refreshToken } = responseData.data;
    setCookie(event, REFRESH_TOKEN, refreshToken);
    event.node.res.statusCode = status;
    return event.node.res.end(JSON.stringify(responseData));
  } catch (error: any) {
    console.error("Error Details:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    event.node.res.statusCode = statusCode;
    return event.node.res.end(JSON.stringify({ message, statusCode }));
  }
});
