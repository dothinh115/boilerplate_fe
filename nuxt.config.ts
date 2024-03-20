// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    cssPath: "@/assets/scss/global.scss",
    configPath: "tailwind.config.js",
    viewer: false,
  },
  ssr: false,
  app: {
    head: {
      script: [
        {
          src: "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js",
          type: "module",
        },
      ],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ["ion-icon"].includes(tag),
    },
  },
});
