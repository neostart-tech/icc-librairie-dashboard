// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css", "@bhplugin/vue3-datatable/dist/style.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      apiBase: "https://api-librairie.icctogo.com/api",
      storageBase: "https://api-librairie.icctogo.com/storage",
    },
  },

  modules: ["@pinia/nuxt", "nuxt-toast", "nuxt-swal"],
});
