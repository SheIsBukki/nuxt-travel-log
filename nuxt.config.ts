import tailwindcss from "@tailwindcss/vite";

import "./lib/env.ts";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "nuxt-csurf",
    "nuxt-maplibre",
  ],

  eslint: {
    config: {
      standalone: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "maplibre-gl",
      ],
    },
    server: { watch: { ignored: ["./docker-data/*"] } },
  },
  colorMode: { dataValue: "theme" },
});
