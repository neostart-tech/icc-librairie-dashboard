import { defineStore } from "pinia";

export interface Image {
	id: string;
	path: string;
}

export interface Livre {
	id: string;
	titre: string;
	auteur?: string;
	description?: string;
	prix: number;
	prix_promo?: number;
	categorie_id: string;
	id_auteur?: string;
	image?: string;
	categorie?: any;
	auteurRel?: any;
	stock?: any;
	is_selection_mois: boolean;
	is_selection_mois_precedent: boolean;
	is_vogue: boolean;
}

export const useLivreStore = defineStore("livre", {
	/* =========================
   * STATE
   ========================= */
	state: () => ({
		livres: [] as Livre[],
		livre: null as Livre | null,
		loading: false,
	}),

	getters: {
		isLoading: (state) => state.loading,

		getCoverImage: (state) => (livre: Livre) => {
			const config = useRuntimeConfig();
			return livre.image
				? `${config.public.storageBase}/${livre.image}`
				: "/images/livre.jpg";
		},
	},

	/* =========================
   * ACTIONS
   ========================= */
	actions: {
		/** ======================
     * LISTE DES LIVRES
     ======================= */
		async fetchLivres() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/livres");
				this.livres = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
			} catch (error) {
				console.error("Erreur fetchLivres", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * LIVRES MIS EN AVANT
     ======================= */
		async fetchFeatured() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/livres/featured");
				return res?.data ?? res;
			} catch (error) {
				console.error("Erreur fetchFeatured", error);
				return null;
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * DETAIL LIVRE
     ======================= */
		async fetchLivre(id: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/livres/${id}`);
				const data: Livre = res?.data ?? res;
				this.livre = data; 
				return data;
			} catch (error) {
				console.error("Erreur fetchLivre", error);
				return null;
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * CREATION LIVRE (ADMIN)
     ======================= */
		async createLivre(payload: {
			titre: string;
			auteur?: string;
			description?: string;
			prix: number;
			prix_promo?: number;
			categorie_id: number;
			id_auteur?: string;
			image?: File;
			is_selection_mois?: boolean;
			is_selection_mois_precedent?: boolean;
			is_vogue?: boolean;
		}) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const formData = new FormData();

				formData.append("titre", payload.titre);
				formData.append("prix", payload.prix.toString());
				formData.append("categorie_id", payload.categorie_id.toString());
				if (payload.id_auteur) formData.append("id_auteur", payload.id_auteur);

				if (payload.auteur) formData.append("auteur", payload.auteur);
				if (payload.description) {
					formData.append("description", payload.description);
				}
				if (payload.prix_promo !== undefined) {
					formData.append("prix_promo", payload.prix_promo.toString());
				}

				if (payload.is_selection_mois !== undefined) formData.append("is_selection_mois", payload.is_selection_mois ? "1" : "0");
				if (payload.is_selection_mois_precedent !== undefined) formData.append("is_selection_mois_precedent", payload.is_selection_mois_precedent ? "1" : "0");
				if (payload.is_vogue !== undefined) formData.append("is_vogue", payload.is_vogue ? "1" : "0");

				if (payload.image) {
					formData.append("image", payload.image);
				}

				const res: any = await $api("/livres", {
					method: "POST",
					body: formData,
				});

				const newLivre: Livre = res.data ?? res;
				this.livres.unshift(newLivre);
				return newLivre;
			} catch (error: any) {
				throw error?.data || error;
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * UPDATE LIVRE (ADMIN)
     ======================= */
		async updateLivre(
			id: string,
			payload: Partial<{
				titre: string;
				auteur: string;
				description: string;
				prix: number;
				prix_promo: number;
				categorie_id: number;
				id_auteur: string;
				image: File;
				is_selection_mois: boolean;
				is_selection_mois_precedent: boolean;
				is_vogue: boolean;
			}>,
		) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const formData = new FormData();

				Object.entries(payload).forEach(([key, value]) => {
					if (value === undefined || value === null) return;

					if (key === "image" && value instanceof File) {
						formData.append("image", value);
					} else if (typeof value === "number" || typeof value === "string") {
						formData.append(key, value.toString());
					} else if (typeof value === "boolean") {
						formData.append(key, value ? "1" : "0");
					} else {
						formData.append(key, value);
					}
				});

				const res: any = await $api(`/livres/${id}`, {
					method: "POST",
					body: formData,
				});

				const updatedLivre: Livre = res.data ?? res;
				const index = this.livres.findIndex((l) => l.id === id);
				if (index !== -1) this.livres[index] = updatedLivre;

				this.livre = updatedLivre;
				return updatedLivre;
			} catch (error: any) {
				throw error?.data || error;
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * DELETE LIVRE (ADMIN)
     ======================= */
		async deleteLivre(id: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				await $api(`/livres/${id}`, { method: "DELETE" });

				this.livres = this.livres.filter((l) => l.id !== id);
				if (this.livre?.id === id) this.livre = null;
			} catch (error) {
				console.error("Erreur suppression livre", error);
			} finally {
				this.loading = false;
			}
		},
	},
});
