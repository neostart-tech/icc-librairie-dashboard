import { defineStore } from "pinia";

export interface Banner {
    id: string;
    image_path: string;
    image_url: string;
    title?: string;
    order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export const useBannerStore = defineStore("banner", {
    state: () => ({
        banners: [] as Banner[],
        loading: false,
    }),

    actions: {
        async fetchBanners() {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                const res: any = await $api("/banners");
                this.banners = res.data ?? res;
            } catch (error) {
                console.error("Erreur fetchBanners", error);
            } finally {
                this.loading = false;
            }
        },

        async createBanner(payload: {
            image: File;
            title?: string;
            order?: number;
            is_active?: boolean;
        }) {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                const formData = new FormData();
                formData.append("image", payload.image);
                if (payload.title) formData.append("title", payload.title);
                if (payload.order !== undefined) formData.append("order", payload.order.toString());
                if (payload.is_active !== undefined) formData.append("is_active", payload.is_active ? "1" : "0");

                const res: any = await $api("/banners", {
                    method: "POST",
                    body: formData,
                });
                const newBanner: Banner = res.data ?? res;
                this.banners.push(newBanner);
                return newBanner;
            } catch (error: any) {
                throw error?.data || error;
            } finally {
                this.loading = false;
            }
        },

        async updateBanner(id: string, payload: {
            image?: File;
            title?: string;
            order?: number;
            is_active?: boolean;
        }) {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                const formData = new FormData();
                if (payload.image) formData.append("image", payload.image);
                if (payload.title !== undefined) formData.append("title", payload.title);
                if (payload.order !== undefined) formData.append("order", payload.order.toString());
                if (payload.is_active !== undefined) formData.append("is_active", payload.is_active ? "1" : "0");

                // Note: Laravel requires POST with _method=PUT or just POST for multipart/form-data updates
                const res: any = await $api(`/banners/${id}`, {
                    method: "POST",
                    body: formData,
                });
                const updatedBanner: Banner = res.data ?? res;
                const index = this.banners.findIndex((b) => b.id === id);
                if (index !== -1) this.banners[index] = updatedBanner;
                return updatedBanner;
            } catch (error: any) {
                throw error?.data || error;
            } finally {
                this.loading = false;
            }
        },

        async deleteBanner(id: string) {
            const { $api } = useNuxtApp();
            this.loading = true;
            try {
                await $api(`/banners/${id}`, { method: "DELETE" });
                this.banners = this.banners.filter((b) => b.id !== id);
            } catch (error) {
                console.error("Erreur suppression bannière", error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
