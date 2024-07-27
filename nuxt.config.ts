// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      environment: process.env.NODE_ENV,
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    cssPath: "@/assets/scss/global.scss",
    configPath: "tailwind.config.js",
    viewer: false,
  },
  ssr: false,
  app: {
    head: {
      link: [
        {
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
          rel: "stylesheet",
        },
      ],

      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
      ],
      title: "Control Panel",
    },
  },

  //loại bỏ tag name để sử dụng component
  // vue: {
  //   compilerOptions: {
  //     isCustomElement: (tag) => ["ion-icon"].includes(tag),
  //   },
  // },
  //khai báo name để sử dụng nested route
  // hooks: {
  //   "pages:extend"(pages) {
  //     pages.push({
  //       name: "route-pre-post",
  //       path: "/route/:pre/:post/:id",
  //       file: "~/pages/route/[pre]/[post]/[id].vue",
  //     });
  //   },
  // },
});
