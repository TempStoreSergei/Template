// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@ant-design-vue/nuxt",
    "@nuxtjs/i18n",
  ],
  css: ["~/app/styles/index.scss"],

  ssr: false,

  imports: {
    dirs: ["shared/composables", "shared/utils"],
  },

  dir: {
    pages: "routes",
  },

  alias: {
    "@": resolve(__dirname, "./src"),
  },

  components: {
    dirs: [
      {
        path: "~/shared/components",
        pathPrefix: false,
      },
    ],
  },

  compatibilityDate: "2024-08-28",
});
