import { defineStore } from "pinia";

export interface Popup {
    id: string;
    image_url: string;
    is_active: boolean;
    link?: string;
    created_at?: string;
    updated_at?: string;
}

export const usePopupStore = defineStore("popup", {
    state: () => ({
        popups: [] as Popup[],
        loading: false,
    }),

    actions: {
        async fetchPopups() {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                const res: any = await $api("/popups");
                this.popups = res.data ?? res;
            } catch (error) {
                console.error("Erreur fetchPopups", error);
            } finally {
                this.loading = false;
            }
        },

        async createPopup(payload: {
            image: File;
            is_active?: boolean;
            link?: string;
        }) {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                const formData = new FormData();
                formData.append("image", payload.image);
                if (payload.is_active !== undefined) formData.append("is_active", payload.is_active ? "1" : "0");
                if (payload.link) formData.append("link", payload.link);

                const res: any = await $api("/popups", {
                    method: "POST",
                    body: formData,
                });
                const newPopup: Popup = res.data ?? res;
                // If the new popup is active, deactivate others in local state
                if (newPopup.is_active) {
                    this.popups.forEach(p => p.is_active = false);
                }
                this.popups.push(newPopup);
                return newPopup;
            } catch (error: any) {
                throw error?.data || error;
            } finally {
                this.loading = false;
            }
        },

        async updatePopup(id: string, payload: {
            image?: File;
            is_active?: boolean;
            link?: string;
        }) {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                const formData = new FormData();
                if (payload.image) formData.append("image", payload.image);
                if (payload.is_active !== undefined) formData.append("is_active", payload.is_active ? "1" : "0");
                if (payload.link !== undefined) formData.append("link", payload.link);

                const res: any = await $api(`/popups/${id}`, {
                    method: "POST", // Use POST for multipart updates in Laravel
                    body: formData,
                });
                const updatedPopup: Popup = res.data ?? res;
                
                // Update local state and handle activation exclusivity
                if (updatedPopup.is_active) {
                    this.popups.forEach(p => {
                        if (p.id !== id) p.is_active = false;
                    });
                }
                
                const index = this.popups.findIndex((p) => p.id === id);
                if (index !== -1) this.popups[index] = updatedPopup;
                
                return updatedPopup;
            } catch (error: any) {
                throw error?.data || error;
            } finally {
                this.loading = false;
            }
        },

        async deletePopup(id: string) {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                await $api(`/popups/${id}`, { method: "DELETE" });
                this.popups = this.popups.filter((p) => p.id !== id);
            } catch (error) {
                console.error("Erreur suppression popup", error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
