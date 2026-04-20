import { defineStore } from 'pinia';

export const useAuteurStore = defineStore('auteur', {
    state: () => ({
        auteurs: [] as any[],
        loading: false,
    }),
    actions: {
        async fetchAuteurs() {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                const res = await $api('/auteurs');
                this.auteurs = res?.data ?? [];
            } finally {
                this.loading = false;
            }
        },
        async createAuteur(nom: string, biographie: string | null, bibliographie: string | null) {
            const { $api } = useNuxtApp();
            try {
                const res: any = await $api('/auteurs', {
                    method: 'POST',
                    body: {
                        nom,
                        biographie,
                        bibliographie,
                    },
                });
                this.auteurs.unshift(res.data);
                return res;
            } catch (error: any) {
                throw error?.data || error;
            }
        },
        async updateAuteur(id: string, nom: string, biographie: string | null, bibliographie: string | null) {
            const { $api } = useNuxtApp();
            try {
                const res: any = await $api(`/auteurs/${id}`, {
                    method: 'PUT',
                    body: {
                        nom,
                        biographie,
                        bibliographie,
                    },
                });
                const index = this.auteurs.findIndex((a) => a.id === id);
                if (index !== -1) this.auteurs[index] = res.data;
                return res;
            } catch (error: any) {
                throw error?.data || error;
            }
        },
        async deleteAuteur(id: string) {
            const { $api } = useNuxtApp();
            try {
                await $api(`/auteurs/${id}`, {
                    method: 'DELETE',
                });
                this.auteurs = this.auteurs.filter((a) => a.id !== id);
            } catch (error) {
                console.error("Erreur suppression auteur", error);
            }
        },
    },
});
