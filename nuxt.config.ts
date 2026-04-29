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
      apiBase: "http://localhost:8000/api",
      storageBase: "http://localhost:8000/storage",
      // apiBase: "https://api-librairie.icctogo.com/api",
      // storageBase: "https://api-librairie.icctogo.com/storage",
    },
  },

  app: {
    head: {
      title: "ICC Librairie | Gestion des livres",
      meta: [
        {
          name: "description",
          content: "Gestion des livres de la librairie ICC",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/logo/logo_librairie(1).png" },
        // Google Fonts
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&display=swap",
        },
      ],
    },
  },

  modules: ["@pinia/nuxt", "nuxt-toast", "nuxt-swal"],
});
