import { defineStore } from "pinia";

export interface Gateway {
	id: number;
	semoa_id: string;
	libelle: string;
	logo_url?: string;
	actif: boolean;
}

export const useGatewayStore = defineStore("gateway", {
	state: () => ({
		gateways: [] as Gateway[],
		loading: false,
	}),

	getters: {
		gatewayMap: (state) => {
			if (!Array.isArray(state.gateways)) return {}; // sécurité
			const map: Record<string, { libelle: string; logo_url?: string }> = {};
			state.gateways.forEach((g) => {
				map[g.semoa_id] = { libelle: g.libelle, logo_url: g.logo_url };
			});
			return map;
		},
	},

	actions: {
		async fetchGateways() {
			this.loading = true;
			try {
				const { $api } = useNuxtApp();
				const res = await $api("/gateways");

				// s'assurer que gateways est un tableau
				this.gateways = Array.isArray(res) ? res : (res.data ?? []);
			} catch (e) {
				console.error("Erreur fetchGateways", e);
				this.gateways = [];
			} finally {
				this.loading = false;
			}
		},
	},
});
