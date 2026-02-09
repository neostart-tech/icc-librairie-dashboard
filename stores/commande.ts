import { defineStore } from "pinia";

interface User {
	id: string;
	nom: string;
	prenom: string;
	email: string;
}

interface Livre {
	id: string;
	titre: string;
	prix: number;
	prix_promo?: number | null;
	image?: string;
}

interface DetailCommande {
	id: string;
	quantite: number;
	prix_unitaire: number;
	livre_id: string;
	livre?: Livre;
}

interface Paiement {
	id: string;
	moyen_paiement: number;
	reference_transaction: string;
	montant: number;
	statut: "pending" | "success" | "failed";
	created_at: string;
}

export interface Commande {
	id: string;
	reference: string;
	prix_total: number;
	statut: "en_cours" | "termine" | "traite";
	created_at: string;

	user?: User;
	detailcommandes?: DetailCommande[];
	paiements?: Paiement[];
}

interface ApiError {
	message?: string;
	errors?: Record<string, string[]>;
}

export const useCommandeStore = defineStore("commande", {
	state: () => ({
		commandes: [] as Commande[],
		commande: null as Commande | null,
		loading: false,
	}),

	actions: {
		/** ======================
		 *  MES COMMANDES (USER)
		 ======================= */
		async fetchMyOrders() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/commandes");
				this.commandes = Array.isArray(res?.data) ? res.data : [];
			} catch (error) {
				console.error("Erreur fetchMyOrders", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
		 *  TOUTES LES COMMANDES (ADMIN)
		 ======================= */
		async fetchAllOrders() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/commandes/all");
				this.commandes = Array.isArray(res?.data) ? res.data : [];
			} catch (error) {
				console.error("Erreur fetchAllOrders", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
		 *  DETAIL COMMANDE
		 ======================= */
		async fetchCommande(id: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/commandes/${id}`);
				this.commande = res?.data ?? null;
				return res;
			} catch (error) {
				console.error("Erreur fetchCommande", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
		 *  TRAITER UNE COMMANDE
		 ======================= */
		async traiterCommande(id: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/commandes/${id}/traiter`, {
					method: "PUT",
				});

				// Met à jour la commande dans la liste
				const index = this.commandes.findIndex((c) => c.id === id);
				if (index !== -1) {
					this.commandes[index].statut = "traite";
				}

				// Met à jour la commande courante si ouverte
				if (this.commande?.id === id) {
					this.commande.statut = "traite";
				}

				return res;
			} finally {
				this.loading = false;
			}
		},

		/** ======================
		 *  CREER UNE COMMANDE
		 ======================= */
		async createCommande(payload: {
			phone: string;
			gateway_id: number;
			livres: {
				livre_id: string;
				quantite: number;
			}[];
		}) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/commandes", {
					method: "POST",
					body: payload,
				});

				/**
				 * res = {
				 *  success: true,
				 *  payment_url: string
				 * }
				 */
				return res;
			} catch (error: any) {
				throw {
					message:
						error?.data?.message || "Erreur lors de la création de la commande",
					errors: error?.data?.errors,
				} as ApiError;
			} finally {
				this.loading = false;
			}
		},
	},
});
