// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@vite-pwa/nuxt",
    "@pinia/nuxt",
    "@ant-design-vue/nuxt",
    "@ant-design-vue/nuxt",
  ],
  css: ["@/app/normalize.min.css", "@/app/global.css"],

  imports: {
    dirs: ["shared/composables", "shared/utils"],
  },

  dir: {
    pages: "routes",
  },

  components: {
    dirs: [
      {
        path: "~/shared/components",
        pathPrefix: false,
      },
    ],
  },
});
