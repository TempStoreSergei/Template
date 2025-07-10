// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@ant-design-vue/nuxt",
    "@nuxtjs/i18n",
  ],
  css: ["~/app/styles/index.scss"],

  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        },
        {
          rel: "stylesheet", 
          href: "https://fonts.googleapis.com/icon?family=Material+Icons"
        }
      ]
    }
  },

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

  vite: {
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ["@material/web/all.js"],
    },
    build: {
      rollupOptions: {
        external: ["@material/web/all.js"],
      },
    },
  },

  compatibilityDate: "2024-08-28",

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("md-"),
    },
  },
});
