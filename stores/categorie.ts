import { defineStore } from "pinia";

interface Categorie {
	id: number;
	libelle: string;
	description?: string | null;
	order: number;
	created_at?: string;
}

interface ApiError {
	message?: string;
	errors?: Record<string, string[]>;
}

export const useCategorieStore = defineStore("categorie", {
	state: () => ({
		categories: [] as Categorie[],
		categorie: null as Categorie | null,
		loading: false,
	}),

	actions: {
		/** ======================
     *  LISTE DES CATEGORIES
     ======================= */
		async fetchCategories() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res = await $api("/categories");
				this.categories = Array.isArray(res?.data) ? res.data : [];
			} catch (error) {
				console.error("Erreur fetchCategories", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     *  DETAIL CATEGORIE
     ======================= */
		async fetchCategorie(id: number) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res = await $api(`/categories/${id}`);
				this.categorie = res?.data ?? null;
			} catch (error) {
				console.error("Erreur fetchCategorie", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     *  CREATION (ADMIN)
     ======================= */
		async createCategorie(libelle: string, description: string | null = null, order: number = 0) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/categories", {
					method: "POST",
					body: {
						libelle,
						description,
						order,
					},
				});

				this.categories.unshift(res.data);
				return res;
			} catch (error: any) {
				throw {
					message: error?.data?.message || "Erreur lors de la création",
					errors: error?.data?.errors,
				};
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     *  UPDATE (ADMIN)
     ======================= */
		async updateCategorie(
			id: number,
			libelle: string,
			description: string | null = null,
			order: number = 0,
		) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/categories/${id}`, {
					method: "PUT",
					body: {
						libelle,
						description,
						order,
					},
				});

				const index = this.categories.findIndex((c) => c.id === id);
				if (index !== -1) {
					this.categories[index] = res.data;
				}

				return res;
			} catch (error: any) {
				throw {
					message: error?.data?.message || "Erreur lors de la mise à jour",
					errors: error?.data?.errors,
				};
			} finally {
				this.loading = false;
			}
		},
		/** ======================
     *  DELETE (ADMIN)
     ======================= */
		async deleteCategorie(id: number) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				await $api(`/categories/${id}`, {
					method: "DELETE",
				});

				this.categories = this.categories.filter((c) => c.id !== id);
			} catch (error) {
				console.error("Erreur suppression catégorie", error);
			} finally {
				this.loading = false;
			}
		},

		async reorderCategories(orders: { id: string; order: number }[]) {
			const { $api } = useNuxtApp();
			this.loading = true;
			try {
				await $api("/categories/reorder", {
					method: "POST",
					body: { orders },
				});
			} catch (error: any) {
				throw error?.data || error;
			} finally {
				this.loading = false;
			}
		},
	},
});
