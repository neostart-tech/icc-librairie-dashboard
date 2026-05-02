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
	type_livraison: "livraison" | "retrait";
	adresse_livraison?: string;
	numero_livraison?: string;
	frais_livraison: number;
	statut: "en_cours" | "en_attente_validation" | "valide" | "paiement_refuse" | "traite";
	preuve_paiement?: string;
	reference_paiement_client?: string;
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
		 *  TOUTES LES COMMANDES (ADMIN)
		 ======================= */
		async fetchAllOrders() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/commandes/all");
				this.commandes = res?.data?.data || (Array.isArray(res?.data) ? res.data : []);
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
		 *  VALIDER PAIEMENT (ADMIN)
		 ======================= */
		async validerPaiement(id: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/commandes/${id}/valider-paiement`, {
					method: "POST",
				});
				await this.fetchAllOrders();
				return res;
			} finally {
				this.loading = false;
			}
		},

		/** ======================
		 *  REFUSER PAIEMENT (ADMIN)
		 ======================= */
		async refuserPaiement(id: string, motif: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/commandes/${id}/refuser-paiement`, {
					method: "POST",
					body: { motif },
				});
				await this.fetchAllOrders();
				return res;
			} finally {
				this.loading = false;
			}
		},

		/** ======================
		 *  FINALISER COMMANDE (ADMIN)
		 ======================= */
		async finaliserCommande(id: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/commandes/${id}/finaliser`, {
					method: "POST",
				});
				await this.fetchAllOrders();
				return res;
			} finally {
				this.loading = false;
			}
		},

		/** ======================
		 *  VENTE COMPTOIR (ADMIN)
		 ======================= */
		async venteComptoir(payload: any) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/commandes/vente-comptoir", {
					method: "POST",
					body: payload,
				});
				await this.fetchAllOrders();
				return res;
			} finally {
				this.loading = false;
			}
		},
	},
});
