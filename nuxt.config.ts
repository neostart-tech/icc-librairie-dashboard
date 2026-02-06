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
		},
	},

	modules: ["@pinia/nuxt"],
});
