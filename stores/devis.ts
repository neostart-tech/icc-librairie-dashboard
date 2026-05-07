import { defineStore } from "pinia";

export interface Devis {
	id: string;
	livre_id: string;
	nom_complet: string;
	telephone: string;
	email?: string | null;
	nombre_exemplaires: number;
	message?: string | null;
	statut: "nouveau" | "traite" | "refuse";
	created_at: string;
	updated_at: string;
	livre?: any;
}

export const useDevisStore = defineStore("devis", {
	state: () => ({
		devis: [] as Devis[],
		loading: false,
	}),

	actions: {
		async fetchDevis() {
			const { $api } = useNuxtApp();
			this.loading = true;
			try {
				const res: any = await $api("/devis");
				this.devis = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
			} catch (error) {
				console.error("Erreur fetchDevis", error);
			} finally {
				this.loading = false;
			}
		},

		async fetchDevisDetail(id: string): Promise<Devis | null> {
			const { $api } = useNuxtApp();
			this.loading = true;
			try {
				const res: any = await $api(`/devis/${id}`);
				return res?.data ?? res;
			} catch (error) {
				console.error("Erreur fetchDevisDetail", error);
				return null;
			} finally {
				this.loading = false;
			}
		},

		async updateStatut(id: string, statut: "nouveau" | "traite" | "refuse") {
			const { $api } = useNuxtApp();
			this.loading = true;
			try {
				const res: any = await $api(`/devis/${id}/statut`, {
					method: "PUT",
					body: { statut },
				});
				const updated: Devis = res?.data ?? res;
				const index = this.devis.findIndex((d) => d.id === id);
				if (index !== -1) this.devis[index] = updated;
				return updated;
			} catch (error: any) {
				throw error?.data || error;
			} finally {
				this.loading = false;
			}
		},
	},
});
