import { joinURL } from "ufo";
export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig().public; //lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); //ghép thành api hoàn chỉnh
  const body = await readBody(event);

  try {
    const response: any = await $fetch(target, {
      method: "POST",
      body,
    });
    event.node.res.setHeader("Content-Type", "application/json; charset=utf-8");

    return event.node.res.end(response.data);
  } catch (error: any) {
    throw createError({ ...error });
  }
});
