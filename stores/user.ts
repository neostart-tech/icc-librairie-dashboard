import { defineStore } from "pinia";

interface ApiError {
	message: string;
	errors?: Record<string, string[]>;
}

function parseApiError(error: any): ApiError {
	const data = error?.response?._data || error?.data || error;

	return {
		message: data?.message || "Une erreur est survenue.",
		errors: data?.errors,
	};
}

export const useUserStore = defineStore("user", {
	state: () => ({
		user: null as any,
		loading: false,
	}),

	getters: {
		isAuthenticated: (state) => !!state.user,
	},

	actions: {
		/**
		 * Récupérer le profil connecté
		 * GET /profil
		 */
		async fetchProfile() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/profil", {
					method: "GET",
				});

				// compatible UserResource Laravel
				this.user = res.data ?? res;
				return this.user;
			} catch (error: any) {
				throw parseApiError(error);
			} finally {
				this.loading = false;
			}
		},

		/**
		 * Mise à jour du profil
		 * PUT /profil
		 */
		async updateProfile(data: {
			nom?: string;
			prenom?: string;
			email?: string;
			telephone?: string;
		}) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/profil", {
					method: "PUT",
					body: data,
				});

				this.user = res.data;
				return res;
			} catch (error: any) {
				throw parseApiError(error);
			} finally {
				this.loading = false;
			}
		},

		/**
		 * Changer le mot de passe
		 * PUT /profil/password
		 */
		async updatePassword(data: {
			current_password: string;
			new_password: string;
		}) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/profil/password", {
					method: "PUT",
					body: data,
				});

				return res;
			} catch (error: any) {
				throw parseApiError(error);
			} finally {
				this.loading = false;
			}
		},

		/**
		 * Initialisation depuis localStorage
		 * (utile si authStore déjà chargé)
		 */
		init() {
			if (!process.client) return;

			const user = localStorage.getItem("user");
			if (user) this.user = JSON.parse(user);
		},
	},
});
