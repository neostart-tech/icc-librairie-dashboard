import { defineStore } from "pinia";

export interface Stock {
  id: number;
  livre_id: number;
  quantite: number;
  livre?: any;
}

export interface StockMouvement {
  id: number;
  livre_id: number;
  type: "entree" | "sortie";
  quantite: number;
  commentaire?: string;
  created_at: string;
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
        this.stocks = await $api("/stocks");
      } catch (error) {
        console.error("Erreur fetchStocks", error);
      } finally {
        this.loading = false;
      }
    },

    /** ======================
     * STOCK D’UN LIVRE
     ======================= */
    async fetchStockByLivre(livreId: number) {
      const { $api } = useNuxtApp();
      this.loading = true;

      try {
        this.stock = await $api(`/stocks/${livreId}`);
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
    async fetchMouvements(livreId: number) {
      const { $api } = useNuxtApp();
      this.loading = true;

      try {
        this.mouvements = await $api(`/stocks/${livreId}/mouvements`);
      } catch (error) {
        console.error("Erreur fetchMouvements", error);
      } finally {
        this.loading = false;
      }
    },

    /** ======================
     * AJOUT MOUVEMENT
     ======================= */
    async addMouvement(payload: {
      livre_id: number;
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
