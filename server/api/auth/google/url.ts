import { joinURL } from "ufo";
import { CLIENT_ID } from "@/utils/constants";
export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig().public; //lấy api thực từ env
  const replacedPath = event.path.replace(/^\/api\//, ""); //bỏ prefix /api
  const target = joinURL(apiUrl, replacedPath); //ghép thành api hoàn chỉnh
  const clientId = getCookie(event, CLIENT_ID);
  const body = await readBody(event);
  const modifiedBody = {
    ...body,
    clientId,
  };
  console.log(target);
  try {
    const response: any = await $fetch(target, {
      method: "POST",
      body: modifiedBody,
    });
    console.log("response", response);
    return event.node.res.end(response.data);
  } catch (error: any) {
    throw createError({ ...error });
  }
});
