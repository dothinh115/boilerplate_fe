// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      cookiePath: process.env.COOKIE_PATH,
      google_client_id: process.env.OAUTH_CLIENT_ID,
    },
    private: {
      apiUrl: process.env.API_URL,
      google__oauth_secret: process.env.OAUTH_SECRET,
    },
  },

  modules: ["@nuxtjs/tailwindcss"],

  tailwindcss: {
    cssPath: "@/assets/scss/global.scss",
    configPath: "tailwind.config.js",
    viewer: false,
  },

  ssr: false,

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
  app: {
    head: {
      link: [
        {
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
          rel: "stylesheet",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Maitree:wght@500;700&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,500;1,400&display=swap",
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

  compatibilityDate: "2025-04-22",
});