import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@hebilicious/authjs-nuxt",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/fonts",
  ],
  fonts: {
    experimental: {
      processCSSVariables: true,
    },
  },
  icon: {
    provider: "iconify",
    serverBundle: {
      collections: ["mdi"],
    },
  },
  image: {},
  dir: {
    pages: "app/pages",
    layouts: "app/layouts",
    middleware: "app/middleware",
  },
  alias: {
    "~/types": fileURLToPath(new URL("./types", import.meta.url)),
    "~/server": fileURLToPath(new URL("./server", import.meta.url)),
    cookie: resolve(__dirname, "node_modules/cookie"),
    "~/lib": resolve(__dirname, "./lib"),
  },
  runtimeConfig: {
    authJs: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    spotify: {
      clientId: process.env.AUTH_SPOTIFY_ID,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET,
    },
    public: {
      authJs: {
        baseUrl: process.env.AUTH_BASE_URL,
        verifyClientOnEveryRequest: true,
      },
    },
  },
  components: {
    dirs: [
      {
        path: "app/components",
        global: true,
      },
      "app/components",
    ],
  },
});
