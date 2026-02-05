import { useAuthStore } from "~~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
	const auth = useAuthStore();
	const config = useRuntimeConfig();

	const api = $fetch.create({
		baseURL: config.public.apiBase,
		headers: {
			Accept: "application/json",
		},

		onRequest({ options }) {
			// Si le store n'est pas encore initialisé
			if (!auth.token && process.client) {
				auth.init();
			}

			if (auth.token) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${auth.token}`,
				};
			}
		},

		onResponseError({ response }) {
			if (response.status === 401) {
				// juste nettoyer le token
				auth.token = null;
				auth.user = null;

				if (process.client) {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
				}

				// IMPORTANT : relancer l'erreur
				throw response._data;
			}

			throw response._data;
		},
	});

	return {
		provide: {
			api,
		},
	};
});
