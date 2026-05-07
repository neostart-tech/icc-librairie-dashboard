import { defineStore } from "pinia";

export interface Stock {
	id: string;
	livre_id: string;
	quantite: number;
	livre?: any;
}

export interface StockMouvement {
	id: string;
	livre_id: string;
	type: "entree" | "sortie";
	quantite: number;
	commentaire?: string;
	created_at: string;
	livre?: {
		id: string;
		titre: string;
		images?: {
			id: number;
			path: string;
		}[];
	};
}

export const useStockStore = defineStore("stock", {
	/* =========================
   * STATE
   ========================= */
	state: () => ({
		stocks: [] as Stock[],
		stock: null as Stock | null,
		mouvements: [] as StockMouvement[],
		loading: false,
	}),

	/* =========================
   * ACTIONS
   ========================= */
	actions: {
		/** ======================
     * LISTE DES STOCKS
     ======================= */
		async fetchStocks() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api("/stocks");
				this.stocks = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
			} catch (error) {
				console.error("Erreur fetchStocks", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * STOCK D’UN LIVRE
     ======================= */
		async fetchStockByLivre(livreId: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/stocks/${livreId}`);
				this.stock = res?.data ?? res;
				return this.stock;
			} catch (error) {
				console.error("Erreur fetchStockByLivre", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * MOUVEMENTS DU LIVRE
     ======================= */
		async fetchMouvements(livreId: string) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res: any = await $api(`/stocks/${livreId}/mouvements`);
				this.mouvements = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
			} catch (error) {
				console.error("Erreur fetchMouvements", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * MOUVEMENTS DES LIVRES
     ======================= */
		async fetchAllMouvements() {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const response: any = await $api("/stocks/mouvements");
				this.mouvements = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
			} catch (error) {
				console.error("Erreur fetchAllMouvements", error);
			} finally {
				this.loading = false;
			}
		},

		/** ======================
     * AJOUT MOUVEMENT
     ======================= */
		async addMouvement(payload: {
			livre_id: string;
			type: "entree" | "sortie";
			quantite: number;
			commentaire?: string;
		}) {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const res = await $api("/stocks/mouvement", {
					method: "POST",
					body: payload,
				});

				// sync local stock
				if (this.stock?.livre_id === payload.livre_id) {
					this.stock.quantite = res.stock.quantite;
				}

				return res;
			} catch (error: any) {
				throw error?.data || error;
			} finally {
				this.loading = false;
			}
		},
	},
});
